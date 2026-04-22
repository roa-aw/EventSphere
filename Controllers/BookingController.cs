using EventSphere.API.DTOs;
using EventSphere.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[ApiController]
[Route("api/[controller]")]
public class BookingsController : ControllerBase
{
    private readonly IBookingService _bookingService;

    public BookingsController(IBookingService bookingService)
    {
        _bookingService = bookingService;
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> CreateBooking(BookingRequestDTO request)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || string.IsNullOrEmpty(userIdClaim.Value))
        {
            return Unauthorized();
        }
        var userId = Guid.Parse(userIdClaim.Value);

        var result = await _bookingService.CreateBooking(userId, request);

        return Ok(result);
    }

    [Authorize]
[HttpGet]
public async Task<IActionResult> GetBookings()
{
    var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

    if (userIdClaim == null || string.IsNullOrEmpty(userIdClaim.Value))
    {
        return Unauthorized();
    }

    var userId = Guid.Parse(userIdClaim.Value);

    var bookings = await _bookingService.GetUserBookings(userId);

    return Ok(bookings);
}

[Authorize]
[HttpDelete("{id}")]
public async Task<IActionResult> CancelBooking(Guid id)

{
    Console.WriteLine("DELETE HIT: " + id);
    var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

    if (userIdClaim == null)
        return Unauthorized();

    var userId = Guid.Parse(userIdClaim.Value);

    var result = await _bookingService.CancelBooking(userId, id);

    if (!result)
        return NotFound();

    return Ok(new { message = "Booking cancelled successfully" });
}

}