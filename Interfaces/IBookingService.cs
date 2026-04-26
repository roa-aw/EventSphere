using EventSphere.API.DTOs;

namespace EventSphere.API.Interfaces;

public interface IBookingService
{
    Task<BookingResponseDTO> CreateBooking(Guid userId, BookingRequestDTO request);
    Task<IEnumerable<BookingResponseDTO>> GetUserBookings(Guid userId);
    Task<bool> CancelBooking(Guid userId, Guid bookingId);
    Task<BookingResponseDTO?> GetBookingWithDetails(Guid userId, Guid bookingId);
}