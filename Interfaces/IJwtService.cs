using EventSphere.API.Entities;

namespace EventSphere.API.Interfaces;

public interface IJwtService
{
    string GenerateToken(User user);
}