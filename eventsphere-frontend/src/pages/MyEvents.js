import { useEffect, useState } from "react";
import API from "../services/api";
import EventCard from "../components/EventCard";

export default function MyEvents() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    API.get("/events/my")
      .then(res => setEvents(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">My Events</h1>

      {events.length === 0 ? (
        <p className="text-gray-400">No events yet</p>
      ) : (
        <div className="grid gap-6">
          {events.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}