using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MeetFlow.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddTranscription : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Summary",
                table: "Meetings");

            migrationBuilder.AddColumn<string>(
                name: "Transcription",
                table: "Meetings",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Transcription",
                table: "Meetings");

            migrationBuilder.AddColumn<string>(
                name: "Summary",
                table: "Meetings",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
