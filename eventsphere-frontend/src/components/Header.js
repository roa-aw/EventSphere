export default function Header({ user, onLogout, currentPage, onNavigate }) {
  return (
    <header className="header">
      <div className="header-content">
        <h1>🎭 EventSphere</h1>
        <div className="header-nav">
          {user && (
            <>
              <button
                onClick={() => onNavigate("events")}
                style={{
                  fontWeight: currentPage === "events" ? "bold" : "normal",
                }}
              >
                Events
              </button>
              <button
                onClick={() => onNavigate("bookings")}
                style={{
                  fontWeight: currentPage === "bookings" ? "bold" : "normal",
                }}
              >
                My Bookings
              </button>
              <button
                onClick={() => onNavigate("profile")}
                style={{
                  fontWeight: currentPage === "profile" ? "bold" : "normal",
                }}
              >
                Profile
              </button>
              <span style={{ marginRight: "10px" }}>Hello, {user.name}</span>
              <button onClick={onLogout} className="btn-danger" style={{ padding: "8px 16px" }}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
