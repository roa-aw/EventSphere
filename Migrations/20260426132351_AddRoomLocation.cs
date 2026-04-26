using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace EventSphere.API.Migrations
{
    /// <inheritdoc />
    public partial class AddRoomLocation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "Latitude",
                table: "Rooms",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "Longitude",
                table: "Rooms",
                type: "double precision",
                nullable: false,
                defaultValue: 0.0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Latitude",
                table: "Rooms");

            migrationBuilder.DropColumn(
                name: "Longitude",
                table: "Rooms");
        }
    }
}
