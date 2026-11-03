using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataAccessLayer.Migrations
{
    /// <inheritdoc />
    public partial class WorkoutExactTimeCreated : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "DateCreated",
                table: "Workouts",
                newName: "DateOnlyCreated");

            migrationBuilder.AddColumn<DateTime>(
                name: "ExactTimeCreated",
                table: "Workouts",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ExactTimeCreated",
                table: "Workouts");

            migrationBuilder.RenameColumn(
                name: "DateOnlyCreated",
                table: "Workouts",
                newName: "DateCreated");
        }
    }
}
