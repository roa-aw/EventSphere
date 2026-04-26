using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using EventSphere.API.DTOs;
using EventSphere.API.Interfaces;
using EventSphere.API.Data;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using EventSphere.API.Entities;


namespace EventSphere.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EventsController : ControllerBase
{
    private readonly IEventService _service;
    private readonly AppDbContext _context; 

    public EventsController(IEventService service, AppDbContext context) 
    {
        _service = service;
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var events = await _service.GetAllEvents();
        return Ok(events);
    }

    [HttpPost]
    [Authorize(Roles = "Admin,EventOrganizer")]
    public async Task<IActionResult> Create(EventCreateDTO dto)
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

        var result = await _service.CreateEvent(dto, userId);

        return Ok(result);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,EventOrganizer")]
    public async Task<IActionResult> Update(Guid id, EventCreateDTO dto)
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
        var role = User.FindFirst(ClaimTypes.Role)?.Value;

        var result = await _service.UpdateEvent(id, dto, userId, role);

        if (!result) return Forbid();

        return Ok();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin,EventOrganizer")]
    public async Task<IActionResult> DeleteEvent(Guid id)
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
        var role = User.FindFirst(ClaimTypes.Role)?.Value;

        var result = await _service.DeleteEvent(id, userId, role);

        if (!result) return Forbid();

        return Ok();
    }

    // ✅ My Events endpoint
    [HttpGet("my")]
    [Authorize(Roles = "EventOrganizer,Admin")]
    public async Task<IActionResult> GetMyEvents()
    {
        var userId = Guid.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

        var events = await _service.GetEventsByUser(userId);

        return Ok(events);
    }

// ✅ APPROVE
[HttpPut("{id}/approve")]
[Authorize(Roles = "Admin")]
public async Task<IActionResult> ApproveEvent(Guid id)
{
    var ev = await _context.Events.FindAsync(id);
    if (ev == null) return NotFound();

    ev.Status = "Approved";

    // 🔥 AUDIT LOG
    _context.AuditLogs.Add(new AuditLog
    {
        Id = Guid.NewGuid(),
        EntityName = "Event",
        Action = "Approved",
        Timestamp = DateTime.UtcNow
    });

    await _context.SaveChangesAsync();

    return Ok();
}

// ✅ REJECT
[HttpPut("{id}/reject")]
[Authorize(Roles = "Admin")]
public async Task<IActionResult> RejectEvent(Guid id)
{
    var ev = await _context.Events.FindAsync(id);
    if (ev == null) return NotFound();

    ev.Status = "Rejected";

    // 🔥 AUDIT LOG
    _context.AuditLogs.Add(new AuditLog
    {
        Id = Guid.NewGuid(),
        EntityName = "Event",
        Action = "Rejected",
        Timestamp = DateTime.UtcNow
    });

    await _context.SaveChangesAsync();

    return Ok();
}

    [HttpGet("all")]
[Authorize(Roles = "Admin")]
public async Task<IActionResult> GetAllIncludingPending()
{
    var events = await _context.Events.ToListAsync();
    return Ok(events);
}

[HttpGet("logs")]
[Authorize(Roles = "Admin")]
public async Task<IActionResult> GetLogs()
{
    var logs = await _context.AuditLogs
        .OrderByDescending(l => l.Timestamp)
        .ToListAsync();

    return Ok(logs);
}

}