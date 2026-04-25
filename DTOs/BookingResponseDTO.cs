namespace EventSphere.API.DTOs;

public class BookingResponseDTO
{
    public Guid BookingId { get; set; }
    public Guid EventId { get; set; }
    public Guid SeatId { get; set; }
    public DateTime CreatedAt { get; set; }

    public string Status { get; set; }
    public string EventTitle { get; set; }
    public string RoomName { get; set; }

    public string SeatNumber { get; set; } 
    public DateTime BookingDate { get; set; }
}