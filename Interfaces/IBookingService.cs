using EventSphere.API.DTOs;

namespace EventSphere.API.Interfaces;

public interface IBookingService
{
    Task<BookingResponseDTO> CreateBooking(Guid userId, BookingRequestDTO request);
}