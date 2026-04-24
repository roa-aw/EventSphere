"use client"

import { Menu, Calendar, Ticket, User, LogOut, Bell } from "lucide-react"
import { cn } from "../lib/utils"

export default function Header({
  user,
  onLogout,
  currentPage,
  onNavigate,
  onToggleSidebar, // optional (V0 feature)
}) {
  const navItem = (page, label, Icon) => {
    const isActive = currentPage === page

    return (
      <button
        onClick={() => onNavigate(page)}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition",
          isActive
            ? "bg-white/20 text-white"
            : "text-white/80 hover:text-white hover:bg-white/10"
        )}
      >
        <Icon className="w-4 h-4" />
        <span className="hidden sm:inline">{label}</span>
      </button>
    )
  }

  return (
    <header className="sticky top-0 z-30 h-16 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 shadow-lg">
      <div className="h-full px-4 md:px-6 flex items-center justify-between">

        {/* LEFT */}
        <div className="flex items-center gap-4">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <h1 className="text-white font-semibold hidden sm:block">
            🎭 EventSphere
          </h1>

          {user && (
            <p className="text-white/80 hidden md:block">
              Hello, <span className="text-white font-medium">{user.name}</span>
            </p>
          )}
        </div>

        {/* CENTER NAV */}
        {user && (
          <nav className="hidden md:flex items-center gap-2">
            {navItem("events", "Events", Calendar)}
            {navItem("bookings", "My Bookings", Ticket)} {/* keep your route */}
            {navItem("profile", "Profile", User)}
          </nav>
        )}

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          <button className="relative p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {user && (
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-white/80 hover:text-white hover:bg-white/10"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          )}
        </div>
      </div>
    </header>
  )
}