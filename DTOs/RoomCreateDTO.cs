namespace EventSphere.API.DTOs;

public class RoomCreateDTO
{
    public string Name { get; set; }
    public int Capacity { get; set; }
    public string? ImageUrl { get; set; }
}