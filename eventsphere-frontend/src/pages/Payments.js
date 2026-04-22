import { useEffect, useState } from "react";
import API from "../services/api";
import Alert from "../components/Alert";

// Event types for filtering (can be used for future enhancements)

export default function Payments() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    if (!localStorage.getItem("token")) {
  setLoading(false);
  return;
}
    try {
      setLoading(true);
      const res = await API.get("/bookings");
      setBookings(res.data || []);
    } catch (err) {
      setAlert({
        type: "error",
        message: "Failed to load bookings",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!paymentMethod) {
      setAlert({
        type: "error",
        message: "Please select a payment method",
      });
      return;
    }

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setAlert({
        type: "success",
        message: `Payment successful via ${paymentMethod}!`,
      });

      setSelectedBooking(null);
      setPaymentMethod("");
      
      // In a real app, you would update the booking status
      // await API.put(`/bookings/${selectedBooking.id}`, { status: "Paid" });
    } catch (err) {
      setAlert({
        type: "error",
        message: "Payment failed. Please try again.",
      });
    }
  };

  return (
    <div className="container">
      <h2>Payments</h2>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {selectedBooking ? (
        <div className="card" style={{ maxWidth: "600px" }}>
          <div className="card-header">
            <h3>Complete Payment</h3>
          </div>

          <div className="card-body">
            <div style={{ marginBottom: "30px", padding: "20px", backgroundColor: "#f9f9f9", borderRadius: "4px" }}>
              <p style={{ marginBottom: "10px" }}>
                <strong>Event:</strong> {selectedBooking.eventTitle}
              </p>
              <p style={{ marginBottom: "10px" }}>
                <strong>Seat:</strong> {selectedBooking.seatNumber}
              </p>
              <p style={{ marginBottom: "0" }}>
                <strong>Amount:</strong> <span style={{ fontSize: "20px", color: "#667eea" }}>$99.99</span>
              </p>
            </div>

            <form onSubmit={handlePayment}>
              <div className="form-group">
                <label>Select Payment Method</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  {[
                    { id: "credit-card", label: "💳 Credit Card", value: "Credit Card" },
                    { id: "debit-card", label: "🏦 Debit Card", value: "Debit Card" },
                    { id: "paypal", label: "🅿️ PayPal", value: "PayPal" },
                    { id: "apple-pay", label: "🍎 Apple Pay", value: "Apple Pay" },
                    { id: "google-pay", label: "🔵 Google Pay", value: "Google Pay" },
                    { id: "bank-transfer", label: "🏧 Bank Transfer", value: "Bank Transfer" },
                  ].map((method) => (
                    <label
                      key={method.id}
                      style={{
                        padding: "15px",
                        border: paymentMethod === method.value ? "2px solid #667eea" : "1px solid #ddd",
                        borderRadius: "4px",
                        cursor: "pointer",
                        backgroundColor: paymentMethod === method.value ? "#f0f0ff" : "white",
                      }}
                    >
                      <input
                        type="radio"
                        name="payment-method"
                        value={method.value}
                        checked={paymentMethod === method.value}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        style={{ marginRight: "8px" }}
                      />
                      {method.label}
                    </label>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setSelectedBooking(null)}
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  Pay $99.99
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <>
          <p style={{ marginBottom: "20px", color: "#666" }}>
            Select a booking to proceed with payment
          </p>

          {loading ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              <div className="spinner"></div>
            </div>
          ) : bookings.length === 0 ? (
            <div className="card">
              <div className="card-body" style={{ textAlign: "center", padding: "40px" }}>
                <p>No bookings available for payment</p>
              </div>
            </div>
          ) : (
            <div className="grid" style={{ gridTemplateColumns: "1fr" }}>
              {bookings.map((booking) => (
                <div key={booking.id} className="card">
                  <div className="card-body">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ marginBottom: "8px" }}>{booking.eventTitle}</h4>
                        <p style={{ color: "#666", marginBottom: "8px" }}>
                          <strong>Seat:</strong> {booking.seatNumber}
                        </p>
                        <p style={{ color: "#666", marginBottom: "8px" }}>
                          <strong>Status:</strong>{" "}
                          <span
                            style={{
                              padding: "4px 8px",
                              borderRadius: "4px",
                              backgroundColor: booking.status === "Paid" ? "#e8f5e9" : "#fff3e0",
                              color: booking.status === "Paid" ? "#2e7d32" : "#e65100",
                              fontSize: "12px",
                            }}
                          >
                            {booking.status || "Pending"}
                          </span>
                        </p>
                      </div>

                      {booking.status !== "Paid" && (
                        <button
                          className="btn btn-primary"
                          onClick={() => setSelectedBooking(booking)}
                        >
                          Pay Now
                        </button>
                      )}

                      {booking.status === "Paid" && (
                        <div
                          style={{
                            padding: "8px 12px",
                            backgroundColor: "#e8f5e9",
                            borderRadius: "4px",
                            color: "#2e7d32",
                            fontSize: "12px",
                          }}
                        >
                          ✓ Paid
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
