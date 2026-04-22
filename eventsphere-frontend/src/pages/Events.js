import { useEffect, useState } from "react";
import API from "../services/api";
import EventCard from "../components/EventCard";
import Alert from "../components/Alert";

const TECH_EVENT_TYPES = [
  "Web Development",
  "Mobile Development",
  "AI & Machine Learning",
  "Cloud Computing",
  "DevOps",
  "Cybersecurity",
  "Data Science",
  "Blockchain",
  "IoT",
  "Other",
];

export default function Events({ setEventDetails, setSelectedEvent }) {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [eventType, setEventType] = useState("");
  const [showActive, setShowActive] = useState("all");
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events, searchTerm, eventType, showActive]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const res = await API.get("/events");
      setEvents(res.data || []);
    } catch (err) {
      setAlert({
        type: "error",
        message: "Failed to load events",
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...events];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((event) =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.description || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Event type filter (from tags or description)
    if (eventType) {
      filtered = filtered.filter((event) =>
        (event.description || "").toLowerCase().includes(eventType.toLowerCase()) ||
        (event.title || "").toLowerCase().includes(eventType.toLowerCase())
      );
    }

    // Active filter
    if (showActive !== "all") {
      const now = new Date();
      filtered = filtered.filter((event) => {
        const eventDate = new Date(event.date);
        if (showActive === "active") {
          return eventDate > now;
        } else {
          return eventDate <= now;
        }
      });
    }

    setFilteredEvents(filtered);
  };

  const isUpcoming = (dateString) => {
    return new Date(dateString) > new Date();
  };

  return (
    <div className="container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h2>📅 Events</h2>
        <button className="btn btn-primary" onClick={loadEvents}>
          🔄 Refresh
        </button>
      </div>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {/* Filters */}
      <div className="filters-card card" style={{ marginBottom: "30px" }}>
        <div className="card-body">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }}>
            {/* Search */}
            <div className="form-group">
              <label>Search Events</label>
              <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Event Type Filter */}
            <div className="form-group">
              <label>Event Type</label>
              <select value={eventType} onChange={(e) => setEventType(e.target.value)}>
                <option value="">All Types</option>
                {TECH_EVENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Active Filter */}
            <div className="form-group">
              <label>Event Status</label>
              <select value={showActive} onChange={(e) => setShowActive(e.target.value)}>
                <option value="all">All Events</option>
                <option value="active">Upcoming</option>
                <option value="past">Past Events</option>
              </select>
            </div>
          </div>

          {(searchTerm || eventType || showActive !== "all") && (
            <div style={{ marginTop: "15px" }}>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setSearchTerm("");
                  setEventType("");
                  setShowActive("all");
                }}
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <div className="spinner"></div>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="card">
          <div className="card-body" style={{ textAlign: "center", padding: "40px" }}>
            <p>
              {events.length === 0
                ? "No events available yet"
                : "No events match your filters"}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid">
          {filteredEvents.map((event) => (
            <EventCard
  key={event.id}
  event={event}
  onViewDetails={() => setEventDetails(event)}
  onBook={() => setSelectedEvent(event)}
  isUpcoming={isUpcoming(event.date)}
/>
          ))}
        </div>
      )}

      <p style={{ marginTop: "30px", textAlign: "center", color: "#999", fontSize: "14px" }}>
        Showing {filteredEvents.length} of {events.length} events
      </p>
    </div>
  );
}