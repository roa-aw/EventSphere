using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Linq;
using Google.Apis.Auth;
using Microsoft.EntityFrameworkCore;

using EventSphere.API.Data;
using EventSphere.API.DTOs;
using EventSphere.API.Entities;
using EventSphere.API.Interfaces;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _config;
    private readonly IJwtService _jwtService;

    public AuthController(AppDbContext context, IConfiguration config, IJwtService jwtService)
    {
        _context = context;
        _config = config;
        _jwtService = jwtService;
    }

    [HttpPost("login")]
    public IActionResult Login(LoginDTO dto)
    {
        var user = _context.Users
    .FirstOrDefault(u => u.Email == dto.Email);

if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
{
    return Unauthorized("Invalid credentials");
}

        var token = _jwtService.GenerateToken(user);

        return Ok(new { token });
    }

    [HttpPost("google")]
    public async Task<IActionResult> GoogleLogin([FromBody] GoogleAuthRequest request)
    {
        var payload = await GoogleJsonWebSignature.ValidateAsync(request.Token);

        var email = payload.Email;
        var name = payload.Name;

        // Check if user exists
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

        if (user == null)
        {
            user = new User
            {
                Email = email,
                FullName = name,
                Role = "User"
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        }

        // Generate JWT (your existing method)
        var token = _jwtService.GenerateToken(user);

        return Ok(new { token });
    }
}