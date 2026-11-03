using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataAccessLayer.Migrations
{
    /// <inheritdoc />
    public partial class RemoveExerciseUserTemplateFK : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Exercises_UserTemplates_UserTemplateId",
                table: "Exercises");

            migrationBuilder.DropIndex(
                name: "IX_Exercises_UserTemplateId",
                table: "Exercises");

            migrationBuilder.DropColumn(
                name: "WorkoutId",
                table: "UserTemplates");

            migrationBuilder.DropColumn(
                name: "UserTemplateId",
                table: "Exercises");

            migrationBuilder.CreateTable(
                name: "ExerciseUserTemplate",
                columns: table => new
                {
                    ExercisesId = table.Column<Guid>(type: "uuid", nullable: false),
                    UserTemplateId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ExerciseUserTemplate", x => new { x.ExercisesId, x.UserTemplateId });
                    table.ForeignKey(
                        name: "FK_ExerciseUserTemplate_Exercises_ExercisesId",
                        column: x => x.ExercisesId,
                        principalTable: "Exercises",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ExerciseUserTemplate_UserTemplates_UserTemplateId",
                        column: x => x.UserTemplateId,
                        principalTable: "UserTemplates",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ExerciseUserTemplate_UserTemplateId",
                table: "ExerciseUserTemplate",
                column: "UserTemplateId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ExerciseUserTemplate");

            migrationBuilder.AddColumn<Guid>(
                name: "WorkoutId",
                table: "UserTemplates",
                type: "uuid",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.AddColumn<Guid>(
                name: "UserTemplateId",
                table: "Exercises",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Exercises_UserTemplateId",
                table: "Exercises",
                column: "UserTemplateId");

            migrationBuilder.AddForeignKey(
                name: "FK_Exercises_UserTemplates_UserTemplateId",
                table: "Exercises",
                column: "UserTemplateId",
                principalTable: "UserTemplates",
                principalColumn: "Id");
        }
    }
}
