import { useEffect, useState } from "react";
import axios from "axios";
import { logout } from "../api/auth";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

/* ================= INTERFACES ================= */
interface DashboardData {
  totalProducts: number;
  totalCategories: number;
  lowStock: number;
  salesToday: number;
  totalUtang: number;
  expensesToday?: number;
  profitToday?: number;
}

interface Product {
  product_id: number;
  name: string;
  stock: number;
}

interface Sale {
  sale_id: number;
  sale_date?: string;
  quantity?: number;
  price?: number;
  total?: number;
}

type ChartMode = "today" | "weekly" | "monthly";

export default function Dashboard() {
  const API_URL = "http://localhost:3000";

  const [data, setData] = useState<DashboardData>({
    totalProducts: 0,
    totalCategories: 0,
    lowStock: 0,
    salesToday: 0,
    totalUtang: 0,
    expensesToday: 0,
    profitToday: 0,
  });

  const [lowStockItems, setLowStockItems] = useState<Product[]>([]);
  const [recentSales, setRecentSales] = useState<Sale[]>([]);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [chartMode, setChartMode] = useState<ChartMode>("today");

  const num = (v: any) => (isNaN(Number(v)) ? 0 : Number(v));

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [dashRes, stockRes, recentRes, weeklyRes, monthlyRes] =
          await Promise.all([
            axios.get(`${API_URL}/dashboard`),
            axios.get(`${API_URL}/products/low-stock`),
            axios.get(`${API_URL}/dashboard/recent-today`),
            axios.get(`${API_URL}/dashboard/weekly`),
            axios.get(`${API_URL}/dashboard/monthly`),
          ]);

        setData({
          ...dashRes.data,
          salesToday: num(dashRes.data.salesToday),
          expensesToday: num(dashRes.data.expensesToday),
          profitToday: num(dashRes.data.profitToday),
        });

        setLowStockItems(stockRes.data || []);
        setRecentSales(Array.isArray(recentRes.data) ? recentRes.data : []);
        setWeeklyData(weeklyRes.data || []);
        setMonthlyData(monthlyRes.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAll();
    const interval = setInterval(fetchAll, 8000);
    return () => clearInterval(interval);
  }, []);

  /* ================= FORMAT ================= */
  const formatDate = (date: any) => {
    if (!date) return "-";
    const d = new Date(date);
    return isNaN(d.getTime()) ? "-" : d.toLocaleString();
  };

  const getSaleTotal = (s: Sale) => {
    return num(s.total) || num(s.quantity) * num(s.price);
  };

  /* ================= CHART DATA FIX ================= */
  const chartData = () => {
    const sales = num(data.salesToday);
    const expenses = num(data.expensesToday);
    const profit = num(data.profitToday);

    if (chartMode === "today") {
      return [
        {
          name: "Today",
          sales,
          expenses,
          profit,
        },
      ];
    }

    if (chartMode === "weekly") {
      return weeklyData.map((d: any) => ({
        name: d.day,
        sales: num(d.totalSales),
        expenses: 0,
        profit: num(d.totalSales),
      }));
    }

    if (chartMode === "monthly") {
      const months = [
        "Jan","Feb","Mar","Apr","May","Jun",
        "Jul","Aug","Sep","Oct","Nov","Dec"
      ];

      return monthlyData.map((d: any) => ({
        name: months[(num(d.month) || 1) - 1],
        sales: num(d.totalSales),
        expenses: 0,
        profit: num(d.totalSales),
      }));
    }

    return [];
  };

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
            <a href="/utang" style={ui.navItem}>Utang</a>
            <a href="/expenses" style={ui.navItem}>Expenses</a>
          </nav>
        </div>

        <button style={ui.logoutBtn} onClick={logout}>
          Logout
        </button>
      </aside>

      {/* MAIN */}
      <main style={ui.mainContent}>
        <header style={ui.header}>
          <div>
            <h1 style={ui.title}>Dashboard</h1>
            <p style={ui.subtitle}>Real-time store overview</p>
          </div>

          <div style={ui.dateDisplay}>
            {new Date().toLocaleDateString()}
          </div>
        </header>

        {/* CARDS */}
        <div style={ui.cardGrid}>
          <div style={{ ...ui.card, borderLeft: "5px solid #2563eb" }}>
            <h3 style={ui.cardTitle}>Total Products</h3>
            <p style={ui.cardValue}>{num(data.totalProducts)}</p>
          </div>

          <div style={{ ...ui.card, borderLeft: "5px solid #7c3aed" }}>
            <h3 style={ui.cardTitle}>Categories</h3>
            <p style={ui.cardValue}>{num(data.totalCategories)}</p>
          </div>

          <div style={{ ...ui.card, borderLeft: "5px solid #ef4444" }}>
            <h3 style={ui.cardTitle}>Low Stock</h3>
            <p style={ui.cardValue}>{num(data.lowStock)}</p>
          </div>

          <div style={{ ...ui.card, borderLeft: "5px solid #16a34a" }}>
            <h3 style={ui.cardTitle}>Sales Today</h3>
            <p style={ui.cardValue}>₱{num(data.salesToday).toLocaleString()}</p>
          </div>

          <div style={{ ...ui.card, borderLeft: "5px solid #f59e0b" }}>
            <h3 style={ui.cardTitle}>Expenses Today</h3>
            <p style={ui.cardValue}>₱{num(data.expensesToday).toLocaleString()}</p>
          </div>

          <div style={{ ...ui.card, borderLeft: "5px solid #10b981" }}>
            <h3 style={ui.cardTitle}>Profit</h3>
            <p style={ui.cardValue}>₱{num(data.profitToday).toLocaleString()}</p>
          </div>
        </div>

        {/* CHART (LINE - COLORFUL) */}
        <div style={ui.tableContainer}>
          <div style={ui.chartHeader}>
            <h3 style={ui.sectionTitle}>Sales Analytics</h3>

            <div style={ui.toggle}>
              {["today", "weekly", "monthly"].map((m) => (
                <button
                  key={m}
                  onClick={() => setChartMode(m as ChartMode)}
                  style={{
                    ...ui.toggleBtn,
                    background: chartMode === m ? "#1e3a8a" : "#e5e7eb",
                    color: chartMode === m ? "#fff" : "#000",
                  }}
                >
                  {m.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div style={{ width: "100%", height: 320 }}>
            <ResponsiveContainer>
              <LineChart data={chartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />

                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#22c55e"
                  strokeWidth={3}
                />

                <Line
                  type="monotone"
                  dataKey="expenses"
                  stroke="#ef4444"
                  strokeWidth={3}
                />

                <Line
                  type="monotone"
                  dataKey="profit"
                  stroke="#3b82f6"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* RECENT SALES */}
        <div style={ui.tableContainer}>
          <h3 style={ui.sectionTitle}>Recent Sales Today</h3>

          {recentSales.length === 0 ? (
            <p style={{ color: "gray" }}>No sales today</p>
          ) : (
            recentSales.map((s) => (
              <div key={s.sale_id} style={ui.row}>
                <span>{formatDate(s.sale_date)}</span>
                <span style={{ color: "#16a34a", fontWeight: 700 }}>
                  ₱{getSaleTotal(s).toLocaleString()}
                </span>
              </div>
            ))
          )}
        </div>

        {/* LOW STOCK */}
        <div style={ui.tableContainer}>
          <h3 style={ui.sectionTitle}>Low Stock Products</h3>

          {lowStockItems.map((item) => (
            <div
              key={item.product_id}
              style={{
                ...ui.row,
                background: item.stock <= 5 ? "#fee2e2" : "transparent",
              }}
            >
              <span>{item.name}</span>
              <span style={{ color: "#ef4444", fontWeight: 700 }}>
                {item.stock} left
              </span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

/* ================= UI ================= */
const ui: any = {
  fullscreenWrapper: { display: "flex", width: "100vw", height: "100vh", fontFamily: "'Inter', sans-serif", overflow: "hidden", background: "#f0f7ff" },
  sidebar: { width: "240px", background: "linear-gradient(180deg, #1e40af 0%, #1e3a8a 100%)", color: "white", padding: "30px 20px", display: "flex", flexDirection: "column", justifyContent: "space-between" },
  logo: { fontSize: "22px", fontWeight: 800, textAlign: "center", marginBottom: "40px" },
  nav: { display: "flex", flexDirection: "column", gap: "8px" },
  navItem: { padding: "12px 15px", color: "#bfdbfe", textDecoration: "none", borderRadius: "10px" },
  navActive: { background: "rgba(255,255,255,0.15)", color: "#fff", fontWeight: 600 },
  logoutBtn: { padding: "12px", background: "#644ceb", color: "white", borderRadius: "10px", border: "none" },
  mainContent: { flex: 1, padding: "40px", overflowY: "auto" },
  header: { display: "flex", justifyContent: "space-between", marginBottom: "30px" },
  title: { fontSize: "28px", color: "#1e3a8a", fontWeight: 800 },
  subtitle: { color: "#60a5fa" },
  dateDisplay: { background: "white", padding: "10px 16px", borderRadius: "12px", fontWeight: 600, color: "#1e40af" },
  cardGrid: { display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "20px" },
  card: { background: "white", padding: "20px", borderRadius: "16px", boxShadow: "0 10px 25px rgba(30,58,138,0.05)" },
  cardTitle: { fontSize: "12px", color: "#64748b", textTransform: "uppercase" },
  cardValue: { fontSize: "26px", fontWeight: 800, marginTop: "10px", color: "blue" },
  tableContainer: { background: "white", borderRadius: "20px", padding: "20px", marginTop: "20px" },
  sectionTitle: { fontSize: "18px", fontWeight: 700, color: "#1e3a8a" },
  row: { display: "flex", justifyContent: "space-between", padding: "12px", borderBottom: "1px solid #f1f5f9", color: "blue" },
  chartHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  toggle: { display: "flex", gap: 8 },
  toggleBtn: { padding: "6px 10px", border: "none", borderRadius: 6, cursor: "pointer" },
};