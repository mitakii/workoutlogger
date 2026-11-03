using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataAccessLayer.Migrations
{
    /// <inheritdoc />
    public partial class ExerciseStatisticsQueue : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Dirty",
                table: "StatisticsUpdateQueues",
                newName: "IsDirty");

            migrationBuilder.AddColumn<Guid>(
                name: "RefExerciseId",
                table: "StatisticsUpdateQueues",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "RefExerciseId",
                table: "StatisticsUpdateQueues");

            migrationBuilder.RenameColumn(
                name: "IsDirty",
                table: "StatisticsUpdateQueues",
                newName: "Dirty");
        }
    }
}
