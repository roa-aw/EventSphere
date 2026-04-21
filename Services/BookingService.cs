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

        // 🔒 Pessimistic Lock (VERY IMPORTANT)
        var seat = await _context.Seats
            .FromSqlRaw("SELECT * FROM \"Seats\" WHERE \"Id\" = {0} FOR UPDATE", request.SeatId)
            .FirstOrDefaultAsync();

        if (seat == null)
            throw new Exception("Seat not found");

        // Check if seat belongs to the event's room
        if (seat.RoomId != eventEntity.RoomId)
            throw new Exception("Seat does not belong to the event's room");

        // ❌ Check if already booked
        var existingBooking = await _context.Bookings
            .AnyAsync(b => b.EventId == request.EventId && b.SeatId == request.SeatId);

        if (existingBooking)
            throw new Exception("Seat already booked");

        // ✅ Create booking
        var booking = new Booking
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            EventId = request.EventId,
            SeatId = request.SeatId,
            CreatedAt = DateTime.UtcNow
        };

        _context.Bookings.Add(booking);
        await _context.SaveChangesAsync();

        await transaction.CommitAsync();

        return new BookingResponseDTO
        {
            BookingId = booking.Id,
            EventId = booking.EventId,
            SeatId = booking.SeatId,
            CreatedAt = booking.CreatedAt
        };
    }
}