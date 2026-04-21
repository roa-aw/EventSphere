import { useEffect, useState } from "react";
import API from "../services/api";

export default function Events({ setSelectedEvent }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    API.get("/events")
      .then((res) => setEvents(res.data))
      .catch(() => alert("Failed to load events"));
  }, []);

  return (
    <div>
      <h2>Events</h2>

      {events.map((e) => (
        <div
          key={e.id}
          style={{ border: "1px solid black", margin: "10px", padding: "10px", cursor: "pointer" }}
          onClick={() => setSelectedEvent(e)}
        >
          <h3>{e.title}</h3>
          <p>{e.description}</p>
        </div>
      ))}
    </div>
  );
}