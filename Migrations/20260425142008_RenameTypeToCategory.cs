using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EventSphere.API.Migrations
{
    /// <inheritdoc />
    public partial class RenameTypeToCategory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Type",
                table: "Events",
                newName: "Category");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Category",
                table: "Events",
                newName: "Type");
        }
    }
}
