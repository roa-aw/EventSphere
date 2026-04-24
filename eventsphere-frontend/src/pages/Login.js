import { useState } from "react"
import { Calendar, Mail, Lock } from "lucide-react"
import { GoogleLogin } from "@react-oauth/google"
import axios from "axios"
import API from "../services/api"
import Alert from "../components/Alert"

export default function Login({ setToken }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState(null)

  const handleLogin = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      setAlert({ type: "error", message: "Please fill in all fields" })
      return
    }

    try {
      setLoading(true)
      const res = await API.post("/auth/login", { email, password })

      const token = res.data.token
      localStorage.setItem("token", token)
      setToken(token)
      window.location.reload()
    } catch (err) {
      setAlert({
        type: "error",
        message:
          err.response?.data?.message ||
          "Login failed. Please check your credentials.",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async () => {
    if (!email || !password) {
      setAlert({ type: "error", message: "Please fill in all fields" })
      return
    }

    try {
      setLoading(true)
      const res = await API.post("/auth/register", {
        email,
        password,
        name: email.split("@")[0],
      })

      const token = res.data.token
      localStorage.setItem("token", token)
      setToken(token)
      window.location.reload()
    } catch (err) {
      setAlert({
        type: "error",
        message:
          err.response?.data?.message ||
          "Registration failed. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-white to-indigo-50 p-4">

      <div className="w-full max-w-md">

        {/* LOGO */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg">
            <Calendar className="w-8 h-8 text-white" />
          </div>

          <h1 className="text-3xl font-bold mt-4 bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            EventSphere
          </h1>

          <p className="text-gray-500 mt-2">
            Sign in or create an account
          </p>
        </div>

        {/* CARD */}
        <div className="bg-white rounded-xl shadow-xl p-6 space-y-4">

          {alert && (
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert(null)}
            />
          )}

          <form onSubmit={handleLogin} className="space-y-4">

            {/* EMAIL */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full pl-10 pr-3 py-2 border rounded-md"
                disabled={loading}
              />
            </div>

            {/* PASSWORD */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-10 pr-3 py-2 border rounded-md"
                disabled={loading}
              />
            </div>

            {/* LOGIN */}
            <button
              type="submit"
              className="w-full py-2 rounded-md text-white bg-gradient-to-r from-violet-600 to-indigo-600"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Login"}
            </button>

            {/* SIGNUP */}
            <button
              type="button"
              onClick={handleSignup}
              className="w-full py-2 rounded-md border"
              disabled={loading}
            >
              Sign Up
            </button>

          </form>

          {/* GOOGLE */}
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-2">Or continue with</p>

            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                try {
                  const res = await axios.post(
                    "http://localhost:5036/api/auth/google",
                    { token: credentialResponse.credential }
                  )

                  localStorage.setItem("token", res.data.token)
                  setToken(res.data.token)

                  setAlert({
                    type: "success",
                    message: "Login successful",
                  })

                  setTimeout(() => {
                    window.location.reload()
                  }, 1000)
                } catch {
                  setAlert({
                    type: "error",
                    message: "Google login failed",
                  })
                }
              }}
              onError={() =>
                setAlert({
                  type: "error",
                  message: "Google login failed",
                })
              }
            />
          </div>

        </div>
      </div>
    </div>
  )
}