import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Events from "./pages/Events";
import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings";
import Profile from "./pages/Profile";
import Rooms from "./pages/Rooms";
import Payments from "./pages/Payments";
import AdminPanel from "./pages/AdminPanel";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Footer from "./components/Footer";
import API from "./services/api";
import "./styles/global.css";
import EventDetails from "./pages/EventDetails";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventDetails, setEventDetails] = useState(null);
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    if (token) {
      loadUserProfile();
    } else {
      setUserLoading(false);
    }
  }, [token]);

  const loadUserProfile = async () => {
    try {
      const res = await API.get("/users/profile");
      setUser(res.data);
    } catch (err) {
      console.error("Failed to load user profile:", err);
      localStorage.removeItem("token");
      setToken(null);
    } finally {
      setUserLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setCurrentPage("dashboard");
    setSelectedEvent(null);
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
    setSelectedEvent(null);
  };

  if (userLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          backgroundColor: "#f5f5f5",
        }}
      >
        <div className="spinner"></div>
      </div>
    );
  }

  let pageContent;


// Event Details page
if (eventDetails && currentPage !== "login") {
  pageContent = (
    <EventDetails
      event={eventDetails}
      onBack={() => setEventDetails(null)}
      onBook={(event) => {
        setEventDetails(null);
        setSelectedEvent(event);
      }}
    />
  );
}

// Booking page
else if (selectedEvent && currentPage !== "login") {
  pageContent = (
    <Booking
      event={selectedEvent}
      onBack={() => setSelectedEvent(null)}
      goToLogin={() => setCurrentPage("login")}
    />
  );
}
  
  // 🔥 Login page
  else if (currentPage === "login") {
    pageContent = <Login setToken={setToken} />;
  }
  else if (currentPage === "dashboard") {
    pageContent = <Dashboard />;
  }
  else if (currentPage === "events") {
    pageContent = <Events 
      setEventDetails={setEventDetails} 
      setSelectedEvent={setSelectedEvent} 
    />;
  }
  else if (currentPage === "rooms") {
    pageContent = <Rooms />;
  }
  else if (currentPage === "bookings") {
    pageContent = <MyBookings />;
  }
  else if (currentPage === "payments") {
    pageContent = <Payments />;
  }
  else if (currentPage === "profile") {
    pageContent = <Profile />;
  }
  else if (currentPage === "admin") {
    if (user?.role === "Admin" || user?.role === "admin") {
      pageContent = <AdminPanel />;
    } else {
      pageContent = (
        <div className="container">
          <div className="card">
            <div
              className="card-body"
              style={{ textAlign: "center", padding: "60px" }}
            >
              <p style={{ fontSize: "48px", marginBottom: "15px" }}>🔐</p>
              <h3>Access Denied</h3>
              <p>You don't have permission to access the admin panel.</p>
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="main-layout">
      <Sidebar
        user={user}
        onLogout={handleLogout}
        currentPage={currentPage}
        onNavigate={handleNavigate}
      />

      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Header
          user={user}
          onLogout={handleLogout}
          currentPage={currentPage}
          onNavigate={handleNavigate}
        />

        <div style={{ flex: 1, overflowY: "auto" }}>
          {pageContent}
        </div>

        <Footer />
      </main>
    </div>
  );
}

export default App;