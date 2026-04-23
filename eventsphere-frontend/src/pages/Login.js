import { useState } from "react";
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import API from "../services/api";
import Alert from "../components/Alert";

export default function Login({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setAlert({
        type: "error",
        message: "Please fill in all fields",
      });
      return;
    }

    try {
      setLoading(true);
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      const token = res.data.token;
      localStorage.setItem("token", token);
      setToken(token);
      window.location.reload();
    } catch (err) {
      setAlert({
        type: "error",
        message: err.response?.data?.message || "Login failed. Please check your credentials.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setAlert({
        type: "error",
        message: "Please fill in all fields",
      });
      return;
    }

    try {
      setLoading(true);
      const res = await API.post("/auth/register", {
        email,
        password,
        name: email.split("@")[0],
      });

      const token = res.data.token;
      localStorage.setItem("token", token);
      setToken(token);
      window.location.reload();

    } catch (err) {
      setAlert({
        type: "error",
        message:
          err.response?.data?.message || "Registration failed. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <div className="card" style={{ maxWidth: "400px", width: "90%" }}>
        <div
          className="card-header"
          style={{ textAlign: "center", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white" }}
        >
          <h1 style={{ marginBottom: "10px" }}>🎭 EventSphere</h1>
          <p>Your Event Booking Platform</p>
        </div>

        <div className="card-body">
          {alert && (
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert(null)}
            />
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%", marginBottom: "10px" }}
              disabled={loading}
            >
              {loading ? "Loading..." : "Login"}
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              style={{ width: "100%" }}
              onClick={handleSignup}
              disabled={loading}
            >
              {loading ? "Loading..." : "Sign Up"}
            </button>
          </form>

          <div style={{ textAlign: "center", margin: "20px 0" }}>
            <p style={{ marginBottom: "10px", color: "#666" }}>Or</p>
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                try {
                  const res = await axios.post(
                    "http://localhost:5036/api/auth/google",
                    {
                      token: credentialResponse.credential
                    }
                  );

                  localStorage.setItem("token", res.data.token);
                  setToken(res.data.token);

                  setAlert({
                    type: "success",
                    message: "Login successful"
                  });

                  setTimeout(() => {
                    window.location.reload();
                  }, 1000);
                } catch (err) {
                  console.error(err);
                  setAlert({
                    type: "error",
                    message: "Google login failed"
                  });
                }
              }}
              onError={() => {
                setAlert({
                  type: "error",
                  message: "Google login failed"
                });
              }}
            />
          </div>

          <p style={{ textAlign: "center", marginTop: "20px", fontSize: "12px", color: "#999" }}>
            Demo: Use any email and password to sign up
          </p>
        </div>
      </div>
    </div>
  );
}