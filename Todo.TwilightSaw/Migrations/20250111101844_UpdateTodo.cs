using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Todo.TwilightSaw.Migrations
{
    /// <inheritdoc />
    public partial class UpdateTodo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "List",
                table: "Todos");

            migrationBuilder.AddColumn<bool>(
                name: "IsCompleted",
                table: "Todos",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsCompleted",
                table: "Todos");

            migrationBuilder.AddColumn<string>(
                name: "List",
                table: "Todos",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
