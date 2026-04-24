import { useEffect, useState } from "react"
import { CreditCard, CheckCircle, Clock } from "lucide-react"
import API from "../services/api"
import Alert from "../components/Alert"

export default function Payments() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [alert, setAlert] = useState(null)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState("")

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
    } catch {
      setAlert({ type: "error", message: "Failed to load bookings" })
    } finally {
      setLoading(false)
    }
  }

  const handlePayment = async (e) => {
    e.preventDefault()

    if (!paymentMethod) {
      setAlert({ type: "error", message: "Select payment method" })
      return
    }

    await new Promise((r) => setTimeout(r, 1500))

    setAlert({
      type: "success",
      message: `Payment successful via ${paymentMethod}`,
    })

    setSelectedBooking(null)
    setPaymentMethod("")
  }

  const getStatusStyle = (status) => {
    if (status === "Paid")
      return "bg-green-100 text-green-700"
    return "bg-amber-100 text-amber-700"
  }

  const paid = bookings.filter(b => b.status === "Paid").length
  const pending = bookings.filter(b => b.status !== "Paid").length

  return (
    <div className="space-y-6 p-4 md:p-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Payments</h1>
        <p className="text-gray-500">Manage your payments</p>
      </div>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {/* PAYMENT FORM */}
      {selectedBooking && (
        <div className="bg-white rounded-xl shadow-md p-6 max-w-lg">

          <h2 className="font-semibold mb-4">Complete Payment</h2>

          <div className="bg-gray-50 p-4 rounded mb-6">
            <p><strong>{selectedBooking.eventTitle}</strong></p>
            <p className="text-sm text-gray-500">
              Seat: {selectedBooking.seatNumber}
            </p>
            <p className="text-xl font-bold text-violet-600 mt-2">
              $99.99
            </p>
          </div>

          <form onSubmit={handlePayment} className="space-y-4">

            <div className="grid grid-cols-2 gap-3">
              {["Credit Card", "PayPal", "Google Pay", "Apple Pay"].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setPaymentMethod(m)}
                  className={`p-3 rounded border text-sm ${
                    paymentMethod === m
                      ? "border-violet-600 bg-violet-50"
                      : "border-gray-200"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="flex-1 border rounded py-2"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex-1 bg-violet-600 text-white rounded py-2 hover:bg-violet-700"
              >
                Pay
              </button>
            </div>
          </form>
        </div>
      )}

      {/* LIST VIEW */}
      {!selectedBooking && (
        <>
          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            <div className="bg-white p-4 rounded-xl shadow flex items-center gap-3">
              <CheckCircle className="text-green-600" />
              <div>
                <p className="text-sm text-gray-500">Paid</p>
                <p className="text-xl font-bold">{paid}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow flex items-center gap-3">
              <Clock className="text-amber-600" />
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-xl font-bold">{pending}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow flex items-center gap-3">
              <CreditCard className="text-violet-600" />
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-xl font-bold">$0</p>
              </div>
            </div>

          </div>

          {/* BOOKINGS */}
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
            </div>
          ) : bookings.length === 0 ? (
            <p className="text-center text-gray-400 py-16">
              No bookings available
            </p>
          ) : (
            <div className="grid gap-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-white p-5 rounded-xl shadow flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-semibold">
                      {booking.eventTitle}
                    </h3>

                    <p className="text-sm text-gray-500">
                      Seat: {booking.seatNumber}
                    </p>

                    <span className={`text-xs px-2 py-1 rounded ${getStatusStyle(booking.status)}`}>
                      {booking.status || "Pending"}
                    </span>
                  </div>

                  {booking.status !== "Paid" ? (
                    <button
                      onClick={() => setSelectedBooking(booking)}
                      className="bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700"
                    >
                      Pay
                    </button>
                  ) : (
                    <span className="text-green-600 text-sm">
                      ✓ Paid
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}