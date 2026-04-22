using Microsoft.AspNetCore.Mvc;
using EventSphere.API.Data;
using Microsoft.EntityFrameworkCore;

namespace EventSphere.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SeatsController : ControllerBase
{
    private readonly AppDbContext _context;

    public SeatsController(AppDbContext context)
    {
        _context = context;
    }
    
[HttpGet("event/{eventId}")]
public async Task<IActionResult> GetSeatsByEvent(Guid eventId)
{
    var eventEntity = await _context.Events.FindAsync(eventId);

    if (eventEntity == null)
        return NotFound("Event not found");

    var seats = await _context.Seats
        .Where(s => s.RoomId == eventEntity.RoomId)
        .OrderBy(s => s.SeatNumber)
        .Select(s => new
        {
            s.Id,
            s.SeatNumber,
            IsBooked = _context.Bookings
                .Any(b =>
                    b.SeatId == s.Id &&
                    b.EventId == eventId &&
                    b.Status != "Cancelled" // ✅ FIX HERE
                )
        })
        .ToListAsync();

    return Ok(seats);
}
}