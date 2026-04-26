import { useEffect, useState } from "react"
import { Calendar, Ticket, DoorOpen } from "lucide-react"
import API from "../services/api"
import Alert from "../components/Alert"

export default function Dashboard() {
  const [recentEvents, setRecentEvents] = useState([])
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalBookings: 0,
    totalRooms: 0,
  })
  const [loading, setLoading] = useState(true)
  const [alert, setAlert] = useState(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)

      const eventsRes = await API.get("/events")
      const events = eventsRes.data || []

      const roomsRes = await API.get("/rooms")
      const rooms = roomsRes.data || []

      let bookings = []

      if (localStorage.getItem("token")) {
        try {
          const bookingsRes = await API.get("/bookings")
          bookings = bookingsRes.data || []
        } catch {}
      }

      setRecentEvents(
        events
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5)
      )

      setStats({
        totalEvents: events.length,
        totalBookings: bookings.length,
        totalRooms: rooms.length,
      })
    } catch {
      setAlert({
        type: "error",
        message: "Failed to load dashboard data",
      })
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })

  return (
    <div className="space-y-8 p-4 md:p-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-500">
          Overview of your platform
        </p>
      </div>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <StatCard
          title="Total Events"
          value={stats.totalEvents}
          icon={Calendar}
          color="from-violet-500 to-purple-600"
        />

        <StatCard
          title="Total Bookings"
          value={stats.totalBookings}
          icon={Ticket}
          color="from-indigo-500 to-blue-600"
        />

        <StatCard
          title="Total Rooms"
          value={stats.totalRooms}
          icon={DoorOpen}
          color="from-cyan-500 to-teal-600"
        />

      </div>

      {/* RECENT EVENTS */}
<div className="bg-white rounded-xl shadow-md p-6 space-y-4">

  <div className="flex justify-between items-center">
    <h3 className="font-semibold text-lg">Recent Events</h3>
  </div>

  {loading ? (
    <div className="flex justify-center py-10">
      <div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
    </div>
  ) : recentEvents.length === 0 ? (
    <p className="text-center text-gray-400">
      No events yet
    </p>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

      {recentEvents.map((event) => (
        <div
          key={event.id}
          onClick={() => {
            onNavigate("events");
            setEventDetails(event);
          }}
          className="group cursor-pointer bg-gray-50 hover:bg-white rounded-xl shadow-sm hover:shadow-md transition overflow-hidden"
        >

          {/* IMAGE */}
          <div className="h-32 w-full overflow-hidden bg-gray-100">
            {event.imageUrl ? (
              <img
                src={event.imageUrl}
                alt={event.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "https://picsum.photos/300/200";
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                No Image
              </div>
            )}
          </div>

          {/* CONTENT */}
          <div className="p-4 space-y-1">
            <p className="font-semibold text-sm group-hover:text-violet-600 transition line-clamp-1">
              {event.title}
            </p>

            <p className="text-xs text-gray-500">
              {formatDate(event.date)}
            </p>
          </div>

        </div>
      ))}

    </div>
  )}
</div>
</div>
  )
}

