namespace EventSphere.API.Entities;

public class Seat
{
    public Guid Id { get; set; }
    public int SeatNumber { get; set; }

    public Guid RoomId { get; set; }
    public Room Room { get; set; }

    public ICollection<Booking> Bookings { get; set; }
}