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

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(Guid id, EventCreateDTO dto)
    {
        var result = await _service.UpdateEvent(id, dto);
        if (!result) return NotFound();
        return Ok();
    }

    [HttpDelete("{id}")]
[Authorize(Roles = "Admin")]
public async Task<IActionResult> Delete(Guid id)
{
    var result = await _service.DeleteEvent(id);

    if (!result)
        return NotFound();

    return Ok();
}

}