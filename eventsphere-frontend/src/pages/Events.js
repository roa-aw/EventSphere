import { useEffect, useState } from "react";
import API from "../services/api";
import EventCard from "../components/EventCard";
import Alert from "../components/Alert";

const TECH_EVENT_TYPES = [
  "Conference",
  "Concert",
  "Workshop",
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

    // Event type filter (using the dedicated type field)
    filtered = filtered.filter((e) => !eventType || e.type === eventType);

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
    <div className="space-y-6 p-4 md:p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Events</h1>
          <p className="text-gray-500">
            Discover and book events
          </p>
        </div>

        <button
          onClick={loadEvents}
          className="px-4 py-2 rounded-md bg-gradient-to-r from-violet-600 to-indigo-600 text-white"
        >
          Refresh
        </button>
      </div>

      {/* ALERT */}
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {/* FILTERS */}
      <div className="bg-white rounded-xl shadow-md p-5 space-y-4">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-2 border rounded-md w-full"
          />

          {/* TYPE */}
          <select
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
            className="px-3 py-2 border rounded-md w-full"
          >
            <option value="">All Categories</option>
            <option value="AI">AI</option>
            <option value="Blockchain">Blockchain</option>
            <option value="Cybersecurity">Cybersecurity</option>
            <option value="Web Development">Web Development</option>
            <option value="Data Science">Data Science</option>
          </select>

          {/* STATUS */}
          <select
            value={showActive}
            onChange={(e) => setShowActive(e.target.value)}
            className="px-3 py-2 border rounded-md w-full"
          >
            <option value="all">All Events</option>
            <option value="active">Upcoming</option>
            <option value="past">Past Events</option>
          </select>
        </div>

        {/* CLEAR */}
        {(searchTerm || eventType || showActive !== "all") && (
          <button
            onClick={() => {
              setSearchTerm("")
              setEventType("")
              setShowActive("all")
            }}
            className="text-sm text-violet-600 hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          {events.length === 0
            ? "No events available yet"
            : "No events match your filters"}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

      {/* FOOTER */}
      <p className="text-center text-sm text-gray-400">
        Showing {filteredEvents.length} of {events.length} events
      </p>
    </div>
  )
}