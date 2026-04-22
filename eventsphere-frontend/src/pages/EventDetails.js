import { useState, useEffect } from "react";
import API from "../services/api";

export default function EventDetails({ event, onBack, onBook }) {
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSeats();
  }, []);

  const loadSeats = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/seats/event/${event.id}`);
      setSeats(res.data || []);
    } catch {
      console.error("Failed to load seats");
    } finally {
      setLoading(false);
    }
  };

  const availableSeats = seats.filter(s => !s.isBooked).length;

  return (
    <div className="container">
      <button className="btn btn-secondary" onClick={onBack}>
        ← Back to Events
      </button>

      <h2 style={{ marginTop: "20px" }}>{event.title}</h2>

      <p style={{ color: "#666" }}>
        📅 {new Date(event.date).toLocaleString()}
      </p>

      <p style={{ marginTop: "10px" }}>
        {event.description || "No description available"}
      </p>

      <div style={{ marginTop: "20px" }}>
        <strong>Available Seats:</strong> {availableSeats}
      </div>

      <button
        className="btn btn-primary"
        style={{ marginTop: "20px" }}
        onClick={() => onBook(event)}
      >
        Book Now
      </button>
    </div>
  );
}