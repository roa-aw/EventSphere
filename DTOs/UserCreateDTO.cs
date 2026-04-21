using System.ComponentModel.DataAnnotations;

namespace EventSphere.API.DTOs;

public class UserCreateDTO
{
    [Required]
    public required string FullName { get; set; }

    [Required]
    [EmailAddress]
    public required string Email { get; set; }

    [Required]
    [MinLength(6)]
    public required string Password { get; set; }
}