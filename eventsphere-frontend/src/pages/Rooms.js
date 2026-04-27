import { useEffect, useState } from "react"
import { Users, DoorOpen, BarChart2, Trash2, Plus, X, Image } from "lucide-react"
import API from "../services/api"
import Alert from "../components/Alert"

export default function Rooms() {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [alert, setAlert] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: "", capacity: "", imageUrl: "" })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    checkAdminRole()
    loadRooms()
  }, [])

  const checkAdminRole = async () => {
    try {
      const res = await API.get("/users/profile")
      setIsAdmin(res.data?.role?.toLowerCase() === "admin")
    } catch {}
  }

  const loadRooms = async () => {
    try {
      setLoading(true)
      const res = await API.get("/rooms")
      setRooms(res.data || [])
    } catch {
      setAlert({ type: "error", message: "Failed to load rooms" })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateRoom = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.capacity) {
      setAlert({ type: "error", message: "Name and capacity are required" })
      return
    }
    try {
      setSubmitting(true)
      await API.post("/rooms", {
        name: formData.name,
        capacity: parseInt(formData.capacity),
        imageUrl: formData.imageUrl
      })
      setAlert({ type: "success", message: "Room created successfully" })
      setFormData({ name: "", capacity: "", imageUrl: "" })
      setShowForm(false)
      loadRooms()
    } catch {
      setAlert({ type: "error", message: "Failed to create room" })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteRoom = async (id) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return
    try {
      await API.delete(`/rooms/${id}`)
      setAlert({ type: "success", message: "Room deleted" })
      loadRooms()
    } catch {
      setAlert({ type: "error", message: "Failed to delete room" })
    }
  }

  const totalCapacity = rooms.reduce((a, r) => a + (r.capacity || 0), 0)
  const avgCapacity = rooms.length
    ? Math.round(totalCapacity / rooms.length)
    : 0

  return (
    <div className="space-y-6 p-4 md:p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rooms</h1>
          <p className="text-gray-500 text-sm mt-0.5">Browse and manage event venues</p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showForm ? "Cancel" : "Add Room"}
          </button>
        )}
      </div>

      {alert && (
        <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
      )}

      {/* ADD ROOM FORM */}
      {showForm && isAdmin && (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 max-w-lg">
          <h2 className="font-semibold text-gray-800 mb-4">New Room</h2>
          <form onSubmit={handleCreateRoom} className="space-y-4">

            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                Room Name
              </label>
              <input
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                placeholder="e.g. Conference Hall A"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                Capacity
              </label>
              <input
                type="number"
                min="1"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                placeholder="e.g. 50"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                Image URL <span className="text-gray-400 normal-case font-normal">(optional)</span>
              </label>
              <input
                type="url"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
                placeholder="https://..."
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              />
            </div>

            {formData.imageUrl && (
              <img
                src={formData.imageUrl}
                alt="preview"
                className="w-full h-36 object-cover rounded-lg border border-gray-100"
                onError={(e) => { e.currentTarget.style.display = "none" }}
              />
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white py-2 rounded-lg text-sm font-medium transition-colors"
            >
              {submitting ? "Creating..." : "Create Room"}
            </button>
          </form>
        </div>
      )}

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: DoorOpen, color: "text-violet-600 bg-violet-50", label: "Total Rooms", value: rooms.length },
          { icon: Users, color: "text-indigo-600 bg-indigo-50", label: "Total Capacity", value: totalCapacity },
          { icon: BarChart2, color: "text-amber-600 bg-amber-50", label: "Avg Capacity", value: avgCapacity },
        ].map(({ icon: Icon, color, label, value }) => (
          <div key={label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500">{label}</p>
              <p className="text-xl font-bold text-gray-900">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ROOM GRID */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
        </div>
      ) : rooms.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <DoorOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>No rooms available</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              isAdmin={isAdmin}
              onDelete={handleDeleteRoom}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function RoomCard({ room, isAdmin, onDelete }) {
  const [imgError, setImgError] = useState(false)

  return (
    <div className="group bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 overflow-hidden">

      {/* IMAGE */}
      <div className="relative h-44 overflow-hidden bg-gray-100">
        {room.imageUrl && !imgError ? (
          <img
            src={room.imageUrl}
            alt={room.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-gray-50 to-gray-100">
            <Image className="w-8 h-8 text-gray-300" />
            <span className="text-xs text-gray-400">No image</span>
          </div>
        )}

        {/* CAPACITY BADGE overlaid on image */}
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
          <Users className="w-3 h-3" />
          {room.capacity}
        </div>
      </div>

      {/* CONTENT */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-base truncate">
          {room.name}
        </h3>
        <p className="text-sm text-gray-400 mt-0.5">
          Up to {room.capacity} attendees
        </p>

        {/* Admin delete — subtle, at bottom */}
        {isAdmin && (
          <button
            onClick={() => onDelete(room.id)}
            className="mt-4 w-full flex items-center justify-center gap-2 py-1.5 rounded-lg border border-red-200 text-red-500 text-sm hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete Room
          </button>
        )}
      </div>
    </div>
  )
}