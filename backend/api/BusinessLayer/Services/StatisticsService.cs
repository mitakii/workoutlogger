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

    public StatisticsService(AppDbContext context, IStatisticsRepository statisticsRepository)
    {
        _context = context;
        _statisticsRepository = statisticsRepository;
    }

    public async Task ProcessDirtyStatistics()
    {
        var items = await _statisticsRepository.GetDirtyStatisticsOlderThan(TimeSpan.FromMinutes(5));

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

    public async Task<Result<bool>> DeleteStatisticsAsync(Guid userId)
    {
        var userStatistic = await _context.UserStatistics.FirstOrDefaultAsync(us => us.UserId == userId);

        if (userStatistic == null)
            return Result<bool>.Failed(ErrorCode.NotFound, "User statistic not found");

        _context.UserStatistics.Remove(userStatistic);
        await _context.SaveChangesAsync();
        return Result<bool>.Success(true);
    }

    public async Task<Result<bool>> RecalculateUserStatisticsAsync(Guid userId)
    {
        var statistics = await _context.UserStatistics.FirstOrDefaultAsync(us => us.UserId == userId);

        if (statistics == null)
            return Result<bool>.Failed(ErrorCode.NotFound, "User statistic not found");
        
        var data = await _context.DailyStatistics
            .AsNoTracking()
            .Where(w => w.UserId == userId)
            .ToListAsync();

        if (data.Count == 0)
            return Result<bool>.Failed(ErrorCode.NotFound, "No data for statistics");

        statistics.LastUpdated = DateTime.UtcNow;
        statistics.TotalWorkouts = data.Sum(d => d.TotalWorkouts);
        
        statistics.TotalExercises = data.Sum(d => d.TotalExercises);

        statistics.TotalSets = data.Sum(d => d.TotalSets);
        statistics.TotalVolume = data.Sum(d => d.TotalVolume);

        _context.UserStatistics.Update(statistics);
        await _context.SaveChangesAsync();
        return Result<bool>.Success(true);
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
            TotalDistanceKm = s.TotalDistanceKm,
            TotalVolume = s.TotalVolume,
            TotalWorkouts = s.TotalWorkouts,
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
            TotalDistanceKm = data.TotalDistanceKm,
            TotalVolume = data.TotalVolume,
            TotalWorkouts = data.TotalWorkouts,
            UserId = data.UserId,
        });
    }

    public async Task<Result<bool>> CreateDailyStatisticsAsync(Guid userId, DateOnly date)
    {
        var statistic = new DailyStatistics
        {
            Date = date,
            UserId = userId,
            TotalWorkouts = 1,
            TotalVolume = 0,
            TotalDistanceKm = 0,
        };
        await _context.DailyStatistics.AddAsync(statistic);
        await _context.SaveChangesAsync();
        return Result<bool>.Success(true);
    }

    public async Task<Result<bool>> DeleteDailyStatisticsAsync(DateOnly date)
    {
        var statistic = await _context.DailyStatistics
            .FirstOrDefaultAsync(s => s.Date == date);
        if (statistic == null)
            return Result<bool>.Failed(ErrorCode.NotFound, "Statistics not found");
        _context.DailyStatistics.Remove(statistic);
        await _context.SaveChangesAsync();
        return Result<bool>.Success(true);
    }

    public async Task<Result<bool>> DeleteDailyStatisticsAsync(Guid statisticId)
    {
        var statistic = await _context.DailyStatistics
            .FirstOrDefaultAsync(s => s.Id == statisticId);
        if (statistic == null)
            return Result<bool>.Failed(ErrorCode.NotFound, "Statistics not found");
        _context.DailyStatistics.Remove(statistic);
        await _context.SaveChangesAsync();
        return Result<bool>.Success(true);
    }

    public async Task<Result<bool>> RecalculateDailyStatisticsAsync(Guid userId, DateOnly date)
    {
        var statistic = await  _context.DailyStatistics
            .FirstOrDefaultAsync(s => s.UserId == userId && s.Date == date);
        
        if (statistic == null)
            return Result<bool>.Failed(ErrorCode.NotFound, "Statistics not found");

        var workouts = await _context.Workouts
            .AsNoTracking()
            .Where(w => w.UserId == userId && w.DateOnlyCreated == statistic.Date)
            .Select(w => new
            {
                UserExercise = w.UserExercises.Select(ue => new
                {
                    UserExerciseSets = ue.UserExerciseSets.Select(s => new
                    {
                        s.Reps,
                        s.Weight
                    })
                })
            })
            .ToListAsync();

        statistic.TotalWorkouts = workouts.Count;
        var exercises = workouts
            .SelectMany(w => w.UserExercise).ToList();
        
        var sets = exercises
            .SelectMany(ue => ue.UserExerciseSets).ToList();
        
        statistic.TotalVolume = sets
            .Sum(ue => ue.Weight *  ue.Reps);


        statistic.TotalSets = sets.Count;
        statistic.TotalExercises = exercises.Count;
        
        // todo: add types to exercises
        // statistic.TotalDistanceKm =
        
        _context.DailyStatistics.Update(statistic);
        await _context.SaveChangesAsync();
        return Result<bool>.Success(true);
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
            Id = result.Id,
            ExerciseId = result.ExerciseId,
            TotalDistanceKm = result.TotalDistanceKm,
            TotalVolume = result.TotalVolume,
            MaxWeight = result.MaxWeight,
            MaxDuration = result.MaxDuration,
            MaxDistanceKm = result.MaxDistanceKm,
            TotalWeight = result.TotalWeight,
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
            TotalWeight = 0,
            TotalSets = 1,
            TotalDistanceKm = 0,
            TotalVolume = 0,
            TotalDuration = 0,
            MaxDistanceKm = 0,
            MaxDuration = 0,
            MaxWeight = 0
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

    public async Task<Result<bool>> RecalculateExerciseStatisticsAsync(Guid userId, Guid exerciseId)
    {
        var statistic = _context.ExerciseStatistics
            .FirstOrDefault(es => es.UserId == userId && es.ExerciseId == exerciseId);
        
        if (statistic == null)
            return Result<bool>.Failed(ErrorCode.NotFound, "Statistics not found");
        
        var userExercises = await _context.UserExercises
            .AsNoTracking()
            .Where(ue => ue.RefExerciseId == exerciseId)
            .Select(ue => new
            {
                ue.Id,
                Sets = ue.UserExerciseSets.Select(s => new
                {
                    s.Id,
                    s.Weight,
                    s.Reps
                }).ToList()
            })
            .ToListAsync();
        
        if(userExercises.Count == 0)
            return Result<bool>.Failed(ErrorCode.NotFound, "UserExercise not found");
        
        var sets = userExercises.SelectMany(ue => ue.Sets).ToList();
        statistic.MaxWeight = sets.Max(s => s.Weight);

        statistic.TotalWeight = sets.Sum(s => s.Weight);
        statistic.TotalSets = sets.Count;
        statistic.TotalVolume = sets.Sum(s => s.Weight);

        _context.ExerciseStatistics.Update(statistic);
        await _context.SaveChangesAsync();
        return Result<bool>.Success(true);
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