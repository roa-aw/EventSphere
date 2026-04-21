import { useState } from "react";
import Login from "./pages/Login";
import Events from "./pages/Events";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  return (
    <div>
      {!token ? (
        <Login setToken={setToken} />
      ) : (
        <Events token={token} />
      )}
    </div>
  );
}

export default App;
