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
          <div className="space-y-3">
            {recentEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100"
              >
                <div>
                  <p className="font-medium">{event.title}</p>
                  <p className="text-sm text-gray-500">
                    {formatDate(event.date)}
                  </p>
                </div>

                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                  🎭
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

/* 🔥 reusable stat card */
function StatCard({ title, value, icon: Icon, color }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex justify-between items-center">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-3xl font-bold mt-1">{value}</p>
      </div>

      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  )
}