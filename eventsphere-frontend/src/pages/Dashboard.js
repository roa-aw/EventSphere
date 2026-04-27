import { useEffect, useState } from "react"
import { Calendar, Ticket, DoorOpen, ArrowRight, TrendingUp } from "lucide-react"
import API from "../services/api"
import Alert from "../components/Alert"

export default function Dashboard({ onNavigate, setEventDetails }) {
  const [recentEvents, setRecentEvents] = useState([])
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalBookings: 0,
    totalRooms: 0,
  })
  const [loading, setLoading] = useState(true)
  const [alert, setAlert] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    API.get("/users/profile").then((res) => setUser(res.data)).catch(() => {})
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
      try {
        const bookingsRes = await API.get("/bookings/all") // all bookings (admin)
        bookings = bookingsRes.data || []
      } catch {
        try {
          const bookingsRes = await API.get("/bookings") // fallback for non-admin
          bookings = bookingsRes.data || []
        } catch {}
      }

      setRecentEvents(
        events.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6)
      )

      setStats({
        totalEvents: events.length,
        totalBookings: bookings.length,
        totalRooms: rooms.length,
      })
    } catch {
      setAlert({ type: "error", message: "Failed to load dashboard data" })
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

  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  return (
    <div className="space-y-8 p-4 md:p-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {greeting()}{user?.fullName ? `, ${user.fullName.split(" ")[0]}` : ""} 👋
          </h1>
          <p className="text-gray-400 text-sm mt-0.5">
            Here's what's happening on your platform today.
          </p>
        </div>

        <button
          onClick={loadDashboardData}
          className="text-xs text-violet-600 hover:underline flex items-center gap-1"
        >
          <TrendingUp className="w-3 h-3" /> Refresh
        </button>
      </div>

      {alert && (
        <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
      )}

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Events"
          value={stats.totalEvents}
          icon={Calendar}
          color="from-violet-500 to-purple-600"
          sub="Active on platform"
        />
        <StatCard
          title="Total Bookings"
          value={stats.totalBookings}
          icon={Ticket}
          color="from-indigo-500 to-blue-600"
          sub="Across all events"
        />
        <StatCard
          title="Total Rooms"
          value={stats.totalRooms}
          icon={DoorOpen}
          color="from-cyan-500 to-teal-600"
          sub="Available venues"
        />
      </div>

      {/* RECENT EVENTS */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-5">

        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-gray-900">Recent Events</h3>
            <p className="text-xs text-gray-400 mt-0.5">Latest events on the platform</p>
          </div>
          <button
            onClick={() => onNavigate("events")}
            className="flex items-center gap-1 text-xs text-violet-600 hover:underline"
          >
            View all <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
          </div>
        ) : recentEvents.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-10 h-10 text-gray-200 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">No events yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentEvents.map((event) => (
              <div
                key={event.id}
                onClick={() => {
                  if (setEventDetails) setEventDetails(event)
                  onNavigate("eventDetails")
                }}
                className="group cursor-pointer rounded-xl border border-gray-100 hover:border-violet-200 hover:shadow-md transition-all overflow-hidden"
              >
                {/* IMAGE */}
                <div className="h-36 w-full overflow-hidden bg-gray-100">
                  {event.imageUrl ? (
                    <img
                      src={event.imageUrl}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      onError={(e) => {
                        e.currentTarget.onerror = null
                        e.currentTarget.src = "https://picsum.photos/300/200"
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-violet-50 to-indigo-50">
                      <Calendar className="w-8 h-8 text-violet-200" />
                    </div>
                  )}
                </div>

                {/* CONTENT */}
                <div className="p-4 space-y-2">
                  <p className="font-semibold text-sm text-gray-900 group-hover:text-violet-600 transition line-clamp-1">
                    {event.title}
                  </p>

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-400">{formatDate(event.date)}</p>
                    {event.category && (
                      <span className="text-xs px-2 py-0.5 bg-violet-50 text-violet-600 rounded-full border border-violet-100">
                        {event.category}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ title, value, icon: Icon, color, sub }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex justify-between items-center hover:shadow-md transition">
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-wide">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
      </div>
      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-sm`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  )
}