using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataAccessLayer.Migrations
{
    /// <inheritdoc />
    public partial class StatisticsKeyUpdatev2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_StatisticsUpdateQueues",
                table: "StatisticsUpdateQueues");

            migrationBuilder.DropIndex(
                name: "IX_DailyStatistics_UserId",
                table: "DailyStatistics");

            migrationBuilder.DropColumn(
                name: "RefExerciseId",
                table: "StatisticsUpdateQueues");

            migrationBuilder.AddPrimaryKey(
                name: "PK_StatisticsUpdateQueues",
                table: "StatisticsUpdateQueues",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_StatisticsUpdateQueues_UserId_Date",
                table: "StatisticsUpdateQueues",
                columns: new[] { "UserId", "Date" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_DailyStatistics_UserId_Date",
                table: "DailyStatistics",
                columns: new[] { "UserId", "Date" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_StatisticsUpdateQueues",
                table: "StatisticsUpdateQueues");

            migrationBuilder.DropIndex(
                name: "IX_StatisticsUpdateQueues_UserId_Date",
                table: "StatisticsUpdateQueues");

            migrationBuilder.DropIndex(
                name: "IX_DailyStatistics_UserId_Date",
                table: "DailyStatistics");

            migrationBuilder.AddColumn<Guid>(
                name: "RefExerciseId",
                table: "StatisticsUpdateQueues",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddPrimaryKey(
                name: "PK_StatisticsUpdateQueues",
                table: "StatisticsUpdateQueues",
                columns: new[] { "UserId", "Date" });

            migrationBuilder.CreateIndex(
                name: "IX_DailyStatistics_UserId",
                table: "DailyStatistics",
                column: "UserId");
        }
    }
}
