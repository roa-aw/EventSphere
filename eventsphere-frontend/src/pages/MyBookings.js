import { useEffect, useState } from "react"
import { Calendar, MapPin, Armchair } from "lucide-react"
import API from "../services/api"
import Alert from "../components/Alert"

export default function MyBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [alert, setAlert] = useState(null)

  useEffect(() => {
    loadBookings()
  }, [])

  const loadBookings = async () => {
    if (!localStorage.getItem("token")) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const res = await API.get("/bookings")
      setBookings(res.data || [])
    } catch (err) {
      setAlert({
        type: "error",
        message: err.response?.data?.message || "Failed to load bookings",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Cancel this booking?")) return

    try {
      await API.delete(`/bookings/${bookingId}`)
      setAlert({ type: "success", message: "Booking cancelled" })
      await loadBookings()
    } catch (err) {
      setAlert({
        type: "error",
        message: err.response?.data?.message || "Failed to cancel booking",
      })
    }
  }

  const downloadTicket = async (bookingId) => {
    try {
      const response = await API.get(`/bookings/${bookingId}/ticket`, {
        responseType: "blob",
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")

      link.href = url
      link.setAttribute("download", "ticket.pdf")
      document.body.appendChild(link)
      link.click()
    } catch (err) {
      setAlert({
        type: "error",
        message: "Failed to download ticket",
      })
    }
  }

  const getStatusStyle = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-700"
      case "Cancelled":
        return "bg-red-100 text-red-700"
      default:
        return "bg-amber-100 text-amber-700"
    }
  }

  const activeBookings = bookings.filter((b) => b.status !== "Cancelled")
  const cancelledBookings = bookings.filter((b) => b.status === "Cancelled")

  return (
    <div className="space-y-8 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold">My Bookings</h1>
        <p className="text-gray-500">Manage your bookings</p>
      </div>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
        </div>
      ) : bookings.length === 0 ? (
        <p className="text-center text-gray-400 py-16">
          No bookings yet. Start by booking an event!
        </p>
      ) : (
        <>
          {activeBookings.length > 0 && (
            <div className="space-y-4">
              <h2 className="font-semibold">Active Bookings</h2>

              <div className="grid gap-4">
                {activeBookings.map((booking) => {
                  const id =
                    booking.id || booking.Id || booking.bookingId

                  return (
                    <div
                      key={id}
                      className="bg-white rounded-xl shadow-md p-5 flex justify-between items-start"
                    >
                      <div className="space-y-2">
                        <h3 className="font-semibold">
                          {booking.eventTitle || "Event"}
                        </h3>

                        <div className="text-sm text-gray-500 space-y-1">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {booking.roomName || "N/A"}
                          </div>

                          <div className="flex items-center gap-2">
                            <Armchair className="w-4 h-4" />
                            Seat: {booking.seatNumber || "N/A"}
                          </div>

                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {booking.bookingDate
                              ? new Date(
                                  booking.bookingDate
                                ).toLocaleDateString()
                              : "N/A"}
                          </div>
                        </div>

                        <span
                          className={`inline-block px-2 py-1 text-xs rounded ${getStatusStyle(
                            booking.status
                          )}`}
                        >
                          {booking.status || "Pending"}
                        </span>
                      </div>

                      <div className="flex flex-col gap-2 items-end">
                        <button
                          onClick={() => downloadTicket(id)}
                          className="text-violet-600 text-sm hover:underline"
                        >
                          Download Ticket
                        </button>

                        <button
                          onClick={() => handleCancelBooking(id)}
                          disabled={booking.status === "Cancelled"}
                          className="text-red-600 text-sm hover:underline disabled:opacity-50"
                        >
                          {booking.status === "Cancelled"
                            ? "Cancelled"
                            : "Cancel"}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {cancelledBookings.length > 0 && (
            <div className="space-y-4 opacity-60">
              <h2 className="font-semibold">Cancelled</h2>

              <div className="grid gap-4">
                {cancelledBookings.map((booking) => {
                  const id =
                    booking.id || booking.Id || booking.bookingId

                  return (
                    <div
                      key={id}
                      className="bg-white rounded-xl shadow-md p-5"
                    >
                      <h3 className="font-semibold">
                        {booking.eventTitle}
                      </h3>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}