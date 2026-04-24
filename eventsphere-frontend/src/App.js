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
// import "./App.css";
// import "./Sidebar.css";
// import "./index.css";
function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventDetails, setEventDetails] = useState(null);
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768)
  useEffect(() => {
    if (token) {
      loadUserProfile();
      setCurrentPage("dashboard"); // ✅ redirect after login
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
    setCurrentPage("login");
    setSelectedEvent(null);
    setEventDetails(null);
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
    setSelectedEvent(null);
    setEventDetails(null);
  };

  // ⏳ Loading screen
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

  // 🔥 LOGIN PAGE (no sidebar/header)
  if (currentPage === "login") {
    return <Login setToken={setToken} />;
  }

  let pageContent;

  // ✅ Proper routing system
  if (currentPage === "eventDetails") {
    pageContent = (
      <EventDetails
        event={eventDetails}
        onBack={() => setCurrentPage("events")}
        onBook={(event) => {
          setSelectedEvent(event);
          setCurrentPage("booking");
        }}
      />
    );
  }

  else if (currentPage === "booking") {
    pageContent = (
      <Booking
        event={selectedEvent}
        onBack={() => setCurrentPage("events")}
        goToLogin={() => setCurrentPage("login")}
      />
    );
  }

  else if (currentPage === "dashboard") {
    pageContent = <Dashboard />;
  }

  else if (currentPage === "events") {
    pageContent = (
      <Events
        setEventDetails={(event) => {
          setEventDetails(event);
          setCurrentPage("eventDetails");
        }}
        setSelectedEvent={(event) => {
          setSelectedEvent(event);
          setCurrentPage("booking");
        }}
      />
    );
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

  // ✅ fallback safety
  else {
    pageContent = <Dashboard />;
  }

  return (
  <div className="flex h-screen overflow-hidden">
    
    <Sidebar
      user={user}
      onLogout={handleLogout}
      currentPage={currentPage}
      onNavigate={handleNavigate}
      isOpen={sidebarOpen}
      setIsOpen={setSidebarOpen}
    />

    <div
      className={`flex flex-col flex-1 transition-all duration-300 ${
        sidebarOpen ? "lg:ml-64" : "lg:ml-20"
      }`}
    >
      <Header
        user={user}
        onLogout={handleLogout}
        currentPage={currentPage}
        onNavigate={handleNavigate}
      />

      {/* ✅ ONLY ONE scroll container */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-100">
        {pageContent}
      </div>

      <Footer />
    </div>
  </div>
);
}
export default App;