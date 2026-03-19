import { useEffect, useState } from "react";
import axios from "axios";
import { logout } from "../api/auth";

export default function Dashboard() {
  const [data, setData] = useState({
    totalProducts: 0,
    lowStock: 0,
    salesToday: 0,
  });

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  useEffect(() => {
    axios
      .get("http://localhost:3000/dashboard")
      .then((res) => setData(res.data))
      .catch((err) => console.error("Dashboard fetch error:", err));
  }, []);

  return (
    <div style={ui.fullscreenWrapper}>
      {/* Sidebar */}
      <aside style={ui.sidebar}>
        <div>
          <div style={ui.logo}>Sari-sari Store</div>
          <nav style={ui.nav}>
            <a href="/dashboard" style={{...ui.navItem, ...ui.navActive}}>Dashboard</a>
            <a href="/categories" style={ui.navItem}>Categories</a>
            <a href="/products" style={ui.navItem}>Products</a>
            <a href="/sales" style={ui.navItem}>Sales</a>
            <a href="/utang" style={ui.navItem}>Utang</a>
            <a href="/expenses" style={ui.navItem}>Expenses</a>
          </nav>
        </div>
        <button style={ui.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main style={ui.mainContent}>
        <header style={ui.header}>
          <div>
            <h1 style={ui.title}>Dashboard</h1>
            <p style={ui.subtitle}>Welcome back to Sari-Sari Inventory System</p>
          </div>
          <div style={ui.dateDisplay}>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
        </header>

        {/* Stats Cards */}
        <div style={ui.cardGrid}>
          <div style={ui.card}>
            <div style={ui.cardIcon}>📦</div>
            <div>
              <h3 style={ui.cardLabel}>Total Products</h3>
              <p style={ui.cardValue}>{data.totalProducts.toLocaleString()}</p>
            </div>
          </div>

          <div style={{...ui.card, borderLeft: '5px solid #ef4444'}}>
            <div style={{...ui.cardIcon, color: '#ef4444', background: '#fef2f2'}}>⚠️</div>
            <div>
              <h3 style={ui.cardLabel}>Low Stock</h3>
              <p style={{...ui.cardValue, color: '#dc2626'}}>{data.lowStock}</p>
            </div>
          </div>

          <div style={{...ui.card, borderLeft: '5px solid #22c55e'}}>
            <div style={{...ui.cardIcon, color: '#22c55e', background: '#f0fdf4'}}>₱</div>
            <div>
              <h3 style={ui.cardLabel}>Sales Today</h3>
              <p style={{...ui.cardValue, color: '#15803d'}}>₱{data.salesToday.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Placeholder for future charts or recent activity */}
        <div style={ui.placeholderSection}>
          <h3 style={{color: '#1e3a8a', marginBottom: '15px'}}>Quick Overview</h3>
          <div style={ui.chartPlaceholder}>
            Recent activity and performance charts will appear here.
          </div>
        </div>
      </main>
    </div>
  );
}

// --- Professional Blue UI Theme ---
const ui: { [key: string]: React.CSSProperties } = {
  fullscreenWrapper: {
    display: "flex",
    width: "100vw",
    height: "100vh",
    overflow: "hidden",
    fontFamily: "'Inter', 'Segoe UI', sans-serif",
    backgroundColor: "#f0f7ff",
  },
  sidebar: {
    width: "260px",
    background: "linear-gradient(180deg, #1e40af 0%, #1e3a8a 100%)",
    color: "white",
    padding: "32px 20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    flexShrink: 0,
  },
  logo: {
    fontSize: "24px",
    fontWeight: 800,
    marginBottom: "40px",
    textAlign: "center",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    paddingBottom: "20px"
  },
  nav: { display: "flex", flexDirection: "column", gap: "6px" },
  navItem: {
    padding: "12px 16px",
    color: "#bfdbfe",
    textDecoration: "none",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: 500,
    transition: "0.2s",
  },
  navActive: {
    background: "rgba(255,255,255,0.15)",
    color: "#fff",
  },
  logoutBtn: {
    padding: "12px",
    background: "rgba(100, 76, 235, 1)",
    color: "white",
    border: "1px solid rgba(239, 68, 68, 0.2)",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: 600,
    transition: "0.2s",
  },
  mainContent: {
    flex: 1,
    padding: "40px 50px",
    overflowY: "auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "40px",
  },
  title: { fontSize: "32px", margin: 0, fontWeight: 800, color: "#1e3a8a" },
  subtitle: { color: "#60a5fa", margin: "5px 0 0 0" },
  dateDisplay: {
    background: "white",
    padding: "10px 18px",
    borderRadius: "12px",
    fontSize: "14px",
    color: "#1e40af",
    fontWeight: 600,
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "24px",
    marginBottom: "40px",
  },
  card: {
    background: "white",
    padding: "24px",
    borderRadius: "20px",
    boxShadow: "0 10px 25px -5px rgba(30, 58, 138, 0.08)",
    display: "flex",
    alignItems: "center",
    gap: "20px",
    borderLeft: "5px solid #2563eb",
  },
  cardIcon: {
    width: "56px",
    height: "56px",
    background: "#eff6ff",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    color: "#2563eb",
  },
  cardLabel: {
    fontSize: "14px",
    color: "#64748b",
    margin: 0,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    fontWeight: 700
  },
  cardValue: {
    fontSize: "28px",
    fontWeight: 800,
    margin: "4px 0 0 0",
    color: "#1e293b"
  },
  placeholderSection: {
    background: "white",
    padding: "30px",
    borderRadius: "20px",
    minHeight: "300px",
    border: "1px solid #e0f2fe",
  },
  chartPlaceholder: {
    height: "200px",
    border: "2px dashed #dbeafe",
    borderRadius: "15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#94a3b8",
    fontSize: "14px"
  }
};