"use client"

import { Calendar, MapPin } from "lucide-react"
import { cn } from "../lib/utils"

const categoryColors = {
  AI: "bg-blue-100 text-blue-700 border-blue-200",
  Blockchain: "bg-amber-100 text-amber-700 border-amber-200",
  Cybersecurity: "bg-red-100 text-red-700 border-red-200",
  "Web Development": "bg-green-100 text-green-700 border-green-200",
  "Data Science": "bg-purple-100 text-purple-700 border-purple-200",
  "Cloud Computing": "bg-cyan-100 text-cyan-700 border-cyan-200",
  DevOps: "bg-orange-100 text-orange-700 border-orange-200",
  Mobile: "bg-pink-100 text-pink-700 border-pink-200",
}

export default function EventCard({
  event,
  onBook,
  onViewDetails, // keep your original
  onView, // optional (V0 compatibility)
}) {
  const handleView = () => {
    if (onViewDetails) return onViewDetails(event)
    if (onView) return onView(event)
  }

  const formatDate = (dateString) => {
    if (!dateString) return "Date TBD"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const image = event?.imageUrl || event.image
  const roomText =
    event.room ||
    `${event.rooms?.length || 0} venue${event.rooms?.length !== 1 ? "s" : ""}`

  return (
    <div className="group overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
      
      {/* IMAGE */}
      <div className="relative h-48 overflow-hidden">
  {image ? (
    <img
      src={image}
      alt={event.title}
      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 bg-gray-100"
      onError={(e) => {
  e.currentTarget.onerror = null // prevent infinite loop
  e.currentTarget.src = "https://picsum.photos/600/300"
    
}}
    />
  ) : (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-sm">
  No Image
</div>
  )}

  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />


        {event.category && (
          <span
            className={cn(
              "absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium border",
              categoryColors[event.category] ||
                "bg-gray-100 text-gray-700 border-gray-200"
            )}
          >
            {event.category}
          </span>
        )}
      </div>
  

      {/* CONTENT */}
      <div className="p-5">
        <h3 className="font-semibold text-lg mb-2 line-clamp-1 group-hover:text-violet-600 transition-colors">
          {event.title}
        </h3>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {event.description || "No description available"}
        </p>

        {/* DATE + ROOM */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-violet-500" />
            <span>{formatDate(event.date)}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-violet-500" />
            <span>{roomText}</span>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex gap-2">
          <button
            onClick={handleView}
            className="flex-1 border border-violet-200 text-violet-600 rounded-md px-3 py-2 text-sm hover:bg-violet-50"
          >
            View Details
          </button>

          <button
            onClick={() => onBook(event)}
            className="flex-1 rounded-md px-3 py-2 text-sm text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:opacity-90"
          >
            Book
          </button>
        </div>
      </div>
    </div>
  )
}
