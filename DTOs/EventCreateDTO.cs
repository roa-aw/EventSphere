namespace EventSphere.API.DTOs;

public class EventCreateDTO
{
    public string Title { get; set; }
    public string Description { get; set; }
    public DateTime Date { get; set; }
    public Guid RoomId { get; set; }
    public string Type { get; set; }
    public string? ImageUrl { get; set; }
}