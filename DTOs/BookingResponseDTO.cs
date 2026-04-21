namespace EventSphere.API.DTOs;

public class BookingResponseDTO
{
    public Guid BookingId { get; set; }
    public Guid EventId { get; set; }
    public Guid SeatId { get; set; }
    public DateTime CreatedAt { get; set; }
}