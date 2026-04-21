import { useState } from "react";
import Login from "./pages/Login";
import Events from "./pages/Events";
import Booking from "./pages/Booking";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [selectedEvent, setSelectedEvent] = useState(null);

  if (!token) {
    return <Login setToken={setToken} />;
  }

  if (selectedEvent) {
    return <Booking event={selectedEvent} />;
  }

  return <Events setSelectedEvent={setSelectedEvent} />;
}

export default App;