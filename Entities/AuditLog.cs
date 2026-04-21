namespace EventSphere.API.Entities;

public class AuditLog
{
    public Guid Id { get; set; }
    public string EntityName { get; set; }
    public string Action { get; set; }
    public DateTime Timestamp { get; set; }
}