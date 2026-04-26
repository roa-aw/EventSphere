import { useEffect, useState } from "react";
import API from "../services/api";
import EventCard from "../components/EventCard";

export default function MyEvents() {
  const [events, setEvents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

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

  const handleUpdate = async (id) => {
    try {
      await API.put(`/events/${id}`, {
        title: editTitle,
      });

      setEvents(events.map(e =>
        e.id === id ? { ...e, title: editTitle } : e
      ));

      setEditingId(null);
      setEditTitle("");
    } catch {
      alert("Failed to update");
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

              {/* 🔥 STATUS BADGE */}
              <div
                className={`absolute top-12 left-3 px-2 py-1 rounded text-xs font-medium z-10 ${
                  event.status === "Approved"
                    ? "bg-green-100 text-green-700"
                    : event.status === "Rejected"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {event.status}
              </div>

              {/* 🔥 DELETE */}
              {event.status !== "Rejected" && (
                <button
                  onClick={() => handleDelete(event.id)}
                  className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-md text-xs hover:bg-red-600 z-10"
                >
                  Delete
                </button>
              )}

              {/* ✏️ EDIT BUTTON */}
              {event.status !== "Rejected" && (
                <button
                  onClick={() => {
                    setEditingId(event.id);
                    setEditTitle(event.title);
                  }}
                  className="absolute top-10 right-3 bg-blue-500 text-white px-3 py-1 rounded-md text-xs hover:bg-blue-600 z-10"
                >
                  Edit
                </button>
              )}

              {/* 🔥 EDIT INPUT */}
              {editingId === event.id && (
                <div className="absolute top-16 left-3 right-3 bg-white p-2 rounded shadow z-20">
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full border px-2 py-1 rounded text-sm mb-2"
                  />

                  <button
                    onClick={() => handleUpdate(event.id)}
                    className="w-full bg-green-500 text-white py-1 rounded text-sm hover:bg-green-600"
                  >
                    Save
                  </button>
                </div>
              )}

              {/* 🔥 STATUS MESSAGE */}
              <div className="absolute bottom-3 left-3 text-xs text-white bg-black/60 px-2 py-1 rounded z-10">
                {event.status === "Pending" && "Waiting for approval"}
                {event.status === "Approved" && "Live event"}
                {event.status === "Rejected" && "Rejected by admin"}
              </div>

              <EventCard event={event} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}