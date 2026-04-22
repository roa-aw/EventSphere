import { useState } from "react";
import "./Sidebar.css";

export default function Sidebar({ user, currentPage, onNavigate, onLogout }) {
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 768);

  const isAdmin = user?.role === "Admin" || user?.role === "admin";

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊", accessible: true },
    { id: "events", label: "Events", icon: "🎪", accessible: true },
    { id: "rooms", label: "Rooms", icon: "🏢", accessible: true },
    { id: "bookings", label: "My Bookings", icon: "🎫", accessible: true },
    { id: "payments", label: "Payments", icon: "💳", accessible: true },
    { id: "profile", label: "Profile", icon: "👤", accessible: true },
    ...(isAdmin
      ? [
          { id: "admin", label: "Admin Panel", icon: "⚙️", accessible: true },
        ]
      : []),
  ];

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="sidebar-toggle"
        onClick={() => setIsOpen(!isOpen)}
        title="Toggle Sidebar"
      >
        ☰
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <h1 className="sidebar-brand">🎭 EventSphere</h1>
          <button
            className="sidebar-close"
            onClick={() => setIsOpen(false)}
            title="Close Sidebar"
          >
            ✕
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${currentPage === item.id ? "active" : ""}`}
              onClick={() => {
  onNavigate(item.id);

  if (window.innerWidth < 768) {
    setIsOpen(false);
  }
}}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="user-details">
              <p className="user-name">{user?.fullName || "User"}</p>
              <p className="user-role">
                {isAdmin ? "Admin" : "User"}
              </p>
            </div>
          </div>
          {user ? (
  <button className="logout-btn" onClick={onLogout}>
    Logout
  </button>
) : (
  <button className="logout-btn" onClick={() => onNavigate("login")}>
    Login
  </button>
)}
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />
      )}
    </>
  );
}
