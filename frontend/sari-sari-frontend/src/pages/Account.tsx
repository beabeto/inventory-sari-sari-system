import { useState } from "react";
import axios from "axios";
import { logout, getToken } from "../api/auth";

export default function Account() {
  const API_URL = "http://localhost:3000";

  const [username, setUsername] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [message, setMessage] = useState("");

  /* ================= UPDATE USERNAME ================= */
  const handleUpdateProfile = async (e: any) => {
    e.preventDefault();

    try {
      const res = await axios.put(
        `${API_URL}/users/update-profile`,
        { username },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      setMessage(res.data?.message || "Profile updated successfully ✅");
      setUsername("");
    } catch (err: any) {
      console.error(err.response?.data || err.message);
      setMessage(err.response?.data?.message || "Profile update failed ❌");
    }
  };

  /* ================= CHANGE PASSWORD ================= */
  const handleChangePassword = async (e: any) => {
    e.preventDefault();

    try {
      const res = await axios.put(
        `${API_URL}/users/change-password`,
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      setMessage(res.data?.message || "Password changed successfully ✅");

      setCurrentPassword("");
      setNewPassword("");
    } catch (err: any) {
      console.error(err.response?.data || err.message);
      setMessage(err.response?.data?.message || "Password change failed ❌");
    }
  };

  return (
    <div style={ui.wrapper}>
      {/* SIDEBAR */}
      <aside style={ui.sidebar}>
        <div>
          <div style={ui.logo}>Sari-sari Store</div>

          <nav style={ui.nav}>
            <a href="/dashboard" style={ui.navItem}>Dashboard</a>
            <a href="/categories" style={ui.navItem}>Categories</a>
            <a href="/products" style={ui.navItem}>Products</a>
            <a href="/sales" style={ui.navItem}>Sales</a>
            <a href="/utang" style={ui.navItem}>Utang</a>
            <a href="/expenses" style={ui.navItem}>Expenses</a>
            <a href="/account" style={{ ...ui.navItem, ...ui.active }}>
              Account Settings
            </a>
          </nav>
        </div>

        <button style={ui.logoutBtn} onClick={logout}>
          Logout
        </button>
      </aside>

      {/* MAIN */}
      <main style={ui.main}>
        <header style={ui.header}>
          <h1 style={ui.title}>Account Settings</h1>
          <p style={ui.subtitle}>Manage your profile and security</p>
        </header>

        {/* GRID CONTAINER */}
        <div style={ui.grid}>

          {/* UPDATE USERNAME */}
          <div style={ui.card}>
            <h3 style={ui.cardTitle}>Update Username</h3>

            <form onSubmit={handleUpdateProfile} style={ui.form}>
              <input
                placeholder="Enter new username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={ui.input}
              />

              <button type="submit" style={ui.button}>
                Update Username
              </button>
            </form>
          </div>

          {/* CHANGE PASSWORD */}
          <div style={ui.card}>
            <h3 style={ui.cardTitle}>Change Password</h3>

            <form onSubmit={handleChangePassword} style={ui.form}>
              <input
                type="password"
                placeholder="Current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                style={ui.input}
              />

              <input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={ui.input}
              />

              <button type="submit" style={ui.button}>
                Change Password
              </button>
            </form>
          </div>

        </div>

        {message && <div style={ui.message}>{message}</div>}
      </main>
    </div>
  );
}

/* ================= STYLES ================= */
const ui: any = {
  wrapper: {
    display: "flex",
    width: "100vw",
    height: "100vh",
    fontFamily: "Arial, sans-serif",
    background: "#f4f7ff",
  },

  /* SIDEBAR */
  sidebar: {
    width: "240px",
    background: "linear-gradient(180deg, #1e40af, #1e3a8a)",
    color: "white",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "25px",
  },

  logo: {
    fontSize: "22px",
    fontWeight: "bold",
    marginBottom: "30px",
    textAlign: "center",
  },

  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  navItem: {
    padding: "10px",
    color: "#c7d2fe",
    textDecoration: "none",
    borderRadius: "8px",
  },

  active: {
    background: "rgba(255,255,255,0.15)",
    color: "white",
  },

  logoutBtn: {
    padding: "12px",
    background: "#644ceb",
    color: "white",
    borderRadius: "10px",
    border: "none",
  },

  /* MAIN */
  main: {
    flex: 1,
    padding: "40px",
  },

  header: {
    marginBottom: "30px",
  },

  title: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#1e3a8a",
  },

  subtitle: {
    color: "#64748b",
  },

  /* GRID */
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "25px",
    maxWidth: "900px",
  },

  /* CARD */
  card: {
    background: "white",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
  },

  cardTitle: {
    marginBottom: "15px",
    color: "#1e3a8a",
    fontSize: "18px",
    fontWeight: "bold",
  },

  /* FORM */
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
  },

  button: {
    padding: "10px",
    background: "#1e40af",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  /* MESSAGE */
  message: {
    marginTop: "20px",
    padding: "12px",
    background: "#e0f2fe",
    color: "#0369a1",
    borderRadius: "8px",
    maxWidth: "900px",
  },
};