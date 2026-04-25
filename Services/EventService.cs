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
                Date = e.Date,
                Category = e.Category,
                ImageUrl = e.ImageUrl,
                CreatedByUserId = e.CreatedByUserId // ✅ added
            })
            .ToListAsync();
    }

    // ✅ UPDATED (added userId)
    public async Task<EventResponseDTO> CreateEvent(EventCreateDTO dto, Guid userId)
    {
        var ev = new Event
        {
            Id = Guid.NewGuid(),
            Title = dto.Title,
            Description = dto.Description,
            Date = dto.Date.ToUniversalTime(),
            RoomId = dto.RoomId,
            Category = dto.Category,
            ImageUrl = dto.ImageUrl,
            CreatedByUserId = userId // ✅ important
        };

        _context.Events.Add(ev);
        await _context.SaveChangesAsync();

        return new EventResponseDTO
        {
            Id = ev.Id,
            Title = ev.Title,
            Description = ev.Description,
            Date = ev.Date,
            Category = ev.Category,
            ImageUrl = ev.ImageUrl,
            CreatedByUserId = ev.CreatedByUserId // ✅ added
        };
    }

    // ✅ UPDATED (ownership + role)
    public async Task<bool> UpdateEvent(Guid id, EventCreateDTO dto, Guid userId, string role)
    {
        var ev = await _context.Events.FindAsync(id);
        if (ev == null)
            return false;

        // ✅ Admin can update anything
        if (role != "Admin")
        {
            // ✅ Organizer can only update own event
            if (role != "EventOrganizer" || ev.CreatedByUserId != userId)
                return false;
        }

        ev.Title = dto.Title;
        ev.Description = dto.Description;
        ev.Date = dto.Date.ToUniversalTime();
        ev.RoomId = dto.RoomId;
        ev.Category = dto.Category;
        ev.ImageUrl = dto.ImageUrl;

        _context.Events.Update(ev);
        await _context.SaveChangesAsync();

        return true;
    }

    // ✅ UPDATED (ownership + role)
    public async Task<bool> DeleteEvent(Guid id, Guid userId, string role)
    {
        var ev = await _context.Events.FindAsync(id);

        if (ev == null)
            return false;

        // ✅ Admin can delete anything
        if (role != "Admin")
        {
            // ✅ Organizer can only delete own event
            if (role != "EventOrganizer" || ev.CreatedByUserId != userId)
                return false;
        }

        _context.Events.Remove(ev);
        await _context.SaveChangesAsync();

        return true;
    }

    // ✅ NEW (for My Events page)
    public async Task<List<EventResponseDTO>> GetEventsByUser(Guid userId)
    {
        return await _context.Events
            .Where(e => e.CreatedByUserId == userId)
            .Select(e => new EventResponseDTO
            {
                Id = e.Id,
                Title = e.Title,
                Description = e.Description,
                Date = e.Date,
                Category = e.Category,
                ImageUrl = e.ImageUrl,
                CreatedByUserId = e.CreatedByUserId
            })
            .ToListAsync();
    }
}