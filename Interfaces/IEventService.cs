using EventSphere.API.DTOs;

namespace EventSphere.API.Interfaces;

public interface IEventService
{
    Task<List<EventResponseDTO>> GetAllEvents();

    Task<EventResponseDTO> CreateEvent(EventCreateDTO dto, Guid userId);

    Task<bool> UpdateEvent(Guid id, EventCreateDTO dto, Guid userId, string role);

    Task<bool> DeleteEvent(Guid id, Guid userId, string role);

    Task<List<EventResponseDTO>> GetEventsByUser(Guid userId);
}