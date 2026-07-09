using System.Globalization;
using ApplicationLayer.Data.Enums;
using BusinessLayer.DTO;
using BusinessLayer.Exceptions;
using BusinessLayer.Interfaces;
using DataAccessLayer.Data;
using DataAccessLayer.Entities;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.EntityFrameworkCore;

namespace BusinessLayer.Services;

public class UserStatisticsService : IUserStatisticsService
{
    private readonly AppDbContext _context;

    public UserStatisticsService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Result<GetUserStatisticResponse>> GetUserStatistics(Guid userId)
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

            LastUpdated = userStatistic.LastUpdated,
        });
    }

    public async Task<Result<bool>> CreateStatistic(Guid userId)
    {
        var userStatistic = new UserStatistics()
        {
            UserId = userId,
            LastUpdated = DateTime.UtcNow,
        };
        
        await _context.UserStatistics.AddAsync(userStatistic);
        await _context.SaveChangesAsync();
        
        return Result<bool>.Success(true);
    }

    public async Task<Result<bool>> DeleteStatistic(Guid userId)
    {
        var userStatistic = await _context.UserStatistics.FirstOrDefaultAsync(us => us.UserId == userId);
        
        if (userStatistic == null)
            return Result<bool>.Failed(ErrorCode.NotFound, "User statistic not found");
        
        _context.UserStatistics.Remove(userStatistic);
        await _context.SaveChangesAsync();
        return Result<bool>.Success(true);
    }

    public async Task<Result<bool>> UpdateStatistic(Guid userId, UpdateUserStatisticDto newUserStatistic)
    {
        var userStatistic = await _context.UserStatistics.FirstOrDefaultAsync(us => us.UserId == userId);
        
        if (userStatistic == null)
            return Result<bool>.Failed(ErrorCode.NotFound, "User statistic not found");
        
        userStatistic.TotalWorkouts +=  newUserStatistic.TotalWorkouts;
        userStatistic.TotalExercises +=  newUserStatistic.TotalExercises;
        userStatistic.TotalSets +=  newUserStatistic.TotalSets;
        userStatistic.TotalVolume  +=  newUserStatistic.TotalVolume;
        userStatistic.TotalDistanceKm  +=  newUserStatistic.TotalDistanceKm;
        
        userStatistic.LongestWeekStreak  +=  newUserStatistic.LongestStreak;
        userStatistic.ConsecutiveWeeksActive +=  newUserStatistic.ConsecutiveWeeksActive;
        
        userStatistic.MaxBenchPress +=  newUserStatistic.MaxBenchPress;
        userStatistic.MaxDeadlift +=  newUserStatistic.MaxDeadlift;
        userStatistic.MaxSquat  +=  newUserStatistic.MaxSquat;
        
        userStatistic.LastUpdated = DateTime.UtcNow;
        
        _context.UserStatistics.Update(userStatistic);
        await _context.SaveChangesAsync();

        return Result<bool>.Success(true);
    }

    public async Task<Result<bool>> RecalculateStatistics(Guid userId)
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
                LastEditedDate = w.DateCreated,
                UserExercises = w.UserExercises.Select(ue => new
                {
                    ue.Id,
                    ExerciseSets = ue.UserExerciseSets.Select(s => new
                    {
                        s.Id,
                        s.Weight,
                        s.Reps
                    }).ToList()
                }).ToList()
            }).ToListAsync();
        
        if(data.Count == 0)
            return Result<bool>.Failed(ErrorCode.NotFound, "No data for statistics");

        statistics.LastUpdated = DateTime.UtcNow;
        statistics.TotalWorkouts = data.Count;
        
        var exercises = data
            .SelectMany(w => w.UserExercises).ToList();

        statistics.TotalExercises = exercises.Count;
        
        var sets = exercises
            .SelectMany(s => s.ExerciseSets).ToList();

        statistics.TotalSets = sets.Count;
        statistics.TotalVolume = sets.Sum(s => s.Weight);

        var longestWeekStreak = 0;
        var currentWeekStreak = 0;
        DateTime? prev = null;
        
        foreach (var week in data
                     .Select(w => w.LastEditedDate)
                     .Select(d => ISOWeek.ToDateTime(
                         ISOWeek.GetYear(d),
                         ISOWeek.GetWeekOfYear(d),
                         DayOfWeek.Monday))
                     .Distinct()
                     .OrderBy(d => d))
        {
            if (prev == null)
            {
                currentWeekStreak = 1;
            }
            else if ((week - prev.Value).Days == 7)
            {
                currentWeekStreak++;
            }
            else
            {
                currentWeekStreak = 1;
            }
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