namespace EventSphere.API.DTOs;

public class EventResponseDTO
{
    public Guid Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public DateTime Date { get; set; }
    public string Type { get; set; }
}