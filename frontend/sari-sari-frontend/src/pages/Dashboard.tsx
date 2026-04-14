import { useEffect, useState } from "react";
import axios from "axios";
import { logout } from "../api/auth";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface DashboardData {
  totalProducts: number;
  totalCategories: number;
  lowStock: number;
  salesToday: number;
}

interface Product {
  product_id: number;
  name: string;
  stock: number;
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData>({
    totalProducts: 0,
    totalCategories: 0,
    lowStock: 0,
    salesToday: 0,
  });

  const [lowStockItems, setLowStockItems] = useState<Product[]>([]);

  const API_URL = "http://localhost:3000";

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  useEffect(() => {
    axios
      .get(`${API_URL}/dashboard`)
      .then((res) => setData(res.data))
      .catch((err) => console.error(err));

    axios
      .get(`${API_URL}/products/low-stock`)
      .then((res) => setLowStockItems(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={ui.fullscreenWrapper}>
      {/* SIDEBAR */}
      <aside style={ui.sidebar}>
        <div>
          <div style={ui.logo}>Sari-sari Store</div>

          <nav style={ui.nav}>
            <a href="/dashboard" style={{ ...ui.navItem, ...ui.navActive }}>
              Dashboard
            </a>
            <a href="/categories" style={ui.navItem}>Categories</a>
            <a href="/products" style={ui.navItem}>Products</a>
            <a href="/sales" style={ui.navItem}>Sales</a>
            <a href="/sales" style={ui.navItem}>Sales</a>
            <a href="/utang" style={ui.navItem}>Utang</a>
            <a href="/expenses" style={ui.navItem}>Expenses</a>
          </nav>
        </div>

        <button style={ui.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </aside>

      {/* MAIN */}
      <main style={ui.mainContent}>
        {/* HEADER */}
        <header style={ui.header}>
          <div>
            <h1 style={ui.title}>Dashboard</h1>
            <p style={ui.subtitle}>Real-time store overview</p>
          </div>

          <div style={ui.dateDisplay}>
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </header>

        {/* CARDS */}
        <div style={ui.cardGrid}>
          <div style={{ ...ui.card, borderLeft: "5px solid #2563eb" }}>
            <h3 style={ui.cardTitle}>Total Products</h3>
            <p style={ui.cardValue}>{data.totalProducts}</p>
          </div>

          <div style={{ ...ui.card, borderLeft: "5px solid #7c3aed" }}>
            <h3 style={ui.cardTitle}>Categories</h3>
            <p style={ui.cardValue}>{data.totalCategories}</p>
          </div>

          <div style={{ ...ui.card, borderLeft: "5px solid #ef4444" }}>
            <h3 style={ui.cardTitle}>Low Stock</h3>
            <p style={{ ...ui.cardValue, color: "#ef4444" }}>
              {data.lowStock}
            </p>
          </div>

          <div style={{ ...ui.card, borderLeft: "5px solid #16a34a" }}>
            <h3 style={ui.cardTitle}>Sales Today</h3>
            <p style={{ ...ui.cardValue, color: "#16a34a" }}>
              ₱{data.salesToday.toLocaleString()}
            </p>
          </div>
        </div>

        {/* CHART SECTION */}
        <div style={ui.tableContainer}>
          <div style={ui.sectionHeader}>
            <h3 style={ui.sectionTitle}>Low Stock Analytics</h3>
          </div>

          <div style={{ width: "100%", height: 320 }}>
            <ResponsiveContainer>
              <BarChart data={lowStockItems}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="stock" fill="#ef4444" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* LOW STOCK LIST */}
        <div style={ui.tableContainer}>
          <div style={ui.sectionHeader}>
            <h3 style={ui.sectionTitle}>Low Stock Products</h3>
          </div>

          {lowStockItems.length === 0 ? (
            <div style={ui.emptyState}>
              All products are well stocked 🎉
            </div>
          ) : (
            lowStockItems.map((item) => (
              <div key={item.product_id} style={ui.row}>
                <span>{item.name}</span>
                <span style={{ color: "#ef4444", fontWeight: 700 }}>
                  {item.stock} left
                </span>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

/* ================= UI (MATCHED WITH CATEGORIES DESIGN) ================= */

const ui: { [key: string]: React.CSSProperties } = {
  fullscreenWrapper: {
    display: "flex",
    width: "100vw",
    height: "100vh",
    fontFamily: "'Inter', sans-serif",
    overflow: "hidden",
    background: "#f0f7ff",
  },

  /* SIDEBAR (same as categories) */
  sidebar: {
    width: "240px",
    background: "linear-gradient(180deg, #1e40af 0%, #1e3a8a 100%)",
    color: "white",
    padding: "30px 20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },

  logo: {
    fontSize: "22px",
    fontWeight: 800,
    marginBottom: "40px",
    textAlign: "center",
  },

  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  navItem: {
    padding: "12px 15px",
    color: "#bfdbfe",
    textDecoration: "none",
    borderRadius: "10px",
    fontSize: "14px",
  },

  navActive: {
    background: "rgba(255,255,255,0.15)",
    color: "#fff",
    fontWeight: 600,
  },

  logoutBtn: {
    padding: "12px",
    background: "#644ceb",
    color: "white",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: 600,
  },

  /* MAIN */
  mainContent: {
    flex: 1,
    padding: "40px",
    overflowY: "auto",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "30px",
  },

  title: {
    fontSize: "28px",
    color: "#1e3a8a",
    margin: 0,
    fontWeight: 800,
  },

  subtitle: {
    color: "#60a5fa",
    marginTop: "5px",
  },

  dateDisplay: {
    background: "white",
    padding: "10px 16px",
    borderRadius: "12px",
    fontWeight: 600,
    color: "#1e40af",
  },

  /* CARDS */
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "20px",
    marginBottom: "25px",
  },

  card: {
    background: "white",
    padding: "20px",
    borderRadius: "16px",
    boxShadow: "0 10px 25px rgba(30,58,138,0.05)",
  },

  cardTitle: {
    fontSize: "12px",
    color: "#64748b",
    textTransform: "uppercase",
    margin: 0,
  },

  cardValue: {
    fontSize: "26px",
    fontWeight: 800,
    marginTop: "10px",
    color: "#1e293b",
  },

  /* TABLE STYLE (same as categories) */
  tableContainer: {
    background: "white",
    borderRadius: "20px",
    boxShadow: "0 10px 25px rgba(30, 58, 138, 0.05)",
    padding: "20px",
    marginTop: "20px",
  },

  sectionHeader: {
    marginBottom: "15px",
  },

  sectionTitle: {
    fontSize: "18px",
    fontWeight: 700,
    color: "#1e3a8a",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px",
    borderBottom: "1px solid #f1f5f9",
  },

  emptyState: {
    textAlign: "center",
    padding: "30px",
    color: "#94a3b8",
  },
};