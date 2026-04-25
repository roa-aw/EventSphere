import { useEffect, useState } from "react";
import API from "../services/api";
import Alert from "../components/Alert";
import { cn } from "../lib/utils";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("events");
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    date: "",
    roomId: "",
    type: "",
    imageUrl: "",
  });
  const [rooms, setRooms] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [editingEventId, setEditingEventId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const loadData = async () => {
    try {
      setLoading(true);

      if (activeTab === "events") {
        const eventsRes = await API.get("/events");
        const roomsRes = await API.get("/rooms");
        setEvents(eventsRes.data || []);
        setRooms(roomsRes.data || []);
      } else if (activeTab === "users") {
        const usersRes = await API.get("/users");
        setUsers(usersRes.data || []);
      }
    } catch (err) {
      setAlert({
        type: "error",
        message: "Failed to load data",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();

    if (!eventForm.title || !eventForm.date || !eventForm.roomId) {
      setAlert({
        type: "error",
        message: "Please fill in all required fields",
      });
      return;
    }

    try {
      await API.post("/events", {
        ...eventForm,
        date: new Date(eventForm.date).toISOString(),
      });

      setAlert({
        type: "success",
        message: "Event created successfully",
      });

      setEventForm({
        title: "",
        description: "",
        date: "",
        roomId: "",
        type: "",
        imageUrl: "",
      });
      setShowEventForm(false);
      await loadData();
    } catch (err) {
      setAlert({
        type: "error",
        message: err.response?.data?.message || "Failed to create event",
      });
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event?")) {
      return;
    }

    try {
      await API.delete(`/events/${eventId}`);
      setAlert({
        type: "success",
        message: "Event deleted successfully",
      });
      await loadData();
    } catch (err) {
      setAlert({
        type: "error",
        message: "Failed to delete event",
      });
    }
  };

  const handleUpdateEvent = async (id) => {
    try {
      await API.put(`/events/${id}`, {
        title: editTitle,
      });

      setAlert({
        type: "success",
        message: "Event updated",
      });

      setEditingEventId(null);
      setEditTitle("");
      await loadData();
    } catch {
      setAlert({
        type: "error",
        message: "Failed to update event",
      });
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      await API.put(`/users/${userId}`, { role: newRole });
      setAlert({
        type: "success",
        message: "User role updated successfully",
      });
      await loadData();
    } catch (err) {
      setAlert({
        type: "error",
        message: "Failed to update user role",
      });
    }
  };

  const handleCreateRoom = async () => {
    if (!roomName) {
      setAlert({
        type: "error",
        message: "Room name required",
      });
      return;
    }

    try {
      await API.post("/rooms", { name: roomName });

      setAlert({
        type: "success",
        message: "Room created successfully",
      });

      setRoomName("");
      await loadData();
    } catch {
      setAlert({
        type: "error",
        message: "Failed to create room",
      });
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <p className="text-gray-500">Manage events and users</p>
      </div>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {/* Tabs */}
      <div className="flex gap-2 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab("events")}
          className={cn(
            "px-4 py-2 rounded-md text-sm",
            activeTab === "events"
              ? "bg-white shadow text-black"
              : "text-gray-500"
          )}
        >
          Events
        </button>

        <button
          onClick={() => setActiveTab("users")}
          className={cn(
            "px-4 py-2 rounded-md text-sm",
            activeTab === "users"
              ? "bg-white shadow text-black"
              : "text-gray-500"
          )}
        >
          Users
        </button>
      </div>

      {/* Events Tab */}
      {activeTab === "events" && (
        <div>
          <button
            className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-md"
            onClick={() => setShowEventForm(!showEventForm)}
          >
            {showEventForm ? "Cancel" : "+ Create Event"}
          </button>

          <div className="space-y-6">
            {showEventForm && (
  <div className="bg-white rounded-xl shadow-md p-6 max-w-3xl space-y-6">
    <form onSubmit={handleCreateEvent} className="space-y-5">

      {/* Title */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Event Title
        </label>
        <input
          type="text"
          value={eventForm.title}
          onChange={(e) =>
            setEventForm({ ...eventForm, title: e.target.value })
          }
          placeholder="e.g., React Conference 2026"
          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-violet-500 outline-none"
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          rows={4}
          value={eventForm.description}
          onChange={(e) =>
            setEventForm({ ...eventForm, description: e.target.value })
          }
          placeholder="Event details..."
          className="w-full px-3 py-2 border rounded-md resize-none focus:ring-2 focus:ring-violet-500 outline-none"
        />
      </div>

      {/* Date */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Date & Time
        </label>
        <input
          type="datetime-local"
          value={eventForm.date}
          onChange={(e) =>
            setEventForm({ ...eventForm, date: e.target.value })
          }
          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-violet-500 outline-none"
        />
      </div>

      {/* Room + Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Room
          </label>
          <select
            value={eventForm.roomId}
            onChange={(e) =>
              setEventForm({ ...eventForm, roomId: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">Select a room</option>
            {rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name} (Capacity: {room.capacity})
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Event Type
          </label>
          <select
            value={eventForm.type}
            onChange={(e) =>
              setEventForm({ ...eventForm, type: e.target.value })
            }
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">Select type</option>
            <option value="Conference">Conference</option>
            <option value="Concert">Concert</option>
            <option value="Workshop">Workshop</option>
          </select>
        </div>

      </div>

      {/* Image URL */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Image URL
        </label>
        <input
          type="text"
          placeholder="https://..."
          value={eventForm.imageUrl}
          onChange={(e) =>
            setEventForm({ ...eventForm, imageUrl: e.target.value })
          }
          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-violet-500 outline-none"
        />
      </div>

      {/* Button */}
      <div className="pt-2">
        <button
          type="submit"
          className="w-full py-3 rounded-md text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90 transition"
        >
          Create Event
        </button>
      </div>

    </form>
  </div>
)}
          

          <div className="bg-white rounded-xl shadow-md p-5">
            <h3>Create Room</h3>

            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="Room name"
            />

            <button
              className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-2 rounded-md"
              onClick={handleCreateRoom}
            >
              Create Room
            </button>
          </div>

          {loading ? (
            <div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto" />
          ) : events.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-5 text-center">
              <p>No events yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
                >
                  <div className="flex-1">
                    {editingEventId === event.id ? (
                      <>
                        <input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="mb-2"
                        />
                        <button
                          onClick={() => handleUpdateEvent(event.id)}
                          className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
                        >
                          Save
                        </button>
                      </>
                    ) : (
                      <>
                        <h4 className="font-medium">{event.title}</h4>
                        <button
                          onClick={() => {
                            setEditingEventId(event.id)
                            setEditTitle(event.title)
                          }}
                          className="px-3 py-1 text-sm border rounded hover:bg-gray-100 mt-1"
                        >
                          Edit
                        </button>
                      </>
                    )}

                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(event.date).toLocaleDateString()}
                    </p>

                    <p className="text-sm text-gray-500">
                      {event.description || "No description"}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === "users" && (
        <div>
          {loading ? (
            <div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto" />
          ) : users.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-5 text-center">
              <p>No users found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-gray-50"
                >
                  <div>
                    <p className="font-medium">{user.fullName}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>

                  <select
                    value={user.role || "User"}
                    onChange={(e) =>
                      handleUpdateUserRole(user.id, e.target.value)
                    }
                    className="px-3 py-1 border rounded"
                  >
                    <option value="User">User</option>
                    <option value="Admin">Admin</option>
                    <option value="EventOrganizer">Organizer</option>
                  </select>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
