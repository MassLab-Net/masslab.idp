using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MassLab.Identity.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class ProtectBootstrapUsers : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsBootstrapUser",
                table: "AspNetUsers",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsBootstrapUser",
                table: "AspNetUsers");
        }
    }
}
