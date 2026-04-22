import { useEffect, useState } from "react";
import API from "../services/api";
import Alert from "../components/Alert";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const res = await API.get("/bookings");
      setBookings(res.data || []);
    } catch (err) {
      setAlert({
        type: "error",
        message: err.response?.data?.message || "Failed to load bookings",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      await API.delete(`/bookings/${bookingId}`);
      setAlert({
        type: "success",
        message: "Booking cancelled successfully",
      });
      await loadBookings();
    } catch (err) {
      setAlert({
        type: "error",
        message: err.response?.data?.message || "Failed to cancel booking",
      });
    }
  };

  // 🎨 Status styling
  const getStatusStyle = (status) => {
    switch (status) {
      case "Confirmed":
        return { backgroundColor: "#e8f5e9", color: "#2e7d32" };
      case "Cancelled":
        return { backgroundColor: "#ffebee", color: "#c62828" };
      default:
        return { backgroundColor: "#fff3e0", color: "#e65100" };
    }
  };

  return (
    <div className="container">
      <h2>My Bookings</h2>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          <div className="spinner"></div>
        </div>
      ) : bookings.length === 0 ? (
        <div className="card">
          <div
            className="card-body"
            style={{ textAlign: "center", padding: "40px" }}
          >
            <p>No bookings yet. Start by booking an event!</p>
          </div>
        </div>
      ) : (
        <div className="grid" style={{ gridTemplateColumns: "1fr" }}>
          {bookings.map((booking) => {
            const bookingId =
              booking.id || booking.Id || booking.bookingId;

            return (
              <div key={bookingId} className="card">
                <div className="card-body">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "start",
                    }}
                  >
                    <div>
                      <h3 style={{ marginBottom: "10px" }}>
                        {booking.eventTitle || "Event"}
                      </h3>

                      <p style={{ color: "#666", marginBottom: "6px" }}>
                        <strong>Room:</strong>{" "}
                        {booking.roomName || "N/A"}
                      </p>

                      <p style={{ color: "#666", marginBottom: "6px" }}>
                        <strong>Seat:</strong>{" "}
                        {booking.seatNumber || "N/A"}
                      </p>

                      <p style={{ color: "#666", marginBottom: "6px" }}>
                        <strong>Status:</strong>{" "}
                        <span
                          style={{
                            padding: "4px 8px",
                            borderRadius: "4px",
                            ...getStatusStyle(booking.status),
                          }}
                        >
                          {booking.status || "Pending"}
                        </span>
                      </p>

                      <p style={{ color: "#999", fontSize: "12px" }}>
                        Booked on{" "}
                        {booking.bookingDate
                          ? new Date(
                              booking.bookingDate
                            ).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>

                    <button
                      className="btn btn-danger"
                      disabled={booking.status === "Cancelled"}
                      onClick={() =>
                        handleCancelBooking(bookingId)
                      }
                    >
                      {booking.status === "Cancelled"
                        ? "Cancelled"
                        : "Cancel"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}