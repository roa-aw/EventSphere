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

    [HttpGet]
    public async Task<IActionResult> GetSeats()
    {
        var seats = await _context.Seats
            .Select(s => new { s.Id, s.SeatNumber, s.RoomId })
            .ToListAsync();

        return Ok(seats);
    }
}