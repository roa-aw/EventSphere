export default function EventCard({ event, onBook }) {
  const formatDate = (dateString) => {
    if (!dateString) return "Date TBD";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="card event-card">
      <div className="event-card-image">🎪</div>
      <div className="event-card-info">
        <h3 className="event-card-title">{event.title}</h3>
        <p className="event-card-date">{formatDate(event.eventDate)}</p>
        <p className="event-card-description">
          {event.description || "No description available"}
        </p>
        <div className="event-card-footer">
          <span style={{ fontSize: "12px", color: "#999" }}>
            {event.rooms?.length || 0} venue{event.rooms?.length !== 1 ? "s" : ""}
          </span>
          <button className="btn btn-primary" onClick={onBook}>
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
