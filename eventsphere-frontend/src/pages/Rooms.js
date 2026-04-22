import { useEffect, useState } from "react";
import API from "../services/api";
import Alert from "../components/Alert";

export default function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    capacity: "",
  });

  useEffect(() => {
    checkAdminRole();
    loadRooms();
  }, []);

  const checkAdminRole = async () => {
    try {
      const res = await API.get("/users/profile");
      setIsAdmin(res.data?.role === "Admin" || res.data?.role === "admin");
    } catch (err) {
      console.error("Failed to check role");
    }
  };

  const loadRooms = async () => {
    try {
      setLoading(true);
      const res = await API.get("/rooms");
      setRooms(res.data || []);
    } catch (err) {
      setAlert({
        type: "error",
        message: "Failed to load rooms",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.capacity) {
      setAlert({
        type: "error",
        message: "Please fill in all fields",
      });
      return;
    }

    try {
      await API.post("/rooms", {
        name: formData.name,
        capacity: parseInt(formData.capacity),
      });

      setAlert({
        type: "success",
        message: "Room created successfully",
      });

      setFormData({ name: "", capacity: "" });
      setShowForm(false);
      await loadRooms();
    } catch (err) {
      setAlert({
        type: "error",
        message: err.response?.data?.message || "Failed to create room",
      });
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm("Are you sure you want to delete this room?")) {
      return;
    }

    try {
      await API.delete(`/rooms/${roomId}`);
      setAlert({
        type: "success",
        message: "Room deleted successfully",
      });
      await loadRooms();
    } catch (err) {
      setAlert({
        type: "error",
        message: err.response?.data?.message || "Failed to delete room",
      });
    }
  };

  return (
    <div className="container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
        <h2>Rooms</h2>
        {isAdmin && (
          <button
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Cancel" : "+ Add Room"}
          </button>
        )}
      </div>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {showForm && (
        <div className="card" style={{ marginBottom: "30px" }}>
          <div className="card-body">
            <form onSubmit={handleCreateRoom}>
              <div className="form-group">
                <label>Room Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Conference Hall A"
                />
              </div>

              <div className="form-group">
                <label>Capacity</label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) =>
                    setFormData({ ...formData, capacity: e.target.value })
                  }
                  placeholder="e.g., 100"
                  min="1"
                />
              </div>

              <button type="submit" className="btn btn-primary">
                Create Room
              </button>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <div className="spinner"></div>
        </div>
      ) : rooms.length === 0 ? (
        <div className="card">
          <div className="card-body" style={{ textAlign: "center", padding: "40px" }}>
            <p>No rooms available</p>
          </div>
        </div>
      ) : (
        <div className="grid">
          {rooms.map((room) => (
            <div key={room.id} className="card">
              <div className="card-body">
                <h3 style={{ marginBottom: "15px" }}>{room.name}</h3>
                <p style={{ marginBottom: "10px", color: "#666" }}>
                  <strong>Capacity:</strong> {room.capacity} seats
                </p>
                <p style={{ marginBottom: "15px", color: "#666" }}>
                  <strong>Seats:</strong> {room.seats?.length || 0} created
                </p>

                {isAdmin && (
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteRoom(room.id)}
                    style={{ width: "100%" }}
                  >
                    Delete Room
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
