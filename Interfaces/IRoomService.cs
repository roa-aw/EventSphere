using EventSphere.API.DTOs;

namespace EventSphere.API.Interfaces;

public interface IRoomService
{
    Task<RoomResponseDTO> CreateRoom(RoomCreateDTO dto);
    Task<List<RoomResponseDTO>> GetRooms();
    Task<bool> DeleteRoom(Guid roomId);
}