using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MeetFlow.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddUsersTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TaskItem_Meetings_MeetingId",
                table: "TaskItem");

            migrationBuilder.DropForeignKey(
                name: "FK_TaskItem_Users_AssignedUserId",
                table: "TaskItem");

            migrationBuilder.DropPrimaryKey(
                name: "PK_TaskItem",
                table: "TaskItem");

            migrationBuilder.RenameTable(
                name: "TaskItem",
                newName: "Tasks");

            migrationBuilder.RenameIndex(
                name: "IX_TaskItem_MeetingId",
                table: "Tasks",
                newName: "IX_Tasks_MeetingId");

            migrationBuilder.RenameIndex(
                name: "IX_TaskItem_AssignedUserId",
                table: "Tasks",
                newName: "IX_Tasks_AssignedUserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Tasks",
                table: "Tasks",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Tasks_Meetings_MeetingId",
                table: "Tasks",
                column: "MeetingId",
                principalTable: "Meetings",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Tasks_Users_AssignedUserId",
                table: "Tasks",
                column: "AssignedUserId",
                principalTable: "Users",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Tasks_Meetings_MeetingId",
                table: "Tasks");

            migrationBuilder.DropForeignKey(
                name: "FK_Tasks_Users_AssignedUserId",
                table: "Tasks");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Tasks",
                table: "Tasks");

            migrationBuilder.RenameTable(
                name: "Tasks",
                newName: "TaskItem");

            migrationBuilder.RenameIndex(
                name: "IX_Tasks_MeetingId",
                table: "TaskItem",
                newName: "IX_TaskItem_MeetingId");

            migrationBuilder.RenameIndex(
                name: "IX_Tasks_AssignedUserId",
                table: "TaskItem",
                newName: "IX_TaskItem_AssignedUserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_TaskItem",
                table: "TaskItem",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_TaskItem_Meetings_MeetingId",
                table: "TaskItem",
                column: "MeetingId",
                principalTable: "Meetings",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TaskItem_Users_AssignedUserId",
                table: "TaskItem",
                column: "AssignedUserId",
                principalTable: "Users",
                principalColumn: "Id");
        }
    }
}
