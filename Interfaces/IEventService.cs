using EventSphere.API.DTOs;

namespace EventSphere.API.Interfaces;

public interface IEventService
{
    Task<List<EventResponseDTO>> GetAllEvents();
    Task<EventResponseDTO> CreateEvent(EventCreateDTO dto);
}