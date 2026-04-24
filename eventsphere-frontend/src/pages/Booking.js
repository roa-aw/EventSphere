import { useState, useCallback, useEffect } from "react";
import API from "../services/api";
import Alert from "../components/Alert";

export default function Booking({ event, onBack, goToLogin }) {
  
  const [seats, setSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  const loadSeats = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get(`/seats/event/${event.id}`);
      setSeats(res.data || []);
    } catch (err) {
      setAlert({
        type: "error",
        message: "Failed to load seats",
      });
    } finally {
      setLoading(false);
    }
  }, [event.id]);

  useEffect(() => {
    loadSeats();
  }, [loadSeats]);

  const handleBook = async (seatId) => {
    // 🔒 Check login BEFORE booking
    if (!localStorage.getItem("token")) {
      setAlert({
        type: "error",
        message: "Please login to book a seat",
      });

      // Redirect to login after a short delay
      setTimeout(() => {
        goToLogin();
      }, 1000);
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">

      {/* BACK */}
      <button
        onClick={onBack}
        className="text-gray-500 hover:text-black flex items-center gap-2"
      >
        ← Back to Events
      </button>

      {/* ALERT */}
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT: SEATS */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6 space-y-6">

          <div className="text-center">
            <h3 className="font-semibold text-lg">Select Your Seat</h3>
            <p className="text-sm text-gray-500">{event.title}</p>
          </div>

          {/* SCREEN */}
          <div className="text-center">
            <div className="w-3/4 h-2 mx-auto bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full" />
            <p className="text-sm text-gray-400 mt-2">Stage / Screen</p>
          </div>

          {/* GRID */}
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
            </div>
          ) : seats.length === 0 ? (
            <p className="text-center text-gray-400">
              No seats available
            </p>
          ) : (
            <div className="grid grid-cols-6 gap-2 justify-center">
              {seats.map((seat) => {
                const isBooked = seat.isBooked
                const isSelected = selectedSeat?.id === seat.id

                return (
                  <button
                    key={seat.id}
                    onClick={() => !isBooked && setSelectedSeat(seat)}
                    disabled={isBooked}
                    className={`
                      w-10 h-10 rounded-md text-sm font-medium
                      ${isBooked
                        ? "bg-red-400 text-white cursor-not-allowed"
                        : isSelected
                        ? "bg-orange-400 text-white"
                        : "bg-green-200 hover:bg-green-300"
                      }
                    `}
                  >
                    {seat.seatNumber}
                  </button>
                )
              })}
            </div>
          )}

          {/* LEGEND */}
          <div className="flex justify-center gap-6 pt-4 border-t text-sm text-gray-500">
            <span>🟢 Available</span>
            <span>🔴 Booked</span>
            <span>🟠 Selected</span>
          </div>
        </div>

        {/* RIGHT: SUMMARY */}
        <div className="bg-white rounded-xl shadow-md p-6 space-y-4 h-fit sticky top-24">

          <h3 className="font-semibold text-lg">Booking Summary</h3>

          <div>
            <p className="text-sm text-gray-500">Event</p>
            <p className="font-medium">{event.title}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Selected Seat</p>
            {selectedSeat ? (
              <span className="inline-block px-2 py-1 bg-orange-100 text-orange-700 rounded text-sm">
                {selectedSeat.seatNumber}
              </span>
            ) : (
              <p className="text-gray-400 text-sm">
                No seat selected
              </p>
            )}
          </div>

          <div className="pt-4 border-t">
            <button
              onClick={() => handleBook(selectedSeat?.id)}
              disabled={!selectedSeat}
              className="w-full py-2 rounded-md text-white bg-gradient-to-r from-violet-600 to-indigo-600 disabled:opacity-50"
            >
              Confirm Booking
            </button>

            {!selectedSeat && (
              <p className="text-xs text-gray-400 text-center mt-2">
                Select a seat to continue
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}