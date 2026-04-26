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
            Capacity = dto.Capacity,
            ImageUrl = dto.ImageUrl,
            Latitude = dto.Latitude,
            Longitude = dto.Longitude

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
            Capacity = room.Capacity,
            ImageUrl = room.ImageUrl,
            Latitude = room.Latitude,
            Longitude = room.Longitude
        };
    }

    public async Task<List<RoomResponseDTO>> GetRooms()
    {
        return await _context.Rooms
            .Select(r => new RoomResponseDTO
            {
                Id = r.Id,
                Name = r.Name,
                Capacity = r.Capacity,
                ImageUrl = r.ImageUrl,
                Latitude = r.Latitude,
                Longitude = r.Longitude
            })
            .ToListAsync();
    }

public async Task<bool> DeleteRoom(Guid roomId)
{
    var room = await _context.Rooms
        .Include(r => r.Seats)
        .FirstOrDefaultAsync(r => r.Id == roomId);

    if (room == null)
        return false;

    var seatIds = room.Seats.Select(s => s.Id).ToList();

    // 🔥 Delete related bookings first
    var bookings = await _context.Bookings
        .Where(b => seatIds.Contains(b.SeatId))
        .ToListAsync();

    _context.Bookings.RemoveRange(bookings);

    // 🔥 Delete seats
    _context.Seats.RemoveRange(room.Seats);

    // 🔥 Delete room
    _context.Rooms.Remove(room);

    await _context.SaveChangesAsync();

    return true;
}
}