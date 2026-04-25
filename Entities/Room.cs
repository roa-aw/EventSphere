namespace EventSphere.API.Entities;

public class Room
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public int Capacity { get; set; }

    public ICollection<Seat> Seats { get; set; }
    public string? ImageUrl { get; set; }
}