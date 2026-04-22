import { useEffect, useState } from "react";
import API from "../services/api";
import Alert from "../components/Alert";

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
    <div className="container">
      <h2>Admin Panel</h2>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {/* Tabs */}
      <div className="tabs" style={{ marginBottom: "30px" }}>
        <button
          className={`tab ${activeTab === "events" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("events");
            loadData();
          }}
        >
          📅 Events Management
        </button>
        <button
          className={`tab ${activeTab === "users" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("users");
            loadData();
          }}
        >
          👥 User Management
        </button>
      </div>

      {/* Events Tab */}
      {activeTab === "events" && (
        <div>
          <button
            className="btn btn-primary"
            onClick={() => setShowEventForm(!showEventForm)}
            style={{ marginBottom: "20px" }}
          >
            {showEventForm ? "Cancel" : "+ Create Event"}
          </button>

          {showEventForm && (
            <div className="card" style={{ marginBottom: "30px" }}>
              <div className="card-body">
                <form onSubmit={handleCreateEvent}>
                  <div className="form-group">
                    <label>Event Title</label>
                    <input
                      type="text"
                      value={eventForm.title}
                      onChange={(e) =>
                        setEventForm({ ...eventForm, title: e.target.value })
                      }
                      placeholder="e.g., React Conference 2026"
                    />
                  </div>

                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      value={eventForm.description}
                      onChange={(e) =>
                        setEventForm({ ...eventForm, description: e.target.value })
                      }
                      placeholder="Event details..."
                      rows="4"
                    />
                  </div>

                  <div className="form-group">
                    <label>Date & Time</label>
                    <input
                      type="datetime-local"
                      value={eventForm.date}
                      onChange={(e) =>
                        setEventForm({ ...eventForm, date: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Room</label>
                    <select
                      value={eventForm.roomId}
                      onChange={(e) =>
                        setEventForm({ ...eventForm, roomId: e.target.value })
                      }
                    >
                      <option value="">Select a room</option>
                      {rooms.map((room) => (
                        <option key={room.id} value={room.id}>
                          {room.name} (Capacity: {room.capacity})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Event Type</label>
                    <select
                      value={eventForm.type}
                      onChange={(e) =>
                        setEventForm({ ...eventForm, type: e.target.value })
                      }
                    >
                      <option value="">Select type</option>
                      <option value="Conference">Conference</option>
                      <option value="Concert">Concert</option>
                      <option value="Workshop">Workshop</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Image URL</label>
                    <input
                      type="text"
                      placeholder="Image URL"
                      value={eventForm.imageUrl}
                      onChange={(e) =>
                        setEventForm({ ...eventForm, imageUrl: e.target.value })
                      }
                    />
                  </div>

                  <button type="submit" className="btn btn-primary">
                    Create Event
                  </button>
                </form>
              </div>
            </div>
          )}

          <div className="card" style={{ marginBottom: "30px" }}>
            <div className="card-body">
              <h3>Create Room</h3>

              <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="Room name"
              />

              <button
                className="btn btn-primary"
                onClick={handleCreateRoom}
                style={{ marginTop: "10px" }}
              >
                Create Room
              </button>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <div className="spinner"></div>
            </div>
          ) : events.length === 0 ? (
            <div className="card">
              <div className="card-body" style={{ textAlign: "center", padding: "40px" }}>
                <p>No events yet</p>
              </div>
            </div>
          ) : (
            <div className="grid" style={{ gridTemplateColumns: "1fr" }}>
              {events.map((event) => (
                <div key={event.id} className="card">
                  <div className="card-body">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                      <div style={{ flex: 1 }}>
                        {editingEventId === event.id ? (
                          <>
                            <input
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              style={{ marginBottom: "8px" }}
                            />

                            <button
                              className="btn btn-primary"
                              onClick={() => handleUpdateEvent(event.id)}
                              style={{ marginRight: "10px" }}
                            >
                              Save
                            </button>
                          </>
                        ) : (
                          <>
                            <h4 style={{ marginBottom: "8px" }}>{event.title}</h4>

                            <button
                              className="btn btn-secondary"
                              onClick={() => {
                                setEditingEventId(event.id);
                                setEditTitle(event.title);
                              }}
                              style={{ marginRight: "10px" }}
                            >
                              Edit
                            </button>
                          </>
                        )}
                        <p style={{ color: "#666", fontSize: "14px", marginBottom: "8px" }}>
                          📅 {new Date(event.date).toLocaleDateString()}
                        </p>
                        <p style={{ color: "#666", fontSize: "14px" }}>
                          {event.description || "No description"}
                        </p>
                      </div>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDeleteEvent(event.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Users Tab */}
      {activeTab === "users" && (
        <div>
          {loading ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <div className="spinner"></div>
            </div>
          ) : users.length === 0 ? (
            <div className="card">
              <div className="card-body" style={{ textAlign: "center", padding: "40px" }}>
                <p>No users found</p>
              </div>
            </div>
          ) : (
            <div className="grid" style={{ gridTemplateColumns: "1fr" }}>
              {users.map((user) => (
                <div key={user.id} className="card">
                  <div className="card-body">
                    <h4 style={{ marginBottom: "8px" }}>{user.fullName}</h4>
                    <p style={{ color: "#666", marginBottom: "15px" }}>
                      {user.email}
                    </p>

                    <div style={{ display: "flex", gap: "10px" }}>
                      <select
                        value={user.role || "User"}
                        onChange={(e) => handleUpdateUserRole(user.id, e.target.value)}
                        style={{
                          flex: 1,
                          padding: "8px",
                          border: "1px solid #ddd",
                          borderRadius: "4px",
                        }}
                      >
                        <option value="User">User</option>
                        <option value="Admin">Admin</option>
                        <option value="EventOrganizer">Event Organizer</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
