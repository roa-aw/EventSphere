using EventSphere.API.Data;
using EventSphere.API.DTOs;
using EventSphere.API.Entities;
using EventSphere.API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace EventSphere.API.Services;

public class EventService : IEventService
{
    private readonly AppDbContext _context;

    public EventService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<EventResponseDTO>> GetAllEvents()
    {
        return await _context.Events
            .Select(e => new EventResponseDTO
            {
                Id = e.Id,
                Title = e.Title,
                Description = e.Description,
                Date = e.Date
            })
            .ToListAsync();
    }

    public async Task<EventResponseDTO> CreateEvent(EventCreateDTO dto)
    {
        var ev = new Event
        {
            Id = Guid.NewGuid(),
            Title = dto.Title,
            Description = dto.Description,
            Date = dto.Date.ToUniversalTime(),
            RoomId = dto.RoomId
        };

        _context.Events.Add(ev);
        await _context.SaveChangesAsync();

        return new EventResponseDTO
        {
            Id = ev.Id,
            Title = ev.Title,
            Description = ev.Description,
            Date = ev.Date
        };
    }
}