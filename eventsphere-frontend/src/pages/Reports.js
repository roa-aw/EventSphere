import { useEffect, useState } from "react";
import API from "../services/api";
import { Calendar, Ticket, DollarSign } from "lucide-react";
import { Building } from "lucide-react";

export default function Reports() {
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const eventsRes = await API.get("/events");
      const bookingsRes = await API.get("/bookings");
      const roomsRes = await API.get("/rooms");

      setEvents(eventsRes.data || []);
      setBookings(bookingsRes.data || []);
      setRooms(roomsRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 📊 bookings per event
  const eventStats = events.map((event) => {
    const count = bookings.filter((b) => b.eventId === event.id).length;
    return { ...event, bookings: count };
  });

  // 🥇 top event
  const topEvent = [...eventStats].sort((a, b) => b.bookings - a.bookings)[0];

  // 💰 revenue (fake: 10 per booking)
  const revenue = bookings.length * 10;

  // 🏟 most used room
  const roomUsage = rooms.map((room) => {
    const count = bookings.filter((b) => b.roomId === room.id).length;
    return { ...room, usage: count };
  });

  const topRoom = roomUsage.sort((a, b) => b.usage - a.usage)[0];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Reports & Analytics</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* 🔥 TOP CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

  {/* Top Event */}
  <div className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white p-6 rounded-xl shadow-md flex justify-between items-center">
    <div>
      <p className="text-sm opacity-80">Top Event</p>
      <p className="text-lg font-semibold mt-1">
        {topEvent
          ? `${topEvent.title} (${topEvent.bookings})`
          : "No data"}
      </p>
    </div>
    <Calendar className="w-8 h-8 opacity-80" />
  </div>

  {/* Total Bookings */}
  <div className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white p-6 rounded-xl shadow-md flex justify-between items-center">
    <div>
      <p className="text-sm opacity-80">Total Bookings</p>
      <p className="text-2xl font-bold mt-1">
        {bookings.length}
      </p>
    </div>
    <Ticket className="w-8 h-8 opacity-80" />
  </div>

  {/* Revenue */}
  <div className="bg-gradient-to-br from-green-500 to-emerald-500 text-white p-6 rounded-xl shadow-md flex justify-between items-center">
    <div>
      <p className="text-sm opacity-80">Revenue</p>
      <p className="text-2xl font-bold mt-1">
        ${revenue}
      </p>
    </div>
    <DollarSign className="w-8 h-8 opacity-80" />
  </div>

          </div>

{/* 🏟 MOST USED ROOM */}
<div className="bg-white p-6 rounded-xl shadow-md flex justify-between items-center hover:shadow-lg transition">
  
  <div>
    <h2 className="text-sm text-gray-500">Most Used Room</h2>

    {topRoom ? (
      <p className="text-lg font-semibold mt-1">
        {topRoom.name}
        <span className="text-sm text-gray-500 ml-2">
          ({topRoom.usage} bookings)
        </span>
      </p>
    ) : (
      <p className="text-gray-400 mt-1">No data yet</p>
    )}
  </div>

  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
    <Building className="w-6 h-6 text-white" />
  </div>

</div>


{/* 📊 EVENTS OVERVIEW */}
<div className="bg-white p-6 rounded-xl shadow-md">
  <h2 className="font-semibold text-lg mb-4">Events Overview</h2>

  {eventStats.length === 0 ? (
    <p className="text-gray-400">
      No bookings yet — create and book events
    </p>
  ) : (
    <div className="divide-y">

      {eventStats.map((event) => (
        <div
          key={event.id}
          className="flex justify-between items-center py-3 hover:bg-gray-50 px-2 rounded transition"
        >
          <div>
            <p className="font-medium text-gray-800">
              {event.title}
            </p>
          </div>

          <span className="text-sm text-gray-500">
            {event.bookings} bookings
          </span>
        </div>
      ))}

    </div>
  )}
</div>
        </>
      )}
    </div>
  );
}