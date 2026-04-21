namespace EventSphere.API.Entities;

public class Booking
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }
    public User? User { get; set; } 

    public Guid EventId { get; set; }
    public Event? Event { get; set; }

    public Guid SeatId { get; set; }
    public Seat? Seat { get; set; }

    public DateTime CreatedAt { get; set; }
}