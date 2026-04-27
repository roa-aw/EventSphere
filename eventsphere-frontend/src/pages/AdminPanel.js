import { useEffect, useState } from "react";
import API from "../services/api";
import Alert from "../components/Alert";
import { cn } from "../lib/utils";
import CreateRoomForm from "../components/CreateRoomForm";
import { useNotification } from "../components/NotificationContext";

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
  const [editingEventId, setEditingEventId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "", description: "", date: "", roomId: "", category: "", imageUrl: ""
  });
  const [showRoomForm, setShowRoomForm] = useState(false);
  const [user, setUser] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const { addNotification } = useNotification();

  useEffect(() => {
    API.get("/users/profile")
      .then((res) => setUser(res.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const loadData = async () => {
    try {
      setLoading(true);
      if (activeTab === "events") {
        const eventsRes = await API.get("/events/all");
        const roomsRes = await API.get("/rooms");
        setEvents(eventsRes.data || []);
        setRooms(roomsRes.data || []);
      } else if (activeTab === "users") {
        const usersRes = await API.get("/users");
        setUsers(usersRes.data || []);
      }
    } catch (err) {
      setAlert({ type: "error", message: "Failed to load data" });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!eventForm.title || !eventForm.date || !eventForm.roomId) {
      setAlert({ type: "error", message: "Please fill in all required fields" });
      return;
    }
    try {
      await API.post("/events", {
        ...eventForm,
        date: new Date(eventForm.date).toISOString(),
      });
      setAlert({ type: "success", message: "Event created successfully" });
      addNotification("Event created successfully");
      setEventForm({ title: "", description: "", date: "", roomId: "", category: "", imageUrl: "" });
      setShowEventForm(false);
      await loadData();
    } catch (err) {
      setAlert({ type: "error", message: err.response?.data?.message || "Failed to create event" });
    }
  };

  const handleUpdateEvent = async (id) => {
    try {
      await API.put(`/events/${id}`, {
        ...editForm,
        date: new Date(editForm.date).toISOString(),
      });
      setAlert({ type: "success", message: "Event updated" });
      addNotification("Event updated successfully");
      setEditingEventId(null);
      await loadData();
    } catch {
      setAlert({ type: "error", message: "Failed to update event" });
      addNotification("Failed to update event");
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    try {
      await API.delete(`/events/${eventId}`);
      setAlert({ type: "success", message: "Event deleted successfully" });
      addNotification("Event deleted successfully");
      await loadData();
    } catch (err) {
      setAlert({ type: "error", message: "Failed to delete event" });
      addNotification("Failed to delete event");
    }
  };

  const approveEvent = async (id) => {
    try {
      await API.put(`/events/${id}/approve`);
      setAlert({ type: "success", message: "Event approved" });
      addNotification("Event approved");
      await loadData();
    } catch {
      setAlert({ type: "error", message: "Failed to approve event" });
      addNotification("Failed to approve event");
    }
  };

  const rejectEvent = async (id) => {
    try {
      await API.put(`/events/${id}/reject`);
      setAlert({ type: "success", message: "Event rejected" });
      addNotification("Event rejected");
      await loadData();
    } catch {
      setAlert({ type: "error", message: "Failed to reject event" });
      addNotification("Failed to reject event");
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      await API.put(`/users/${userId}/role`, { role: newRole });
      setAlert({ type: "success", message: "User role updated successfully" });
      addNotification("User role updated successfully");
      await loadData();
    } catch (err) {
      setAlert({ type: "error", message: "Failed to update user role" });
      addNotification("Failed to update user role");
    }
  };

  const canCreateEvent = user?.role === "Admin" || user?.role === "EventOrganizer";

  const filteredEvents = events.filter((event) => {
    if (statusFilter === "All") return true;
    return event.status === statusFilter;
  });

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Panel ({events.length} events)</h1>
        <p className="text-gray-500">Manage events and users</p>
      </div>

      {alert && (
        <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
      )}

      {/* Tabs */}
      <div className="flex gap-2 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab("events")}
          className={cn("px-4 py-2 rounded-md text-sm", activeTab === "events" ? "bg-white shadow text-black" : "text-gray-500")}
        >
          Events
        </button>
        <button
          onClick={() => setActiveTab("users")}
          className={cn("px-4 py-2 rounded-md text-sm", activeTab === "users" ? "bg-white shadow text-black" : "text-gray-500")}
        >
          Users
        </button>
      </div>

      {/* Events Tab */}
      {activeTab === "events" && (
        <div>
          <div className="flex gap-3 mb-4">
            {canCreateEvent && (
              <button
                className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-md text-sm"
                onClick={() => setShowEventForm(!showEventForm)}
              >
                {showEventForm ? "Cancel" : "+ Create Event"}
              </button>
            )}
            <button
              className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-md text-sm"
              onClick={() => setShowRoomForm(!showRoomForm)}
            >
              {showRoomForm ? "Cancel" : "+ Create Room"}
            </button>
          </div>

          {/* Status Filter */}
          <div className="flex gap-2 mb-4">
            {["All", "Pending", "Approved", "Rejected"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1 rounded-md text-sm ${
                  statusFilter === status
                    ? "bg-violet-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="space-y-6">

            {/* Create Event Form */}
            {showEventForm && (
              <div className="bg-white rounded-xl shadow-md p-6 max-w-3xl">
                <form onSubmit={handleCreateEvent} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Event Title</label>
                    <input
                      type="text"
                      value={eventForm.title}
                      onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                      placeholder="e.g., React Conference 2026"
                      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-violet-500 outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      rows={4}
                      value={eventForm.description}
                      onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                      placeholder="Event details..."
                      className="w-full px-3 py-2 border rounded-md resize-none focus:ring-2 focus:ring-violet-500 outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Date & Time</label>
                    <input
                      type="datetime-local"
                      value={eventForm.date}
                      onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-violet-500 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">Room</label>
                      <select
                        value={eventForm.roomId}
                        onChange={(e) => setEventForm({ ...eventForm, roomId: e.target.value })}
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
                      <label className="text-sm font-medium text-gray-700">Category</label>
                      <select
                        value={eventForm.category}
                        onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}
                        className="w-full px-3 py-2 border rounded-md"
                      >
                        <option value="">Select Category</option>
                        {["AI","Blockchain","Cybersecurity","Web Development","Data Science","Cloud Computing","DevOps","Mobile"].map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Image URL</label>
                    <input
                      type="text"
                      placeholder="https://..."
                      value={eventForm.imageUrl}
                      onChange={(e) => setEventForm({ ...eventForm, imageUrl: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-violet-500 outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-md text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90 transition"
                  >
                    Create Event
                  </button>
                </form>
              </div>
            )}

            {/* Create Room Form */}
            {showRoomForm && (
              <CreateRoomForm
                onSuccess={(message) => {
                  setAlert({ type: "success", message });
                  loadData();
                  setShowRoomForm(false);
                }}
              />
            )}

            {/* Event List */}
            {loading ? (
              <div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto" />
            ) : filteredEvents.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-5 text-center">
                <p>No events found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredEvents.map((event) => (
                  <div
                    key={event.id}
                    className="p-4 rounded-xl border bg-white shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-start gap-4">

                      {/* LEFT SIDE */}
                      <div className="flex-1">
                        {editingEventId === event.id ? (
                          <div className="space-y-3 w-full">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <label className="text-xs text-gray-500">Title</label>
                                <input
                                  className="w-full border px-2 py-1.5 rounded text-sm"
                                  value={editForm.title}
                                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                />
                              </div>
                              <div>
                                <label className="text-xs text-gray-500">Date & Time</label>
                                <input
                                  type="datetime-local"
                                  className="w-full border px-2 py-1.5 rounded text-sm"
                                  value={editForm.date}
                                  onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                                />
                              </div>
                              <div>
                                <label className="text-xs text-gray-500">Room</label>
                                <select
                                  className="w-full border px-2 py-1.5 rounded text-sm"
                                  value={editForm.roomId}
                                  onChange={(e) => setEditForm({ ...editForm, roomId: e.target.value })}
                                >
                                  <option value="">Select room</option>
                                  {rooms.map((room) => (
                                    <option key={room.id} value={room.id}>
                                      {room.name} (Capacity: {room.capacity})
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div>
                                <label className="text-xs text-gray-500">Category</label>
                                <select
                                  className="w-full border px-2 py-1.5 rounded text-sm"
                                  value={editForm.category}
                                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                                >
                                  <option value="">Select category</option>
                                  {["AI","Blockchain","Cybersecurity","Web Development","Data Science","Cloud Computing","DevOps","Mobile"].map(c => (
                                    <option key={c} value={c}>{c}</option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            <div>
                              <label className="text-xs text-gray-500">Description</label>
                              <textarea
                                rows={2}
                                className="w-full border px-2 py-1.5 rounded text-sm resize-none"
                                value={editForm.description}
                                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                              />
                            </div>

                            <div>
                              <label className="text-xs text-gray-500">Image URL</label>
                              <input
                                className="w-full border px-2 py-1.5 rounded text-sm"
                                placeholder="https://..."
                                value={editForm.imageUrl}
                                onChange={(e) => setEditForm({ ...editForm, imageUrl: e.target.value })}
                              />
                            </div>

                            <div className="flex gap-2">
                              <button
                                onClick={() => handleUpdateEvent(event.id)}
                                className="px-4 py-1.5 text-sm bg-violet-600 text-white rounded hover:bg-violet-700"
                              >
                                Save Changes
                              </button>
                              <button
                                onClick={() => setEditingEventId(null)}
                                className="px-4 py-1.5 text-sm border rounded hover:bg-gray-50"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
  <>
    {/* TOP ROW: title + status + actions */}
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-center gap-2 flex-wrap">
        <h4 className="font-semibold text-gray-900 text-base">{event.title}</h4>
        <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
          event.status === "Approved" ? "bg-green-100 text-green-700"
          : event.status === "Rejected" ? "bg-red-100 text-red-700"
          : "bg-amber-100 text-amber-700"
        }`}>
          {event.status}
        </span>
      </div>

      {/* RIGHT BUTTONS */}
      <div className="flex gap-2 flex-shrink-0">
        {event.status === "Pending" && (
          <>
            <button onClick={() => approveEvent(event.id)}
              className="px-3 py-1 text-xs font-medium bg-green-500 text-white rounded-full hover:bg-green-600 transition">
              Approve
            </button>
            <button onClick={() => rejectEvent(event.id)}
              className="px-3 py-1 text-xs font-medium bg-amber-500 text-white rounded-full hover:bg-amber-600 transition">
              Reject
            </button>
          </>
        )}
        <button onClick={() => handleDeleteEvent(event.id)}
          className="px-3 py-1 text-xs font-medium text-red-500 border border-red-200 rounded-full hover:bg-red-50 transition">
          Delete
        </button>
      </div>
    </div>

    {/* META ROW: date + category + image indicator */}
    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400 flex-wrap">
      <span>📅 {new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
      {event.category && (
        <span className="px-2 py-0.5 bg-violet-50 text-violet-600 rounded-full border border-violet-100">
          {event.category}
        </span>
      )}
      {event.imageUrl && (
        <span className="text-gray-300">🖼 Image attached</span>
      )}
    </div>

    {/* DESCRIPTION */}
    <p className="text-sm text-gray-500 mt-2 line-clamp-2">
      {event.description || "No description provided"}
    </p>

    {/* EDIT BUTTON */}
    <button
      onClick={() => {
        setEditingEventId(event.id);
        setEditForm({
          title: event.title || "",
          description: event.description || "",
          date: event.date ? new Date(event.date).toISOString().slice(0, 16) : "",
          roomId: event.roomId || "",
          category: event.category || "",
          imageUrl: event.imageUrl || "",
        });
      }}
      className="mt-3 px-4 py-1.5 text-xs font-medium border border-gray-200 text-gray-600 rounded-full hover:bg-gray-50 transition"
    >
      Edit
    </button>
  </>
)}
                      </div>

                      
                      

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
                    onChange={(e) => handleUpdateUserRole(user.id, e.target.value)}
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