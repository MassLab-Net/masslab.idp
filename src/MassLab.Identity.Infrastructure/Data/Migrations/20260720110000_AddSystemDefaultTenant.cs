using System;
using MassLab.Identity.Infrastructure.Data;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MassLab.Identity.Infrastructure.Data.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    [Migration("20260720110000_AddSystemDefaultTenant")]
    public partial class AddSystemDefaultTenant : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsSystemDefault",
                table: "Tenants",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.Sql("""
                UPDATE "Tenants"
                SET "IsSystemDefault" = CASE WHEN "Slug" = 'demo' THEN TRUE ELSE FALSE END;
                """);

            migrationBuilder.CreateIndex(
                name: "IX_Tenants_IsSystemDefault",
                table: "Tenants",
                column: "IsSystemDefault",
                unique: true,
                filter: "\"IsSystemDefault\" = TRUE");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Tenants_IsSystemDefault",
                table: "Tenants");

            migrationBuilder.DropColumn(
                name: "IsSystemDefault",
                table: "Tenants");
        }
    }
}
