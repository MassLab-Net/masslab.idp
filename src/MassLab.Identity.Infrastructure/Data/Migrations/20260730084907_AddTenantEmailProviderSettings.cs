using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MassLab.Identity.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddTenantEmailProviderSettings : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "EmailVerificationTemplate",
                table: "TenantSmtpSettings",
                type: "character varying(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "PasswordResetTemplate",
                table: "TenantSmtpSettings",
                type: "character varying(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Provider",
                table: "TenantSmtpSettings",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "ResendApiKeyProtected",
                table: "TenantSmtpSettings",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SesAccessKeyProtected",
                table: "TenantSmtpSettings",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SesConfigurationSetName",
                table: "TenantSmtpSettings",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SesRegion",
                table: "TenantSmtpSettings",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SesSecretKeyProtected",
                table: "TenantSmtpSettings",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "EmailVerificationTemplate",
                table: "TenantSmtpSettings");

            migrationBuilder.DropColumn(
                name: "PasswordResetTemplate",
                table: "TenantSmtpSettings");

            migrationBuilder.DropColumn(
                name: "Provider",
                table: "TenantSmtpSettings");

            migrationBuilder.DropColumn(
                name: "ResendApiKeyProtected",
                table: "TenantSmtpSettings");

            migrationBuilder.DropColumn(
                name: "SesAccessKeyProtected",
                table: "TenantSmtpSettings");

            migrationBuilder.DropColumn(
                name: "SesConfigurationSetName",
                table: "TenantSmtpSettings");

            migrationBuilder.DropColumn(
                name: "SesRegion",
                table: "TenantSmtpSettings");

            migrationBuilder.DropColumn(
                name: "SesSecretKeyProtected",
                table: "TenantSmtpSettings");
        }
    }
}
