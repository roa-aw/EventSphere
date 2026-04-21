namespace EventSphere.API.Data;

using Microsoft.EntityFrameworkCore;
using EventSphere.API.Entities;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Event> Events { get; set; }
    public DbSet<Room> Rooms { get; set; }
    public DbSet<Seat> Seats { get; set; }
    public DbSet<Booking> Bookings { get; set; }
    public DbSet<AuditLog> AuditLogs { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Booking>()
            .HasOne(b => b.User)
            .WithMany()
            .HasForeignKey(b => b.UserId);

        modelBuilder.Entity<Booking>()
            .HasOne(b => b.Event)
            .WithMany(e => e.Bookings)
            .HasForeignKey(b => b.EventId);

        modelBuilder.Entity<Booking>()
            .HasOne(b => b.Seat)
            .WithMany(s => s.Bookings)
            .HasForeignKey(b => b.SeatId);

        modelBuilder.Entity<Booking>()
            .HasIndex(b => new { b.EventId, b.SeatId })
            .IsUnique();
    }

    // 🔥 AUDIT LOG MAGIC HERE
    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var auditLogs = new List<AuditLog>();

        foreach (var entry in ChangeTracker.Entries())
        {
            if (entry.Entity is AuditLog) continue;

            if (entry.State == EntityState.Added ||
                entry.State == EntityState.Modified ||
                entry.State == EntityState.Deleted)
            {
                auditLogs.Add(new AuditLog
                {
                    Id = Guid.NewGuid(),
                    EntityName = entry.Entity.GetType().Name,
                    Action = entry.State.ToString(),
                    Timestamp = DateTime.UtcNow
                });
            }
        }

        if (auditLogs.Any())
        {
            AuditLogs.AddRange(auditLogs);
        }

        return await base.SaveChangesAsync(cancellationToken);
    }
}