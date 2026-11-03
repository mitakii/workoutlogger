using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DataAccessLayer.Migrations
{
    /// <inheritdoc />
    public partial class StatisticsKeyUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_StatisticsUpdateQueues",
                table: "StatisticsUpdateQueues");

            migrationBuilder.AddPrimaryKey(
                name: "PK_StatisticsUpdateQueues",
                table: "StatisticsUpdateQueues",
                columns: new[] { "UserId", "Date" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_StatisticsUpdateQueues",
                table: "StatisticsUpdateQueues");

            migrationBuilder.AddPrimaryKey(
                name: "PK_StatisticsUpdateQueues",
                table: "StatisticsUpdateQueues",
                column: "Id");
        }
    }
}
