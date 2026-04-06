public interface IUserService
{
    Task<List<UserResponseDTO>> GetAllUsers();
    Task<UserResponseDTO?> GetUserById(Guid id);
    Task<UserResponseDTO> CreateUser(UserCreateDTO dto);
    Task<bool> DeleteUser(Guid id);
}