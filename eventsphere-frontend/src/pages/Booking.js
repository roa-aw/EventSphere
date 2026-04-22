import { useState, useCallback, useEffect } from "react";
import API from "../services/api";
import Alert from "../components/Alert";

export default function Booking({ event, onBack, goToLogin }) {
  const [seats, setSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  const loadSeats = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get(`/seats/event/${event.id}`);
      setSeats(res.data || []);
    } catch (err) {
      setAlert({
        type: "error",
        message: "Failed to load seats",
      });
    } finally {
      setLoading(false);
    }
  }, [event.id]);

  useEffect(() => {
    loadSeats();
  }, [loadSeats]);

  const handleBook = async (seatId) => {
    // 🔒 Check login BEFORE booking
    if (!localStorage.getItem("token")) {
      setAlert({
        type: "error",
        message: "Please login to book a seat",
      });

      // Redirect to login after a short delay
      setTimeout(() => {
        goToLogin();
      }, 1000);

      return;
    }

    try {
      await API.post("/bookings", {
        eventId: event.id,
        seatId: seatId,
      });

      setAlert({
        type: "success",
        message: "Booking successful!",
      });

      setSelectedSeat(null);
      await loadSeats();

      setTimeout(() => {
        onBack();
      }, 1500);
    } catch (err) {
      setAlert({
        type: "error",
        message: err.response?.data?.message || "Booking failed",
      });
    }
  };

  return (
    <div className="container">
      <button
        className="btn btn-secondary"
        onClick={onBack}
        style={{ marginBottom: "20px" }}
      >
        ← Back to Events
      </button>

      <h2>{event.title}</h2>
      <p style={{ color: "#666", marginBottom: "20px" }}>
        {event.description}
      </p>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <div className="seats-container">
        <h3 style={{ textAlign: "center", marginBottom: "10px" }}>
          Select a Seat
        </h3>
        <p
          style={{
            textAlign: "center",
            fontSize: "12px",
            color: "#999",
            marginBottom: "20px",
          }}
        >
          🟢 Available | 🔴 Booked | 🟠 Selected
        </p>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <div className="spinner"></div>
          </div>
        ) : seats.length === 0 ? (
          <p style={{ textAlign: "center", color: "#999" }}>
            No seats available
          </p>
        ) : (
          <>
            <div className="seats-grid">
              {seats.map((seat) => (
                <button
                  key={seat.id}
                  className={`seat ${seat.isBooked ? "booked" : ""} ${
                    selectedSeat?.id === seat.id ? "selected" : ""
                  }`}
                  onClick={() => !seat.isBooked && setSelectedSeat(seat)}
                  disabled={seat.isBooked}
                  title={
                    seat.isBooked
                      ? "This seat is already booked"
                      : `Seat ${seat.seatNumber}`
                  }
                >
                  {seat.seatNumber}
                </button>
              ))}
            </div>

            {selectedSeat && (
              <div
                style={{
                  marginTop: "30px",
                  padding: "20px",
                  backgroundColor: "#f9f9f9",
                  borderRadius: "4px",
                  textAlign: "center",
                }}
              >
                <p style={{ marginBottom: "15px" }}>
                  <strong>Selected Seat:</strong>{" "}
                  {selectedSeat.seatNumber}
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => handleBook(selectedSeat.id)}
                >
                  Confirm Booking
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}