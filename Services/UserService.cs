using Microsoft.EntityFrameworkCore;
using EventSphere.API.Data;
using EventSphere.API.DTOs;
using EventSphere.API.Entities;
using BCrypt.Net;

namespace EventSphere.API.Services;

public class UserService : IUserService
{
    private readonly AppDbContext _context;

    public UserService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<UserResponseDTO>> GetAllUsers()
    {
        return await _context.Users
            .Select(u => new UserResponseDTO
            {
                Id = u.Id,
                FullName = u.FullName,
                Email = u.Email
            })
            .ToListAsync();
    }

    public async Task<UserResponseDTO?> GetUserById(Guid id)
    {
        return await _context.Users
            .Where(u => u.Id == id)
            .Select(u => new UserResponseDTO
            {
                Id = u.Id,
                FullName = u.FullName,
                Email = u.Email
            })
            .FirstOrDefaultAsync();
    }

    public async Task<UserResponseDTO> CreateUser(UserCreateDTO dto)
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

        return new UserResponseDTO
        {
            Id = user.Id,
            FullName = user.FullName,
            Email = user.Email
        };
    }

    public async Task<bool> DeleteUser(Guid id)
    {
        var user = await _context.Users.FindAsync(id);

        if (user == null)
            return false;

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();

        return true;
    }
}