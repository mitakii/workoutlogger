using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataAccessLayer.Migrations
{
    /// <inheritdoc />
    public partial class UserTemplateUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "NameNormalized",
                table: "UserTemplates",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<Guid>(
                name: "UserTemplateId",
                table: "Exercises",
                type: "uuid",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserTemplates_UserId",
                table: "UserTemplates",
                column: "UserId");

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

            migrationBuilder.AddForeignKey(
                name: "FK_UserTemplates_AspNetUsers_UserId",
                table: "UserTemplates",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Exercises_UserTemplates_UserTemplateId",
                table: "Exercises");

            migrationBuilder.DropForeignKey(
                name: "FK_UserTemplates_AspNetUsers_UserId",
                table: "UserTemplates");

            migrationBuilder.DropIndex(
                name: "IX_UserTemplates_UserId",
                table: "UserTemplates");

            migrationBuilder.DropIndex(
                name: "IX_Exercises_UserTemplateId",
                table: "Exercises");

            migrationBuilder.DropColumn(
                name: "NameNormalized",
                table: "UserTemplates");

            migrationBuilder.DropColumn(
                name: "UserTemplateId",
                table: "Exercises");
        }
    }
}
