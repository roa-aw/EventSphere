import { useEffect, useState } from "react"
import { Users, DoorOpen, Monitor } from "lucide-react"
import API from "../services/api"
import Alert from "../components/Alert"

export default function Rooms() {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [alert, setAlert] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: "", capacity: "" })

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
      setAlert({ type: "error", message: "Fill all fields" })
      return
    }

    try {
      await API.post("/rooms", {
        name: formData.name,
        capacity: parseInt(formData.capacity),
      })

      setAlert({ type: "success", message: "Room created" })
      setFormData({ name: "", capacity: "" })
      setShowForm(false)
      loadRooms()
    } catch {
      setAlert({ type: "error", message: "Create failed" })
    }
  }

  const handleDeleteRoom = async (id) => {
    if (!window.confirm("Delete this room?")) return

    try {
      await API.delete(`/rooms/${id}`)
      setAlert({ type: "success", message: "Deleted" })
      loadRooms()
    } catch {
      setAlert({ type: "error", message: "Delete failed" })
    }
  }

  const available = rooms.length

  return (
    <div className="space-y-6 p-4 md:p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Rooms</h1>
          <p className="text-gray-500">Manage event rooms</p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700"
          >
            {showForm ? "Cancel" : "+ Add Room"}
          </button>
        )}
      </div>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {/* FORM */}
      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-md max-w-md">
          <form onSubmit={handleCreateRoom} className="space-y-4">

            <div>
              <label className="text-sm text-gray-500">Room Name</label>
              <input
                className="w-full mt-1 border rounded px-3 py-2"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm text-gray-500">Capacity</label>
              <input
                type="number"
                className="w-full mt-1 border rounded px-3 py-2"
                value={formData.capacity}
                onChange={(e) =>
                  setFormData({ ...formData, capacity: e.target.value })
                }
              />
            </div>

            <button className="w-full bg-violet-600 text-white py-2 rounded">
              Create Room
            </button>

          </form>
        </div>
      )}

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <div className="bg-white p-4 rounded-xl shadow flex items-center gap-3">
          <DoorOpen className="text-green-600" />
          <div>
            <p className="text-sm text-gray-500">Rooms</p>
            <p className="text-xl font-bold">{available}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow flex items-center gap-3">
          <Users className="text-indigo-600" />
          <div>
            <p className="text-sm text-gray-500">Total Capacity</p>
            <p className="text-xl font-bold">
              {rooms.reduce((a, r) => a + (r.capacity || 0), 0)}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow flex items-center gap-3">
          <Monitor className="text-amber-600" />
          <div>
            <p className="text-sm text-gray-500">Avg Capacity</p>
            <p className="text-xl font-bold">
              {rooms.length
                ? Math.round(
                    rooms.reduce((a, r) => a + r.capacity, 0) / rooms.length
                  )
                : 0}
            </p>
          </div>
        </div>

      </div>

      {/* GRID */}
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
        </div>
      ) : rooms.length === 0 ? (
        <p className="text-center text-gray-400 py-16">
          No rooms available
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition"
            >
              <h3 className="font-semibold text-lg">{room.name}</h3>

              <p className="text-sm text-gray-500 mt-2">
                Capacity: {room.capacity}
              </p>

              <p className="text-sm text-gray-500">
                Seats: {room.seats?.length || 0}
              </p>

              {isAdmin && (
                <button
                  onClick={() => handleDeleteRoom(room.id)}
                  className="mt-4 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}