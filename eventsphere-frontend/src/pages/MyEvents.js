import { useEffect, useState } from "react";
import API from "../services/api";
import EventCard from "../components/EventCard";

export default function MyEvents() {
  const [events, setEvents] = useState([]);

  const loadMyEvents = async () => {
    try {
      const res = await API.get("/events/my");
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadMyEvents();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      await API.delete(`/events/${id}`);
      setEvents(events.filter(e => e.id !== id)); 
    } catch {
      alert("Failed to delete");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">My Events</h1>

      {events.length === 0 ? (
        <p className="text-gray-400">You haven't created any events yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event.id} className="relative">

              {/* 🔥 DELETE BUTTON */}
              <button
                onClick={() => handleDelete(event.id)}
                className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-md text-xs hover:bg-red-600 z-10"
              >
                Delete
              </button>

              <EventCard event={event} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}