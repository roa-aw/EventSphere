using System.ComponentModel.DataAnnotations;

namespace EventSphere.API.DTOs;

public class BookingRequestDTO
{
    [Required]
    public Guid EventId { get; set; }

    [Required]
    public Guid SeatId { get; set; }
}