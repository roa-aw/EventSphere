"use client"

import { useState } from "react"
import {
  LayoutDashboard,
  Calendar,
  DoorOpen,
  Ticket,
  CreditCard,
  User,
  Shield,
  LogOut,
  ChevronLeft,
  X,
} from "lucide-react"
import { cn } from "../lib/utils"
import { Link } from "react-router-dom"

export default function Sidebar({ user, currentPage, onNavigate, onLogout, isOpen, setIsOpen }) {

  const isAdmin =
    user?.role === "Admin" || user?.role === "admin"

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "events", label: "Events", icon: Calendar },
    { id: "rooms", label: "Rooms", icon: DoorOpen },
    { id: "bookings", label: "My Bookings", icon: Ticket }, 
    { id: "payments", label: "Payments", icon: CreditCard },
    { id: "profile", label: "Profile", icon: User },
  ]

  return (
    <>
      {/* MOBILE OVERLAY */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full bg-gradient-to-b from-slate-900 via-violet-950 to-indigo-950 border-r border-violet-800/30 flex flex-col transition-all duration-300",
          isOpen ? "w-64" : "w-0 lg:w-20",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* HEADER */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-violet-800/30">
          {isOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg text-white">
                EventSphere
              </span>
            </div>
          )}

          {/* DESKTOP TOGGLE */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-lg hover:bg-white/10 text-violet-200 hidden lg:block"
          >
            <ChevronLeft
              className={cn("w-5 h-5", !isOpen && "rotate-180")}
            />
          </button>

          {/* MOBILE CLOSE */}
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg hover:bg-white/10 text-violet-200 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* NAV */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPage === item.id

            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id)
                  if (window.innerWidth < 768) setIsOpen(false)
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
                  isActive
                    ? "bg-white/15 text-white border border-violet-400/30"
                    : "hover:bg-white/10 text-violet-200 hover:text-white"
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {isOpen && <span>{item.label}</span>}
              </button>
            )
          })}

          {user?.role === "EventOrganizer" && (
  <button
    onClick={() => {
      onNavigate("my-events")
      if (window.innerWidth < 768) setIsOpen(false)
    }}
    className={cn(
      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
      currentPage === "my-events"
        ? "bg-white/15 text-white border border-violet-400/30"
        : "hover:bg-white/10 text-violet-200 hover:text-white"
    )}
  >
    <Calendar className="w-5 h-5" />
    {isOpen && <span>My Events</span>}
  </button>
)}

          {/* ADMIN */}
          {isAdmin && (
            <button
              onClick={() => {
                onNavigate("admin")
                if (window.innerWidth < 768) setIsOpen(false)
              }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg",
                currentPage === "admin"
                  ? "bg-white/15 text-white border border-violet-400/30"
                  : "hover:bg-white/10 text-violet-200"
              )}
            >
              <Shield className="w-5 h-5" />
              {isOpen && <span>Admin Panel</span>}
            </button>
          )}
        </nav>


        {/* USER */}
        <div className="p-4 border-t border-violet-800/30">
          <div className={cn("flex items-center gap-3", !isOpen && "justify-center")}>
            
            {/* AVATAR FIX (you didn’t have image) */}
            <div className="w-10 h-10 rounded-full bg-violet-500 flex items-center justify-center text-white font-bold">
              {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
            </div>

            {isOpen && (
              <div>
                <p className="text-white font-medium">
                  {user?.fullName || "User"}
                </p>
                <p className="text-xs text-violet-300">
                  {isAdmin ? "Admin" : "User"}
                </p>
              </div>
            )}
          </div>

          {isOpen && (
            <button
              onClick={onLogout}
              className="w-full mt-4 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          )}
        </div>
      </aside>
    </>
  )
}