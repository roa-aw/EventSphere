using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using EventSphere.API.DTOs;
using EventSphere.API.Interfaces;
using System.Security.Claims;

namespace EventSphere.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EventsController : ControllerBase
{
    private readonly IEventService _service;

    public EventsController(IEventService service)
    {
        _service = service;
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

        var result = await _service.CreateEvent(dto, userId); // ✅ pass userId

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
}