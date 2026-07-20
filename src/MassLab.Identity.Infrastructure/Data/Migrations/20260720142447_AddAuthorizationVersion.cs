using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MassLab.Identity.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddAuthorizationVersion : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AuthorizationVersion",
                table: "AspNetUsers",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AuthorizationVersion",
                table: "AspNetUsers");
        }
    }
}
