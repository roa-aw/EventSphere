using EventSphere.API.DTOs;
using EventSphere.API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;
using Microsoft.EntityFrameworkCore;
using EventSphere.API.Data;
using QRCoder;


[ApiController]
[Route("api/[controller]")]
public class BookingsController : ControllerBase
{
    private readonly IBookingService _bookingService;
    private readonly AppDbContext _context;

    public BookingsController(IBookingService bookingService, AppDbContext context)
{
    _bookingService = bookingService;
    _context = context;
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

[Authorize]
[HttpGet("{id}/ticket")]
public async Task<IActionResult> DownloadTicket(Guid id)
{
    var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

    if (userIdClaim == null || string.IsNullOrEmpty(userIdClaim.Value))
        return Unauthorized();

    var userId = Guid.Parse(userIdClaim.Value);

    var booking = await _context.Bookings
        .Where(b => b.Id == id && b.UserId == userId)
        .Select(b => new
        {
            b.Id,
            b.Status,
            EventTitle = b.Event.Title,
            RoomName = b.Seat.Room.Name,
            SeatNumber = b.Seat.SeatNumber,
            EventDate = b.Event.Date
        })
        .FirstOrDefaultAsync();

    if (booking == null)
        return NotFound();

    if (booking.Status == "Cancelled")
        return BadRequest("Cannot generate ticket");

        var qrContent = $"EVENTSPHERE|{booking.Id}|{booking.EventTitle}|SEAT-{booking.SeatNumber}";

var qrGenerator = new QRCodeGenerator();
var qrData = qrGenerator.CreateQrCode(qrContent, QRCodeGenerator.ECCLevel.Q);
var qrCode = new PngByteQRCode(qrData);
byte[] qrBytes = qrCode.GetGraphic(10);

    var pdf = Document.Create(container =>
{
    container.Page(page =>
    {
        page.Size(595, 220, Unit.Point);  // landscape ticket proportions
        page.Margin(0);
        page.DefaultTextStyle(x => x.FontFamily("Arial"));

        page.Content().Row(row =>
        {
            // ═══════════════════════════════
            // LEFT: MAIN TICKET BODY
            // ═══════════════════════════════
            row.RelativeItem().Background("#1a1a2e").Column(col =>
            {
                col.Spacing(0);

                // TOP ACCENT BAR
                col.Item().Background("#7C3AED").Height(6);

                col.Item().Padding(24).Column(main =>
                {
                    main.Spacing(12);

                    // BRAND + TICKET LABEL
                    main.Item().Row(r =>
                    {
                        r.RelativeItem().Text("EVENTSPHERE")
                            .FontSize(9)
                            .FontColor("#7C3AED")
                            .Bold()
                            .LetterSpacing(3);

                        r.AutoItem().Text($"#{booking.Id.ToString().Substring(0, 8).ToUpper()}")
                            .FontSize(9)
                            .FontColor("#6B7280");
                    });

                    // EVENT TITLE (hero)
                    main.Item().Text(booking.EventTitle)
                        .FontSize(24)
                        .Bold()
                        .FontColor(Colors.White);

                    // DIVIDER
                    main.Item().LineHorizontal(1).LineColor("#374151");

                    // DETAILS ROW
                    main.Item().Row(r =>
                    {
                        // DATE
                        r.RelativeItem().Column(c =>
                        {
                            c.Item().Text("DATE")
                                .FontSize(7).FontColor("#6B7280").Bold();
                            c.Item().Text(booking.EventDate.ToString("dd MMM yyyy"))
                                .FontSize(14).Bold().FontColor(Colors.White);
                        });

                        // TIME
                        r.RelativeItem().Column(c =>
                        {
                            c.Item().Text("TIME")
                                .FontSize(7).FontColor("#6B7280").Bold();
                            c.Item().Text(booking.EventDate.ToString("hh:mm tt", System.Globalization.CultureInfo.InvariantCulture))
                                .FontSize(14).Bold().FontColor(Colors.White);
                        });

                        // ROOM
                        r.RelativeItem().Column(c =>
                        {
                            c.Item().Text("VENUE")
                                .FontSize(7).FontColor("#6B7280").Bold();
                            c.Item().Text(booking.RoomName)
                                .FontSize(14).Bold().FontColor(Colors.White);
                        });

                        // SEAT
                        r.RelativeItem().Column(c =>
                        {
                            c.Item().Text("SEAT")
                                .FontSize(7).FontColor("#6B7280").Bold();
                            c.Item().Text(booking.SeatNumber.ToString())
                                .FontSize(14).Bold().FontColor(Colors.White);
                        });
                    });
                });

                // BOTTOM ACCENT BAR
                col.Item().Background("#7C3AED").Height(6);
            });

            // ═══════════════════════════════
            // DASHED TEAR LINE
            // ═══════════════════════════════
            row.ConstantItem(2).Background("#374151");

            // ═══════════════════════════════
            // RIGHT: STUB
            // ═══════════════════════════════
            row.ConstantItem(130).Background("#111827").Column(stub =>
            {
                stub.Item().Background("#7C3AED").Height(6);

                stub.Item().Padding(16).Column(s =>
                {
                    s.Spacing(10);

                    s.Item().AlignCenter().Text("ADMIT ONE")
                        .FontSize(10).Bold()
                        .FontColor(Colors.White);
                        

                    // QR placeholder box
                    s.Item().AlignCenter().Width(80).Height(80)
                   .Image(qrBytes);
                });
                stub.Item().Background("#7C3AED").Height(6); // Added missing bottom bar to match left
            });
        }); // Close Row
    }); // Close Page
}).GeneratePdf();
    
    return File(pdf, "application/pdf", "ticket.pdf");

}

[Authorize(Roles = "Admin")]
[HttpGet("all")]
public async Task<IActionResult> GetAllBookings()
{
    var bookings = await _context.Bookings
        .Select(b => new
        {
            b.Id,
            b.Status,
            EventTitle = b.Event.Title,
            RoomName = b.Seat.Room.Name,
            SeatNumber = b.Seat.SeatNumber,
            BookingDate = b.CreatedAt
        })
        .ToListAsync();

    return Ok(bookings);
}

}