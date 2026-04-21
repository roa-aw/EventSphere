using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using EventSphere.API.DTOs;
using EventSphere.API.Interfaces;

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
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create(EventCreateDTO dto)
    {
        var result = await _service.CreateEvent(dto);
        return Ok(result);
    }
}