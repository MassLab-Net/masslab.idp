using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MassLab.Identity.Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class EnforceAssignmentUserTenant : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserPermissionAssignments_AspNetUsers_UserId",
                table: "UserPermissionAssignments");

            migrationBuilder.DropForeignKey(
                name: "FK_UserRoleAssignments_AspNetUsers_UserId",
                table: "UserRoleAssignments");

            migrationBuilder.AddUniqueConstraint(
                name: "AK_AspNetUsers_TenantId_Id",
                table: "AspNetUsers",
                columns: new[] { "TenantId", "Id" });

            migrationBuilder.CreateIndex(
                name: "IX_UserRoleAssignments_TenantId_UserId",
                table: "UserRoleAssignments",
                columns: new[] { "TenantId", "UserId" });

            migrationBuilder.CreateIndex(
                name: "IX_UserPermissionAssignments_TenantId_UserId",
                table: "UserPermissionAssignments",
                columns: new[] { "TenantId", "UserId" });

            migrationBuilder.AddForeignKey(
                name: "FK_UserPermissionAssignments_AspNetUsers_TenantId_UserId",
                table: "UserPermissionAssignments",
                columns: new[] { "TenantId", "UserId" },
                principalTable: "AspNetUsers",
                principalColumns: new[] { "TenantId", "Id" },
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserRoleAssignments_AspNetUsers_TenantId_UserId",
                table: "UserRoleAssignments",
                columns: new[] { "TenantId", "UserId" },
                principalTable: "AspNetUsers",
                principalColumns: new[] { "TenantId", "Id" },
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserPermissionAssignments_AspNetUsers_TenantId_UserId",
                table: "UserPermissionAssignments");

            migrationBuilder.DropForeignKey(
                name: "FK_UserRoleAssignments_AspNetUsers_TenantId_UserId",
                table: "UserRoleAssignments");

            migrationBuilder.DropIndex(
                name: "IX_UserRoleAssignments_TenantId_UserId",
                table: "UserRoleAssignments");

            migrationBuilder.DropIndex(
                name: "IX_UserPermissionAssignments_TenantId_UserId",
                table: "UserPermissionAssignments");

            migrationBuilder.DropUniqueConstraint(
                name: "AK_AspNetUsers_TenantId_Id",
                table: "AspNetUsers");

            migrationBuilder.AddForeignKey(
                name: "FK_UserPermissionAssignments_AspNetUsers_UserId",
                table: "UserPermissionAssignments",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_UserRoleAssignments_AspNetUsers_UserId",
                table: "UserRoleAssignments",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
