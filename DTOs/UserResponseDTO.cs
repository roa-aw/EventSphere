namespace EventSphere.API.DTOs;
public class UserResponseDTO
{
    public Guid Id { get; set; }
    public required string FullName { get; set; }
    public required string Email { get; set; }
}