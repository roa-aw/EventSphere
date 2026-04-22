import { useEffect, useState } from "react";
import API from "../services/api";
import Alert from "../components/Alert";

export default function Dashboard() {
  const [recentEvents, setRecentEvents] = useState([]);
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalBookings: 0,
    totalRooms: 0,
  });
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // ✅ Always allowed
      const eventsRes = await API.get("/events");
      const events = eventsRes.data || [];

      const roomsRes = await API.get("/rooms");
      const rooms = roomsRes.data || [];

      let bookings = [];

      // 🔒 ONLY fetch bookings if logged in
      if (localStorage.getItem("token")) {
        try {
          const bookingsRes = await API.get("/bookings");
          bookings = bookingsRes.data || [];
        } catch {
          // silently ignore 401
          bookings = [];
        }
      }

      const recentEventsList = events
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5);

      setRecentEvents(recentEventsList);

      setStats({
        totalEvents: events.length,
        totalBookings: bookings.length, // will be 0 if not logged
        totalRooms: rooms.length,
      });

    } catch (err) {
      setAlert({
        type: "error",
        message: "Failed to load dashboard data",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="container">
      <h2>Dashboard</h2>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🎪</div>
          <div className="stat-content">
            <p className="stat-label">Total Events</p>
            <p className="stat-value">{stats.totalEvents}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎫</div>
          <div className="stat-content">
            <p className="stat-label">Total Bookings</p>
            <p className="stat-value">{stats.totalBookings}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏢</div>
          <div className="stat-content">
            <p className="stat-label">Total Rooms</p>
            <p className="stat-value">{stats.totalRooms}</p>
          </div>
        </div>
      </div>

      {/* Recent Events */}
      <div style={{ marginTop: "30px" }}>
        <h3>Recent Events</h3>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <div className="spinner"></div>
          </div>
        ) : recentEvents.length === 0 ? (
          <div className="card">
            <div className="card-body" style={{ textAlign: "center", padding: "40px" }}>
              <p>No events yet</p>
            </div>
          </div>
        ) : (
          <div className="grid" style={{ gridTemplateColumns: "1fr" }}>
            {recentEvents.map((event) => (
              <div key={event.id} className="card">
                <div className="card-body">
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>
                      <h4>{event.title}</h4>
                      <p>📅 {formatDate(event.date)}</p>
                      <p>{event.description || "No description"}</p>
                    </div>
                    <div style={{ fontSize: "32px" }}>🎭</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}