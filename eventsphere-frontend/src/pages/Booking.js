import { useEffect, useState } from "react";
import API from "../services/api";

export default function Booking({ event }) {
  const [seats, setSeats] = useState([]);

  useEffect(() => {
    API.get(`/seats/event/${event.id}`).then((res) => setSeats(res.data));
  }, []);

  const handleBook = async (seatId) => {
  try {
    await API.post("/bookings", {
      eventId: event.id,
      seatId: seatId,
    });

    alert("Booked!");

    // 🔄 refresh seats
    const res = await API.get(`/seats/event/${event.id}`);
    setSeats(res.data);

  } catch (err) {
    alert(err.response?.data?.message || "Booking failed");
  }
};

  return (
    <div>
      <h2>{event.title}</h2>

      <h3>Seats</h3>

      {seats.map((seat) => (
  <button
    key={seat.id}
    onClick={() => handleBook(seat.id)}
    disabled={seat.isBooked}
    style={{
      margin: "5px",
      backgroundColor: seat.isBooked ? "red" : "green",
      color: "white",
      cursor: seat.isBooked ? "not-allowed" : "pointer"
    }}
  >
    Seat {seat.seatNumber}
  </button>
))}
    </div>
  );
}