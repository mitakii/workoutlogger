using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataAccessLayer.Migrations
{
    /// <inheritdoc />
    public partial class ExerciseStatisticsUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ExerciseStatistics_AspNetUsers_UserId",
                table: "ExerciseStatistics");

            migrationBuilder.DropIndex(
                name: "IX_ExerciseStatistics_UserId",
                table: "ExerciseStatistics");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "ExerciseStatistics");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "UserId",
                table: "ExerciseStatistics",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_ExerciseStatistics_UserId",
                table: "ExerciseStatistics",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_ExerciseStatistics_AspNetUsers_UserId",
                table: "ExerciseStatistics",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
