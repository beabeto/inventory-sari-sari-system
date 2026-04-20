import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { logout } from "../api/auth";

interface Product {
  product_id: number;
  name: string;
  price: number;
  stock: number;
}

const API_URL = "http://localhost:3000";

const WEEK_DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

export default function Sales() {
  const [products, setProducts] = useState<Product[]>([]);
  const [salesTotal, setSalesTotal] = useState(0); // ✅ FIXED
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [mode, setMode] =
    useState<"daily" | "weekly" | "monthly" | "yearly">("daily");

  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);

  const [phTime, setPhTime] = useState("");

  /* ================= TIME ================= */
  useEffect(() => {
    const i = setInterval(() => {
      setPhTime(
        new Date().toLocaleString("en-PH", {
          timeZone: "Asia/Manila",
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    }, 1000);

    return () => clearInterval(i);
  }, []);

  /* ================= FETCH ================= */
  const fetchProducts = async () => {
    const res = await axios.get(`${API_URL}/products`);
    setProducts(res.data || []);
  };

  const fetchSales = async () => {
  try {
    const res = await axios.get(`${API_URL}/sales/today`);

    // ✅ SAFE PARSE (handles empty, null, undefined)
    const total = Number(res.data?.[0]?.total ?? 0);

    setSalesTotal(total);
  } catch (err) {
    console.error("Failed to fetch sales:", err);
    setSalesTotal(0);
  }
};

  const fetchHistory = async () => {
    const now = new Date();
    let url = "";

    if (mode === "daily") {
      const today = now.toISOString().split("T")[0];
      url = `${API_URL}/sales/history/daily?date=${today}`;
    }

    if (mode === "weekly") {
      url = `${API_URL}/sales/history/weekly`;
    }

    if (mode === "monthly") {
      url = `${API_URL}/sales/history/monthly?year=${now.getFullYear()}`;
    }

    if (mode === "yearly") {
      url = `${API_URL}/sales/history/yearly`;
    }

    const res = await axios.get(url);
    setHistoryData(res.data || []);
  };

  useEffect(() => {
    fetchProducts();
    fetchSales();
    fetchHistory();
  }, [mode]);

  /* ================= ADD SALE ================= */
  const addSale = async () => {
    if (!selectedProductId || quantity <= 0) return;

    await axios.post(`${API_URL}/sales/today`, {
      product_id: selectedProductId,
      quantity,
    });

    setShowModal(false);
    setQuantity(1);

    fetchProducts();
    fetchSales();
    fetchHistory();
  };

  /* ================= WEEK FIX ================= */
  const normalizeWeekly = (data: any[]) => {
    const map = Array(7).fill(0);

    data.forEach((d) => {
      const index =
        typeof d.dayIndex === "number"
          ? d.dayIndex === 0
            ? 6
            : d.dayIndex - 1
          : WEEK_DAYS.indexOf(String(d.day).toUpperCase().slice(0, 3));

      if (index >= 0 && index < 7) {
        map[index] = Number(d.totalSales || d.sales || 0);
      }
    });

    return WEEK_DAYS.map((day, i) => ({
      name: day,
      sales: map[i],
    }));
  };

  /* ================= CHART DATA ================= */
  const chartData = () => {
    const months = [
      "Jan","Feb","Mar","Apr","May","Jun",
      "Jul","Aug","Sep","Oct","Nov","Dec"
    ];

    if (mode === "weekly") {
      return normalizeWeekly(historyData);
    }

    if (mode === "monthly") {
      const map = Array(12).fill(0);

      historyData.forEach((d: any) => {
        const m = Number(d.month) - 1;
        if (m >= 0 && m < 12) {
          map[m] += Number(d.totalSales || d.sales || 0);
        }
      });

      return map.map((v, i) => ({
        name: months[i],
        sales: v,
      }));
    }

    if (mode === "yearly") {
      return historyData.map((h: any) => ({
        name: `Year ${h.year}`,
        sales: Number(h.totalSales || h.sales || 0),
      }));
    }

    return historyData.map((h: any) => ({
      name: h.date,
      sales: Number(h.totalSales || h.sales || 0),
    }));
  };

  const totalSales = salesTotal; // ✅ FIXED
  const profit = totalSales * 0.3;
  const lowStock = products.filter((p) => p.stock <= 5);

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <div style={ui.wrapper}>
      <aside style={ui.sidebar}>
        <h2 style={ui.logo}>Sari-Sari Store</h2>

        <nav style={ui.nav}>
          <a href="/dashboard" style={ui.link}>Dashboard</a>
          <a href="/categories" style={ui.link}>Categories</a>
          <a href="/products" style={ui.link}>Products</a>
          <a href="/sales" style={{ ...ui.link, ...ui.active }}>Sales</a>
          <a href="/utang" style={ui.link}>Utang</a>
          <a href="/expenses" style={ui.link}>Expenses</a>
          <a href="/account" style={ui.navItem}>Account Settings</a>
        </nav>

        <button style={ui.logoutBtn} onClick={handleLogout}>Logout</button>
      </aside>

      <main style={ui.main}>
        <h1 style={ui.title}>Sales Dashboard</h1>
        <p style={ui.time}>🇵🇭 {phTime}</p>

        <div style={ui.actions}>
          {["daily", "weekly", "monthly", "yearly"].map((m) => (
            <button key={m} onClick={() => setMode(m as any)} style={ui.btn}>
              {m.toUpperCase()}
            </button>
          ))}

          <button onClick={() => setShowModal(true)} style={ui.addBtn}>
            + Add Sale
          </button>
        </div>

        <div style={ui.cards}>
          <div style={ui.card}>💰 ₱{totalSales.toFixed(2)}</div>
          <div style={ui.card}>📈 ₱{profit.toFixed(2)}</div>
          <div style={ui.card}>📦 {products.length}</div>
          <div style={ui.card}>⚠ {lowStock.length}</div>
        </div>

        <div style={ui.chart}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData()}>
              <CartesianGrid />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="sales" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {showModal && (
          <div style={ui.modalBg}>
            <div style={ui.modal}>
              <h3>Add Sale</h3>

              <select
                style={ui.input}
                onChange={(e) => setSelectedProductId(Number(e.target.value))}
              >
                <option value="">Select Product</option>
                {products.map((p) => (
                  <option key={p.product_id} value={p.product_id}>
                    {p.name} - ₱{p.price}
                  </option>
                ))}
              </select>

              <input
                style={ui.input}
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />

              <button style={ui.btn} onClick={addSale}>Save</button>
              <button style={ui.addBtn} onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}


/* ================= UI (UNCHANGED) ================= */
const ui: any = {
  wrapper: { display: "flex", width: "100vw", height: "100vh", fontFamily: "'Inter', sans-serif", overflow: "hidden", background: "#f0f7ff" },
  sidebar: { width: "240px", background: "linear-gradient(180deg, #1e40af 0%, #1e3a8a 100%)", color: "white", padding: "30px 20px", display: "flex", flexDirection: "column", justifyContent: "space-between" },
  logo: { fontSize: "22px", fontWeight: 800, textAlign: "center", marginBottom: "40px" },
  nav: { display: "flex", flexDirection: "column", gap: "8px" },
  link: { padding: "12px 15px", color: "#bfdbfe", textDecoration: "none", borderRadius: "10px" },
  active: { background: "rgba(255,255,255,0.15)", color: "#fff", fontWeight: 600 },
  logoutBtn: { marginTop: 20, padding: 10, background: "#7c3aed", color: "white" },
  main: { flex: 1, padding: 20 },
  title: { fontSize: 26, fontWeight: 800, color: "#1e3a8a" },
  time: { color: "#64748b" },
  actions: { display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 15 },
  btn: { padding: 8, background: "#2563eb", color: "white", borderRadius: 6 },
  addBtn: { padding: 8, background: "#16a34a", color: "white", borderRadius: 6 },
  cards: { display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10 },
  card: { background: "white", padding: 15, borderRadius: 10, fontWeight: 600, color: "blue" },
  chart: { height: 300, background: "white", padding: 10, borderRadius: 10, marginTop: 15 },
  modalBg: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center" },
  modal: { background: "white", padding: 20, width: 350, borderRadius: 10 },
  input: { width: "100%", padding: 10, marginBottom: 10 }
};