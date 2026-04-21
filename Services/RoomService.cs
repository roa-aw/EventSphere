using EventSphere.API.Data;
using EventSphere.API.DTOs;
using EventSphere.API.Entities;
using EventSphere.API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EventSphere.API.Services;

public class RoomService : IRoomService
{
    private readonly AppDbContext _context;

    public RoomService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<RoomResponseDTO> CreateRoom(RoomCreateDTO dto)
    {
        var room = new Room
        {
            Id = Guid.NewGuid(),
            Name = dto.Name,
            Capacity = dto.Capacity
        };

        _context.Rooms.Add(room);

        // 🔥 AUTO GENERATE SEATS
        var seats = new List<Seat>();

        for (int i = 1; i <= dto.Capacity; i++)
        {
            seats.Add(new Seat
            {
                Id = Guid.NewGuid(),
                RoomId = room.Id,
                SeatNumber = i
            });
        }

        _context.Seats.AddRange(seats);

        await _context.SaveChangesAsync();

        return new RoomResponseDTO
        {
            Id = room.Id,
            Name = room.Name,
            Capacity = room.Capacity
        };
    }

    public async Task<List<RoomResponseDTO>> GetRooms()
    {
        return await _context.Rooms
            .Select(r => new RoomResponseDTO
            {
                Id = r.Id,
                Name = r.Name,
                Capacity = r.Capacity
            })
            .ToListAsync();
    }
}