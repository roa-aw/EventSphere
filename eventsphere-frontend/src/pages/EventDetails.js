import { useState, useEffect } from "react"
import { Calendar, MapPin, Users, ArrowLeft } from "lucide-react"
import API from "../services/api"

export default function EventDetails({ event, onBack, onBook }) {
  const [seats, setSeats] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSeats()
  }, [])

  const loadSeats = async () => {
    try {
      setLoading(true)
      const res = await API.get(`/seats/event/${event.id}`)
      setSeats(res.data || [])
    } catch {
      console.error("Failed to load seats")
    } finally {
      setLoading(false)
    }
  }

  const availableSeats = seats.filter((s) => !s.isBooked).length

  if (!event) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-400">Event not found</p>
        <button onClick={onBack} className="mt-4 underline">
          Go Back
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-4 md:p-6">

      {/* BACK */}
      <button
        onClick={onBack}
        className="text-gray-500 hover:text-black flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Events
      </button>

      {/* HERO */}
      <div className="relative h-64 md:h-80 rounded-xl overflow-hidden">
        <img
          src={event?.imageUrl || "https://picsum.photos/800/400"}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />

        <div className="absolute bottom-0 p-6 text-white">
          <h1 className="text-2xl md:text-3xl font-bold">
            {event.title}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT */}
<div className="lg:col-span-2 space-y-6">

  {/* ABOUT */}
  <div className="bg-white rounded-xl shadow-md p-6">
    <h2 className="font-semibold text-lg mb-3">
      About This Event
    </h2>

    <p className="text-gray-600">
      {event.description || "No description available"}
    </p>
  </div>

  {/* 📍 MAP (NOW IN CORRECT PLACE) */}
  {event.latitude && event.longitude && (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="font-semibold text-lg mb-3">
        Location
      </h2>

      <div className="rounded-xl overflow-hidden border">
        <iframe
          src={`https://maps.google.com/maps?q=${event.latitude},${event.longitude}&z=15&output=embed`}
          width="100%"
          height="300"
          loading="lazy"
          className="border-0"
        />
      </div>

      <a
        href={`https://www.google.com/maps?q=${event.latitude},${event.longitude}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-violet-600 hover:underline mt-3 inline-block"
      >
        Open in Google Maps →
      </a>
    </div>
  )}

</div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-6">

          <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">

            <h2 className="font-semibold text-lg mb-4">
              Event Details
            </h2>

            <div className="space-y-4 text-sm">

              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-violet-600" />
                <span>
                  {new Date(event.date).toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-indigo-600" />
                <span>Room assigned</span>
              </div>

              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-green-600" />
                <span>
                  {loading
                    ? "Loading..."
                    : `${availableSeats} seats available`}
                </span>
              </div>

            </div>

            {/* BOOK BUTTON */}
            <div className="mt-6 pt-6 border-t">
              <button
                onClick={() => onBook(event)}
                className="w-full py-2 rounded-md text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90"
              >
                Book Now
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  )
}