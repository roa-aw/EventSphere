namespace EventSphere.API.DTOs;

public class RoomResponseDTO
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public int Capacity { get; set; }
    public string? ImageUrl { get; set; }
}