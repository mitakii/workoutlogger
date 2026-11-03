using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataAccessLayer.Migrations
{
    /// <inheritdoc />
    public partial class StatisticsUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LongestStreak",
                table: "UserStatistics");

            migrationBuilder.RenameColumn(
                name: "LastEditedDate",
                table: "Workouts",
                newName: "DateCreated");

            migrationBuilder.RenameColumn(
                name: "TotalMonthsStreak",
                table: "UserStatistics",
                newName: "LongestWeekStreak");

            migrationBuilder.CreateTable(
                name: "DailyStatistics",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    Date = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    TotalWorkouts = table.Column<int>(type: "integer", nullable: false),
                    TotalVolume = table.Column<double>(type: "double precision", nullable: false),
                    TotalDistanceKm = table.Column<double>(type: "double precision", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DailyStatistics", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DailyStatistics_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ExerciseStatistics",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    ExerciseId = table.Column<Guid>(type: "uuid", nullable: false),
                    MaxWeight = table.Column<double>(type: "double precision", nullable: false),
                    MaxDuration = table.Column<double>(type: "double precision", nullable: false),
                    MaxDistanceKm = table.Column<double>(type: "double precision", nullable: false),
                    TotalWeight = table.Column<double>(type: "double precision", nullable: false),
                    TotalSets = table.Column<int>(type: "integer", nullable: false),
                    TotalVolume = table.Column<double>(type: "double precision", nullable: false),
                    TotalDuration = table.Column<double>(type: "double precision", nullable: false),
                    TotalDistanceKm = table.Column<double>(type: "double precision", nullable: false),
                    LastTimeExecuted = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ExerciseStatistics", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ExerciseStatistics_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ExerciseStatistics_Exercises_ExerciseId",
                        column: x => x.ExerciseId,
                        principalTable: "Exercises",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DailyStatistics_UserId",
                table: "DailyStatistics",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_ExerciseStatistics_ExerciseId",
                table: "ExerciseStatistics",
                column: "ExerciseId");

            migrationBuilder.CreateIndex(
                name: "IX_ExerciseStatistics_UserId",
                table: "ExerciseStatistics",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DailyStatistics");

            migrationBuilder.DropTable(
                name: "ExerciseStatistics");

            migrationBuilder.RenameColumn(
                name: "DateCreated",
                table: "Workouts",
                newName: "LastEditedDate");

            migrationBuilder.RenameColumn(
                name: "LongestWeekStreak",
                table: "UserStatistics",
                newName: "TotalMonthsStreak");

            migrationBuilder.AddColumn<int>(
                name: "LongestStreak",
                table: "UserStatistics",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }
    }
}
