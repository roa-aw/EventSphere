import { useEffect, useState } from "react"
import API from "../services/api"
import Alert from "../components/Alert"
import { User, Shield } from "lucide-react"

export default function Profile() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [alert, setAlert] = useState(null)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({})
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    loadUserProfile()
  }, [])

  const loadUserProfile = async () => {
    if (!localStorage.getItem("token")) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const res = await API.get("/users/profile")
      setUser(res.data)
      setFormData(res.data)
      setIsAdmin(res.data?.role?.toLowerCase() === "admin")
    } catch {
      setAlert({ type: "error", message: "Failed to load profile" })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (e) => {
    e.preventDefault()

    try {
      await API.put(`/users/${user.id}`, formData)
      setUser(formData)
      setEditing(false)
      setAlert({
        type: "success",
        message: "Profile updated successfully",
      })
    } catch (err) {
      setAlert({
        type: "error",
        message: err.response?.data?.message || "Update failed",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-4xl">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-gray-500">Manage your account</p>
      </div>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {/* PROFILE CARD */}
      <div className="bg-white rounded-xl shadow-md p-6 flex items-center gap-6">

        {/* Avatar */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
          {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
        </div>

        {/* Info */}
        <div>
          <h2 className="text-lg font-semibold">{user?.fullName}</h2>
          <p className="text-gray-500">{user?.email}</p>

          <span className="inline-flex items-center gap-1 mt-2 px-2 py-1 rounded text-xs bg-violet-100 text-violet-700">
            <Shield className="w-3 h-3" />
            {user?.role || "User"}
          </span>
        </div>
      </div>

      {/* EDIT CARD */}
      <div className="bg-white rounded-xl shadow-md p-6">

        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <User className="w-5 h-5 text-violet-600" />
            Profile Information
          </h3>

          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700"
            >
              Edit
            </button>
          )}
        </div>

        {!editing ? (
          <div className="space-y-4 text-sm">

            <div>
              <p className="text-gray-400">Full Name</p>
              <p className="font-medium">{user?.fullName}</p>
            </div>

            <div>
              <p className="text-gray-400">Email</p>
              <p className="font-medium">{user?.email}</p>
            </div>

            <div>
              <p className="text-gray-400">Role</p>
              <p className="font-medium">{user?.role}</p>
            </div>

            {isAdmin && (
              <div className="mt-4 p-3 bg-violet-50 border-l-4 border-violet-600 rounded">
                <p className="text-violet-700 text-sm font-medium">
                  You have admin access
                </p>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={handleUpdate} className="space-y-4">

            <div>
              <label className="text-sm text-gray-500">Full Name</label>
              <input
                className="w-full mt-1 border rounded px-3 py-2"
                value={formData.fullName || ""}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm text-gray-500">Email</label>
              <input
                className="w-full mt-1 border rounded px-3 py-2"
                value={formData.email || ""}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-violet-600 text-white py-2 rounded hover:bg-violet-700"
              >
                Save
              </button>

              <button
                type="button"
                onClick={() => {
                  setEditing(false)
                  setFormData(user)
                }}
                className="flex-1 border py-2 rounded"
              >
                Cancel
              </button>
            </div>

          </form>
        )}
      </div>
    </div>
  )
}