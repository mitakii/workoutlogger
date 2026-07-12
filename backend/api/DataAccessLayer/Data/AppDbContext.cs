using DataAccessLayer.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace DataAccessLayer.Data;

public class AppDbContext : IdentityDbContext<User, IdentityRole<Guid>,  Guid>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
        
    }
    
    public DbSet<Workout> Workouts { get; set; }
    public DbSet<Exercise> Exercises { get; set; }
    public DbSet<ExerciseTranslations> ExerciseTranslations { get; set; }
    public DbSet<UserExercise> UserExercises { get; set; }
    public DbSet<UserExerciseSet> UserExerciseSet { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }
    public DbSet<UserTemplate> UserTemplates { get; set; }
    public DbSet<UserStatistics> UserStatistics { get; set; }
    public DbSet<DailyStatistics> DailyStatistics { get; set; }
    public DbSet<ExerciseStatistics> ExerciseStatistics { get; set; }
    
    

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.Entity<ExerciseTranslations>()
            .HasIndex(et => new {et.ExerciseId, et.Language})
            .IsUnique();

        modelBuilder.Entity<UserTemplate>()
            .HasMany(t => t.Exercises)
            .WithMany();
        
    }
}