using System.Globalization;
using ApplicationLayer.Data.Enums;
using BusinessLayer.DTO;
using BusinessLayer.Exceptions;
using BusinessLayer.Interfaces;
using DataAccessLayer.Data;
using DataAccessLayer.Entities;
using DataAccessLayer.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace BusinessLayer.Services;

public class StatisticsService : IStatisticsService
{
    private readonly AppDbContext _context;
    private readonly IStatisticsRepository _statisticsRepository;
    private readonly IBackgroundJobService _backgroundJobService;

    public StatisticsService(AppDbContext context, IStatisticsRepository statisticsRepository, IBackgroundJobService backgroundJobService)
    {
        _context = context;
        _statisticsRepository = statisticsRepository;
        _backgroundJobService = backgroundJobService;
    }

    public async Task ProcessDirtyStatistics()
    {
        // todo: in prod change to +-30 min
        // todo: move to env 
        var items = await _statisticsRepository
            .GetDirtyStatisticsOlderThan(TimeSpan.FromMinutes(1));
        
        foreach (var item in items)
        {
            await RecalculateDailyStatisticsAsync(item.UserId, item.Date);
            await RecalculateUserStatisticsAsync(item.UserId);
                
            await _statisticsRepository.MarkClean(item.UserId, item.Date);
        }
    }

    public async Task<Result<GetUserStatisticResponse>> GetUserStatisticsAsync(Guid userId)
    {
        var userStatistic = await _context.UserStatistics.FirstOrDefaultAsync(us => us.UserId == userId);

        if (userStatistic == null)
            return Result<GetUserStatisticResponse>.Failed(ErrorCode.NotFound, "User statistic not found");

        return Result<GetUserStatisticResponse>.Success(new GetUserStatisticResponse
        {
            TotalExercises = userStatistic.TotalExercises,
            TotalWorkouts = userStatistic.TotalWorkouts,
            TotalSets = userStatistic.TotalSets,
            TotalVolume = userStatistic.TotalVolume,

            TotalDistanceKm = userStatistic.TotalDistanceKm,

            LongestStreak = userStatistic.LongestWeekStreak,
            ConsecutiveWeeksActive = userStatistic.ConsecutiveWeeksActive,

            MaxBenchPress = userStatistic.MaxBenchPress,
            MaxDeadlift = userStatistic.MaxDeadlift,
            MaxSquat = userStatistic.MaxSquat,

            LastUpdated = userStatistic.LastUpdated
        });
    }

    public async Task<Result<bool>> CreateStatisticsAsync(Guid userId)
    {
        var userStatistic = new UserStatistics
        {
            UserId = userId,
            LastUpdated = DateTime.UtcNow
        };

        await _context.UserStatistics.AddAsync(userStatistic);
        await _context.SaveChangesAsync();

        return Result<bool>.Success(true);
    }

    public async Task<Result<bool>> DeleteUserStatisticsAsync(Guid userId)
    {
        var userStatistic = await _context.UserStatistics.FindAsync(userId);

        if (userStatistic == null)
            return Result<bool>.Failed(ErrorCode.NotFound, "User statistic not found");

        _context.UserStatistics.Remove(userStatistic);
        await _context.SaveChangesAsync();
        return Result<bool>.Success(true);
    }

    private const string BenchPressNameTag = "barbell_bench_press";
    private const string SquatNameTag = "barbell_squat";
    private const string DeadliftNameTag = "barbell_deadlift";

    public async Task RecalculateUserStatisticsAsync(Guid userId)
    {
        var statistics = await _context.UserStatistics.FirstOrDefaultAsync(us => us.UserId == userId);

        if (statistics == null)
            throw new Exception("Statistics not found");

        var data = await _context.DailyStatistics
            .AsNoTracking()
            .Where(d => d.UserId == userId)
            .GroupBy(_ => 1)
            .Select(g => new
            {
                TotalDistanceKm = g.Sum(d => d.TotalDistanceKm),
                TotalWorkouts = g.Sum(d => d.TotalWorkouts),
                TotalExercises = g.Sum(d => d.TotalExercises),
                TotalSets = g.Sum(d => d.TotalSets),
                TotalVolume = g.Sum(d => d.TotalVolume),
            })
            .FirstOrDefaultAsync();

        if (data == null)
            throw new Exception("Statistics data not found");

        statistics.LastUpdated = DateTime.UtcNow;
        statistics.TotalWorkouts = data.TotalWorkouts;
        statistics.TotalDistanceKm = data.TotalDistanceKm;
        statistics.TotalExercises = data.TotalExercises;

        statistics.TotalSets = data.TotalSets;
        statistics.TotalVolume = data.TotalVolume;

        var maxLifts = await _context.UserExercises
            .AsNoTracking()
            .Where(ue => ue.Workout.UserId == userId && (
                ue.RefExercise.NameTag == BenchPressNameTag ||
                ue.RefExercise.NameTag == SquatNameTag ||
                ue.RefExercise.NameTag == DeadliftNameTag))
            .SelectMany(ue => ue.UserExerciseSets, (ue, set) => new { ue.RefExercise.NameTag, set.Weight })
            .GroupBy(x => x.NameTag)
            .Select(g => new { NameTag = g.Key, MaxWeight = g.Max(x => x.Weight) })
            .ToListAsync();

        statistics.MaxBenchPress = maxLifts.FirstOrDefault(m => m.NameTag == BenchPressNameTag)?.MaxWeight ?? 0;
        statistics.MaxSquat = maxLifts.FirstOrDefault(m => m.NameTag == SquatNameTag)?.MaxWeight ?? 0;
        statistics.MaxDeadlift = maxLifts.FirstOrDefault(m => m.NameTag == DeadliftNameTag)?.MaxWeight ?? 0;

        statistics.LastUpdated = DateTime.UtcNow;

        _context.UserStatistics.Update(statistics);
        await _context.SaveChangesAsync();
    }

    public async Task<Result<List<DailyStatisticsGetResponse>>> GetDailyStatisticsRangeAsync
        (Guid userId, DateOnly start, DateOnly end)
    {
        var data = await _context.DailyStatistics
            .Where(s => s.UserId == userId && s.Date >= start && s.Date <= end).ToListAsync();
        
        if(data.Count == 0)
            return Result<List<DailyStatisticsGetResponse>>.Failed(ErrorCode.NotFound, "Statistics not found");

        var result = data.Select(s => new DailyStatisticsGetResponse()
        {
            Date = s.Date,
            Id = s.Id,
            WorkouIds = s.Workouts,
            TotalDistanceKm = s.TotalDistanceKm,
            TotalVolume = s.TotalVolume,
            TotalWorkouts = s.TotalWorkouts,
            TotalExercises = s.TotalExercises,
            TotalSets = s.TotalSets,
            UserId = s.UserId,
        }).ToList();
        
        return Result<List<DailyStatisticsGetResponse>>.Success(result);
    }

    public async Task<Result<DailyStatisticsGetResponse>> GetDailyStatisticsAsync(Guid userId, DateOnly date)
    {
        var data = await _context.DailyStatistics
            .FirstOrDefaultAsync(s => s.UserId == userId && s.Date == date);
        if (data == null)
            return Result<DailyStatisticsGetResponse>.Failed(ErrorCode.NotFound, "Statistics not found");
        
        return Result<DailyStatisticsGetResponse>.Success( new DailyStatisticsGetResponse()
        {
            Date = data.Date,
            Id = data.Id,
            WorkouIds = data.Workouts,
            TotalDistanceKm = data.TotalDistanceKm,
            TotalVolume = data.TotalVolume,
            TotalWorkouts = data.TotalWorkouts,
            TotalExercises = data.TotalExercises,
            TotalSets = data.TotalSets,
            UserId = data.UserId,
        });
    }

    public async Task<Result<bool>> CreateDailyStatisticsAsync(Guid userId, DateOnly date)
    {
        var statistic = new DailyStatistics
        {
            Date = date,
            UserId = userId,
            TotalWorkouts = 0,
            TotalVolume = 0,
            TotalDistanceKm = 0,
        };
        await _context.DailyStatistics.AddAsync(statistic);
        await _context.SaveChangesAsync();
        
        _backgroundJobService.Enqueue<IStatisticsService>(x => x.RecalculateStreak(userId));
        
        return Result<bool>.Success(true);
    }

    public async Task<Result<bool>> DeleteDailyStatisticsAsync(Guid userId, DateOnly date)
    {
        var statistic = await _context.DailyStatistics
            .FirstOrDefaultAsync(s => s.Date == date && s.UserId == userId);
        if (statistic == null)
            return Result<bool>.Failed(ErrorCode.NotFound, "Statistics not found");
        _context.DailyStatistics.Remove(statistic);
        await _context.SaveChangesAsync();
        return Result<bool>.Success(true);
    }

    public async Task<Result<bool>> DeleteDailyStatisticsAsync(Guid statisticId)
    {
        var statistic = await _context.DailyStatistics
            .FindAsync(statisticId);
        if (statistic == null)
            return Result<bool>.Failed(ErrorCode.NotFound, "Statistics not found");
        _context.DailyStatistics.Remove(statistic);
        await _context.SaveChangesAsync();
        return Result<bool>.Success(true);
    }

    public async Task RecalculateDailyStatisticsAsync(Guid userId, DateOnly date)
    {
        var statistic = await  _context.DailyStatistics
            .FirstOrDefaultAsync(s => s.UserId == userId && s.Date == date);
        
        if (statistic == null)
            throw new Exception("Daily statistics not found");

        var data = await _context.Workouts
            .AsNoTracking()
            .Where(w => w.UserId == userId && w.DateOnlyCreated == statistic.Date)
            .GroupBy(_ => 1)
            .Select(g => new
            {
                WorkoutIds = g.Select(w => w.Id).ToArray(),
                TotalWorkoutsCount = g.Count(),
                TotalSetsCount = g.SelectMany(w=> w.UserExercises)
                    .SelectMany(ue => ue.UserExerciseSets)
                    .Count(),
                TotalExercisesCount = g.SelectMany(w=> w.UserExercises).Count(),
                TotalVolume =  g.SelectMany(w=> w.UserExercises)
                    .SelectMany(ue => ue.UserExerciseSets)
                    .Sum(s => s.Weight * s.Reps),
            })
            .FirstOrDefaultAsync();

        if (data == null)
            throw new  Exception("Daily statistics data not found");
        
        statistic.TotalWorkouts = data.TotalWorkoutsCount;
        statistic.TotalVolume = data.TotalVolume;
        statistic.TotalSets = data.TotalSetsCount;
        statistic.TotalExercises = data.TotalExercisesCount;
        statistic.Workouts = data.WorkoutIds;
        
        // todo: add types to exercises
        // statistic.TotalDistanceKm =
        
        _context.DailyStatistics.Update(statistic);
        await _context.SaveChangesAsync();
    }

    public async Task<Result<bool>> DailyStatisticsExistAsync(Guid userId, DateOnly date)
    {
        var statistic = await  _context.DailyStatistics
            .FirstOrDefaultAsync(s => s.UserId == userId && s.Date == date);
        
        if (statistic == null)
            return Result<bool>.Failed(ErrorCode.NotFound, "Statistics not found");
        return Result<bool>.Success(true);
    }

    public async Task<Result<ExerciseStatisticsGetResponse>> GetExerciseStatisticsAsync(Guid userId, Guid exerciseId)
    {
        var result = await _context.ExerciseStatistics
            .FirstOrDefaultAsync(es => es.UserId == userId && es.ExerciseId == exerciseId);
        if (result == null)
            return Result<ExerciseStatisticsGetResponse>.Failed(ErrorCode.NotFound, "Statistics not found");

        return Result<ExerciseStatisticsGetResponse>.Success(new ExerciseStatisticsGetResponse()
        {
            ExerciseId = result.ExerciseId,
            TotalDistanceKm = result.TotalDistanceKm,
            TotalVolume = result.TotalVolume,
            MaxWeight = result.MaxWeight,
            MaxDuration = result.MaxDuration,
            MaxDistanceKm = result.MaxDistanceKm,
            TotalDuration = result.TotalDuration,
            TotalSets = result.TotalSets,
        });
    }

    public async Task<Result<bool>> CreateExerciseStatisticsAsync(Guid userId, Guid exerciseId)
    {
        var statistic = new ExerciseStatistics
        {
            ExerciseId = exerciseId,
            UserId = userId,
            TotalSets = 1,
        };
        
        await  _context.ExerciseStatistics.AddAsync(statistic);
        await _context.SaveChangesAsync();
        return Result<bool>.Success(true);
    }

    public async Task<Result<bool>> DeleteExerciseStatisticsAsync(Guid userId, Guid exerciseId)
    {
        var statistic = await _context.ExerciseStatistics
            .FirstOrDefaultAsync(es => es.UserId == userId && es.ExerciseId == exerciseId);
        
        if (statistic == null)
            return Result<bool>.Failed(ErrorCode.NotFound, "Statistics not found");
        
        _context.ExerciseStatistics.Remove(statistic);
        await _context.SaveChangesAsync();
        return Result<bool>.Success(true);
    }

    public async Task<Result<bool>> RecalculateExerciseStatisticsAsync(Guid userId, Guid refExerciseId)
    {
        var statistic = await _context.ExerciseStatistics
            .FirstOrDefaultAsync(es => es.UserId == userId && es.ExerciseId == refExerciseId);
        
        if (statistic == null)
            return Result<bool>.Failed(ErrorCode.NotFound, "Statistics not found");
        
        var userExerciseStatistic = await _context.UserExercises
            .AsNoTracking()
            .Where(ue => ue.RefExerciseId == refExerciseId && ue.Workout.UserId == userId)
            .GroupBy(_ => 1)
            .Select(x => new
            {
                MaxWeight = x.SelectMany(ue => ue.UserExerciseSets).Max(s => s.Weight),
                TotalVolume = x.SelectMany(ue => ue.UserExerciseSets).Sum(s => s.Weight * s.Reps),
                TotalSets = x.SelectMany(ue => ue.UserExerciseSets).Count(),
            })
            .FirstOrDefaultAsync();
        
        if(userExerciseStatistic == null)
            return Result<bool>.Failed(ErrorCode.NotFound, "UserExercise not found");
        
        statistic.MaxWeight = userExerciseStatistic.MaxWeight;
        statistic.TotalSets = userExerciseStatistic.TotalSets;
        statistic.TotalVolume = userExerciseStatistic.TotalVolume;
        statistic.LastTimeExecuted = DateOnly.FromDateTime(DateTime.Now);
        statistic.LastUpdate = DateTime.UtcNow;

        _context.ExerciseStatistics.Update(statistic);
        await _context.SaveChangesAsync();
        return Result<bool>.Success(true);
    }

    public async Task<Result<ExistDto>> ExerciseStatisticsExistAsync(Guid userId, Guid exerciseId)
    {
        var statistic = await  _context.ExerciseStatistics
            .FirstOrDefaultAsync(s => s.UserId == userId && s.ExerciseId == exerciseId);
        
        if(statistic == null)
            return Result<ExistDto>.Failed(ErrorCode.NotFound, "Statistics not found");
        
        return Result<ExistDto>.Success(new ExistDto()
        {
            Success = true,
            LastUpdate = statistic.LastUpdate,
        });
    }

    public async Task<Result<bool>> RecalculateStreak(Guid userId)
    {
        var statistics = await _context.UserStatistics.FirstOrDefaultAsync(us => us.UserId == userId);
        if (statistics == null)
            return Result<bool>.Failed(ErrorCode.NotFound, "User statistic not found");
        
        var data = await _context.Workouts
            .AsNoTracking()
            .Where(w => w.UserId == userId)
            .Select(w => new
            {
                w.Id,
                LastEditedDate = w.DateOnlyCreated,
            }).ToListAsync();
        
        if (data.Count == 0)
            return Result<bool>.Failed(ErrorCode.NotFound, "No data for statistics");
        
        var longestWeekStreak = 0;
        var currentWeekStreak = 0;
        DateOnly? prev = null;

        foreach (var week in data
                     .Select(w => w.LastEditedDate.ToDateTime(TimeOnly.MinValue))
                     .Select(d => DateOnly.FromDateTime(
                         ISOWeek.ToDateTime(
                             ISOWeek.GetYear(d),
                             ISOWeek.GetWeekOfYear(d),
                             DayOfWeek.Monday)))
                     .Distinct()
                     .OrderBy(d => d))
        {
            if (prev == null)
                currentWeekStreak = 1;
            else if (week.DayNumber - prev.Value.DayNumber == 7)
                currentWeekStreak++;
            else
                currentWeekStreak = 1;

            longestWeekStreak = Math.Max(longestWeekStreak, currentWeekStreak);
            prev = week;
        }

        statistics.ConsecutiveWeeksActive = currentWeekStreak;
        statistics.LongestWeekStreak = longestWeekStreak;

        _context.UserStatistics.Update(statistics);
        await _context.SaveChangesAsync();
        return Result<bool>.Success(true);
    }
}