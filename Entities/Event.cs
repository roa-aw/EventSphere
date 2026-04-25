namespace EventSphere.API.Entities;

public class Event
{
    public Guid Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public DateTime Date { get; set; }
    public string Category { get; set; }
    public string? ImageUrl { get; set; }

    // Relations
    public Guid RoomId { get; set; }
    public Room Room { get; set; }

    public ICollection<Booking> Bookings { get; set; }
    public Guid CreatedByUserId { get; set; }
    
}