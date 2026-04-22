using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

using EventSphere.API.Data;
using EventSphere.API.Entities;
using EventSphere.API.DTOs;
using System.Security.Claims;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _context;

    public UsersController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/users (Admin only)
    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetUsers()
    {
        var users = await _context.Users
            .Select(u => new UserResponseDTO
            {
                Id = u.Id,
                FullName = u.FullName,
                Email = u.Email
            })
            .ToListAsync();

        return Ok(users);
    }

    // GET: api/users/{id}
    [HttpGet("{id}")]
    [Authorize]
    public async Task<IActionResult> GetUser(Guid id)
    {
        var currentUserIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (currentUserIdClaim == null || string.IsNullOrEmpty(currentUserIdClaim.Value))
        {
            return Unauthorized();
        }
        var currentUserId = Guid.Parse(currentUserIdClaim.Value);

        if (id != currentUserId && !User.IsInRole("Admin"))
        {
            return Forbid();
        }

        var user = await _context.Users
            .Where(u => u.Id == id)
            .Select(u => new UserResponseDTO
            {
                Id = u.Id,
                FullName = u.FullName,
                Email = u.Email
            })
            .FirstOrDefaultAsync();

        if (user == null)
            return NotFound();

        return Ok(user);
    }

    // POST: api/users
    [HttpPost]
    public async Task<IActionResult> CreateUser(UserCreateDTO dto)
    {
        var user = new User
        {
            Id = Guid.NewGuid(),
            FullName = dto.FullName,
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Role = "User"
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var response = new UserResponseDTO
        {
            Id = user.Id,
            FullName = user.FullName,
            Email = user.Email
        };

        return Ok(response);
    }

    // DELETE: api/users/{id} (Admin only)
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteUser(Guid id)
    {
        var user = await _context.Users.FindAsync(id);

        if (user == null)
            return NotFound();

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();

        return Ok();
    }

    [HttpGet("profile")]
[Authorize]
public async Task<IActionResult> GetProfile()
{
    var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

    if (userIdClaim == null)
        return Unauthorized();

    var userId = Guid.Parse(userIdClaim.Value);

    var user = await _context.Users
        .Where(u => u.Id == userId)
        .Select(u => new UserResponseDTO
        {
            Id = u.Id,
            FullName = u.FullName,
            Email = u.Email
        })
        .FirstOrDefaultAsync();

    if (user == null)
        return NotFound();

    return Ok(user);
}
}