using EventSphere.API.DTOs;

namespace EventSphere.API.Interfaces;

public interface IEventService
{
    Task<List<EventResponseDTO>> GetAllEvents();
    Task<EventResponseDTO> CreateEvent(EventCreateDTO dto);
    Task<bool> UpdateEvent(Guid id, EventCreateDTO dto);
    Task<bool> DeleteEvent(Guid id);
}