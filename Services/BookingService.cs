using System;
using System.Threading.Tasks;
using EventSphere.API.Data;
using EventSphere.API.DTOs;
using EventSphere.API.Entities;
using EventSphere.API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EventSphere.API.Services;

public class BookingService : IBookingService
{
    private readonly AppDbContext _context;

    public BookingService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<BookingResponseDTO> CreateBooking(Guid userId, BookingRequestDTO request)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();

        // Check if event exists
        var eventEntity = await _context.Events.FindAsync(request.EventId);
        if (eventEntity == null)
            throw new Exception("Event not found");

        // 🔒 Lock seat (prevents race conditions)
        var seat = await _context.Seats
            .FromSqlRaw("SELECT * FROM \"Seats\" WHERE \"Id\" = {0} FOR UPDATE", request.SeatId)
            .FirstOrDefaultAsync();

        if (seat == null)
            throw new Exception("Seat not found");

        // Check if seat belongs to the event's room
        if (seat.RoomId != eventEntity.RoomId)
            throw new Exception("Seat does not belong to the event's room");

        // 🔥 REMOVE cancelled booking (fixes UNIQUE constraint issue)
        var cancelledBooking = await _context.Bookings
            .FirstOrDefaultAsync(b =>
                b.EventId == request.EventId &&
                b.SeatId == request.SeatId &&
                b.Status == "Cancelled"
            );

        if (cancelledBooking != null)
        {
            _context.Bookings.Remove(cancelledBooking);
        }

        // ❌ Check if already booked (only active bookings)
        var existingBooking = await _context.Bookings
            .AnyAsync(b =>
                b.EventId == request.EventId &&
                b.SeatId == request.SeatId &&
                b.Status != "Cancelled"
            );

        if (existingBooking)
            throw new Exception("Seat already booked");

        // ✅ Create booking
        var booking = new Booking
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            EventId = request.EventId,
            SeatId = request.SeatId,
            CreatedAt = DateTime.UtcNow,
            Status = "Active"
        };

        _context.Bookings.Add(booking);
        await _context.SaveChangesAsync();

        await transaction.CommitAsync();

        return new BookingResponseDTO
        {
            BookingId = booking.Id,
            EventId = booking.EventId,
            SeatId = booking.SeatId,
            CreatedAt = booking.CreatedAt,
            Status = booking.Status
        };
    }

    public async Task<IEnumerable<BookingResponseDTO>> GetUserBookings(Guid userId)
    {
        return await _context.Bookings
            .Where(b => b.UserId == userId)
            .Include(b => b.Event)
            .Include(b => b.Seat)
                .ThenInclude(s => s.Room)
            .Select(b => new BookingResponseDTO
            {
                BookingId = b.Id,
                EventId = b.EventId,
                SeatId = b.SeatId,
                CreatedAt = b.CreatedAt,
                Status = b.Status,
                EventTitle = b.Event != null ? b.Event.Title : "Unknown Event",
                RoomName = b.Seat != null && b.Seat.Room != null
                    ? b.Seat.Room.Name
                    : "Unknown Room",
                SeatNumber = b.Seat != null ? b.Seat.SeatNumber.ToString() : null,
                BookingDate = b.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<bool> CancelBooking(Guid userId, Guid bookingId)
    {
        var booking = await _context.Bookings
            .FirstOrDefaultAsync(b => b.Id == bookingId && b.UserId == userId);

        if (booking == null)
            return false;

        // ✅ Mark as cancelled (keeps history)
        booking.Status = "Cancelled";

        await _context.SaveChangesAsync();

        return true;
    }
}