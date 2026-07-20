using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MassLab.Identity.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddOutboxAndTenantConstraints : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RolePermissionAssignments_TenantPermissions_PermissionId",
                table: "RolePermissionAssignments");

            migrationBuilder.DropForeignKey(
                name: "FK_RolePermissionAssignments_TenantRoles_RoleId",
                table: "RolePermissionAssignments");

            migrationBuilder.DropForeignKey(
                name: "FK_UserPermissionAssignments_TenantPermissions_PermissionId",
                table: "UserPermissionAssignments");

            migrationBuilder.DropForeignKey(
                name: "FK_UserRoleAssignments_TenantRoles_RoleId",
                table: "UserRoleAssignments");

            migrationBuilder.DropIndex(
                name: "IX_UserRoleAssignments_RoleId",
                table: "UserRoleAssignments");

            migrationBuilder.DropIndex(
                name: "IX_UserPermissionAssignments_PermissionId",
                table: "UserPermissionAssignments");

            migrationBuilder.DropIndex(
                name: "IX_RolePermissionAssignments_PermissionId",
                table: "RolePermissionAssignments");

            migrationBuilder.AddUniqueConstraint(
                name: "AK_TenantRoles_TenantId_Id",
                table: "TenantRoles",
                columns: new[] { "TenantId", "Id" });

            migrationBuilder.AddUniqueConstraint(
                name: "AK_TenantPermissions_TenantId_Id",
                table: "TenantPermissions",
                columns: new[] { "TenantId", "Id" });

            migrationBuilder.CreateTable(
                name: "OutboxMessages",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Type = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Payload = table.Column<string>(type: "text", nullable: false),
                    ProcessedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    AttemptCount = table.Column<int>(type: "integer", nullable: false),
                    NextAttemptAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    LastError = table.Column<string>(type: "text", nullable: true),
                    TenantId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OutboxMessages", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_UserRoleAssignments_TenantId_RoleId",
                table: "UserRoleAssignments",
                columns: new[] { "TenantId", "RoleId" });

            migrationBuilder.CreateIndex(
                name: "IX_UserPermissionAssignments_TenantId_PermissionId",
                table: "UserPermissionAssignments",
                columns: new[] { "TenantId", "PermissionId" });

            migrationBuilder.CreateIndex(
                name: "IX_RolePermissionAssignments_TenantId_PermissionId",
                table: "RolePermissionAssignments",
                columns: new[] { "TenantId", "PermissionId" });

            migrationBuilder.CreateIndex(
                name: "IX_RolePermissionAssignments_TenantId_RoleId",
                table: "RolePermissionAssignments",
                columns: new[] { "TenantId", "RoleId" });

            migrationBuilder.CreateIndex(
                name: "IX_OutboxMessages_ProcessedAt_NextAttemptAt",
                table: "OutboxMessages",
                columns: new[] { "ProcessedAt", "NextAttemptAt" });

            migrationBuilder.AddForeignKey(
                name: "FK_RolePermissionAssignments_TenantPermissions_TenantId_Permis~",
                table: "RolePermissionAssignments",
                columns: new[] { "TenantId", "PermissionId" },
                principalTable: "TenantPermissions",
                principalColumns: new[] { "TenantId", "Id" },
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_RolePermissionAssignments_TenantRoles_TenantId_RoleId",
                table: "RolePermissionAssignments",
                columns: new[] { "TenantId", "RoleId" },
                principalTable: "TenantRoles",
                principalColumns: new[] { "TenantId", "Id" },
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserPermissionAssignments_TenantPermissions_TenantId_Permis~",
                table: "UserPermissionAssignments",
                columns: new[] { "TenantId", "PermissionId" },
                principalTable: "TenantPermissions",
                principalColumns: new[] { "TenantId", "Id" },
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserRoleAssignments_TenantRoles_TenantId_RoleId",
                table: "UserRoleAssignments",
                columns: new[] { "TenantId", "RoleId" },
                principalTable: "TenantRoles",
                principalColumns: new[] { "TenantId", "Id" },
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_RolePermissionAssignments_TenantPermissions_TenantId_Permis~",
                table: "RolePermissionAssignments");

            migrationBuilder.DropForeignKey(
                name: "FK_RolePermissionAssignments_TenantRoles_TenantId_RoleId",
                table: "RolePermissionAssignments");

            migrationBuilder.DropForeignKey(
                name: "FK_UserPermissionAssignments_TenantPermissions_TenantId_Permis~",
                table: "UserPermissionAssignments");

            migrationBuilder.DropForeignKey(
                name: "FK_UserRoleAssignments_TenantRoles_TenantId_RoleId",
                table: "UserRoleAssignments");

            migrationBuilder.DropTable(
                name: "OutboxMessages");

            migrationBuilder.DropIndex(
                name: "IX_UserRoleAssignments_TenantId_RoleId",
                table: "UserRoleAssignments");

            migrationBuilder.DropIndex(
                name: "IX_UserPermissionAssignments_TenantId_PermissionId",
                table: "UserPermissionAssignments");

            migrationBuilder.DropUniqueConstraint(
                name: "AK_TenantRoles_TenantId_Id",
                table: "TenantRoles");

            migrationBuilder.DropUniqueConstraint(
                name: "AK_TenantPermissions_TenantId_Id",
                table: "TenantPermissions");

            migrationBuilder.DropIndex(
                name: "IX_RolePermissionAssignments_TenantId_PermissionId",
                table: "RolePermissionAssignments");

            migrationBuilder.DropIndex(
                name: "IX_RolePermissionAssignments_TenantId_RoleId",
                table: "RolePermissionAssignments");

            migrationBuilder.CreateIndex(
                name: "IX_UserRoleAssignments_RoleId",
                table: "UserRoleAssignments",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_UserPermissionAssignments_PermissionId",
                table: "UserPermissionAssignments",
                column: "PermissionId");

            migrationBuilder.CreateIndex(
                name: "IX_RolePermissionAssignments_PermissionId",
                table: "RolePermissionAssignments",
                column: "PermissionId");

            migrationBuilder.AddForeignKey(
                name: "FK_RolePermissionAssignments_TenantPermissions_PermissionId",
                table: "RolePermissionAssignments",
                column: "PermissionId",
                principalTable: "TenantPermissions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_RolePermissionAssignments_TenantRoles_RoleId",
                table: "RolePermissionAssignments",
                column: "RoleId",
                principalTable: "TenantRoles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserPermissionAssignments_TenantPermissions_PermissionId",
                table: "UserPermissionAssignments",
                column: "PermissionId",
                principalTable: "TenantPermissions",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserRoleAssignments_TenantRoles_RoleId",
                table: "UserRoleAssignments",
                column: "RoleId",
                principalTable: "TenantRoles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
