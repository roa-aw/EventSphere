using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using EventSphere.API.DTOs;
using EventSphere.API.Interfaces;

namespace EventSphere.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RoomsController : ControllerBase
{
    private readonly IRoomService _service;

    public RoomsController(IRoomService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _service.GetRooms());
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create(RoomCreateDTO dto)
    {
        var result = await _service.CreateRoom(dto);
        return Ok(result);
    }


[HttpDelete("{id}")]
[Authorize(Roles = "Admin")]
public async Task<IActionResult> Delete(Guid id)
{
    var result = await _service.DeleteRoom(id);

    if (!result)
        return NotFound();

    return Ok(new { message = "Room deleted successfully" });
}

}