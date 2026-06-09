using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MassLab.Identity.Web.Data.Migrations
{
    /// <inheritdoc />
    public partial class RequirePermissionCategoryAllowNullDescription : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                UPDATE "TenantPermissions"
                SET "Category" = 'Ungrouped'
                WHERE "Category" IS NULL OR btrim("Category") = '';
                """);

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "TenantPermissions",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "Category",
                table: "TenantPermissions",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "TenantPermissions",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Category",
                table: "TenantPermissions",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");
        }
    }
}
