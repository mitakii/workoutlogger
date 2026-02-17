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
    
    // public DbSet<Exercise> Exercises { get; set; }
    // public DbSet<ExerciseSet> Sets { get; set; }
    // public DbSet<Tag> Tags { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }

    // protected override void OnModelCreating(ModelBuilder modelBuilder)
    // {
    //     modelBuilder.Entity<Exercise>()
    //         .HasMany(e => e.Sets)
    //         .WithOne(s => s.Exercise)
    //         .HasForeignKey(s => s.ExerciseId);
    //     
    //     modelBuilder.Entity<User>()
    //         .HasMany(e => e.Workouts)
    //         .WithOne(s => s.User)
    //         .HasForeignKey(s => s.UserId);
    // }
}