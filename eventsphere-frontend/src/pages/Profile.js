import { useEffect, useState } from "react";
import API from "../services/api";
import Alert from "../components/Alert";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const res = await API.get("/users/profile");
      if (!localStorage.getItem("token")) {
  setLoading(false);
  return;
}
      setUser(res.data);
      setFormData(res.data);
      setIsAdmin(res.data?.role === "Admin" || res.data?.role === "admin");
    } catch (err) {
      setAlert({
        type: "error",
        message: "Failed to load profile",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/users/${user.id}`, formData);
      setUser(formData);
      setEditing(false);
      setAlert({
        type: "success",
        message: "Profile updated successfully",
      });
    } catch (err) {
      setAlert({
        type: "error",
        message: err.response?.data?.message || "Failed to update profile",
      });
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ textAlign: "center", padding: "40px" }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>👤 User Profile</h2>

      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      <div className="grid" style={{ gridTemplateColumns: "300px 1fr", gap: "30px" }}>
        {/* Profile Card */}
        <div className="card">
          <div className="card-body" style={{ textAlign: "center" }}>
            <div
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: "48px",
                margin: "0 auto 20px",
              }}
            >
              {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <h3 style={{ marginBottom: "5px" }}>{user?.fullName}</h3>
            <p style={{ color: "#999", marginBottom: "20px" }}>
              {isAdmin ? "🔑 Admin" : "👤 User"}
            </p>
            <p style={{ color: "#999", fontSize: "12px" }}>
              Member since{" "}
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
        </div>

        {/* Edit Form */}
        <div className="card">
          <div className="card-header">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3>Profile Information</h3>
              {!editing && (
                <button className="btn btn-primary" onClick={() => setEditing(true)}>
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          <div className="card-body">
            {!editing ? (
              <div>
                <div style={{ marginBottom: "20px" }}>
                  <label style={{ color: "#999", fontSize: "12px" }}>
                    FULL NAME
                  </label>
                  <p style={{ margin: "8px 0 0 0", fontSize: "16px" }}>
                    {user?.fullName}
                  </p>
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label style={{ color: "#999", fontSize: "12px" }}>
                    EMAIL
                  </label>
                  <p style={{ margin: "8px 0 0 0", fontSize: "16px" }}>
                    {user?.email}
                  </p>
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label style={{ color: "#999", fontSize: "12px" }}>
                    ROLE
                  </label>
                  <p style={{ margin: "8px 0 0 0", fontSize: "16px" }}>
                    {user?.role || "User"}
                  </p>
                </div>

                {isAdmin && (
                  <div
                    style={{
                      marginTop: "20px",
                      padding: "15px",
                      backgroundColor: "#f0f0ff",
                      borderRadius: "4px",
                      borderLeft: "4px solid #667eea",
                    }}
                  >
                    <p style={{ margin: 0, color: "#667eea", fontWeight: "500" }}>
                      ✓ You have admin access
                    </p>
                    <p style={{ margin: "5px 0 0 0", fontSize: "12px", color: "#999" }}>
                      You can manage events, rooms, and users from the Admin Panel
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleUpdate}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={formData.fullName || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setEditing(false);
                      setFormData(user);
                    }}
                    style={{ flex: 1 }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
