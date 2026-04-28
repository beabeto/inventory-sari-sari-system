import React, { useEffect, useState } from "react";
import client from "../api/client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import Sidebar from "../components/Sidebar";

interface Product {
  product_id: number;
  name: string;
  price: number;
  stock: number;
}

const WEEK_DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

export default function Sales() {
  const [products, setProducts] = useState<Product[]>([]);
  const [salesTotal, setSalesTotal] = useState(0);
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
    const res = await client.get(`/products`);
    setProducts(res.data || []);
  };

  const fetchSales = async () => {
    try {
      const res = await client.get(`/sales/today`);
      const total = Number(res.data?.[0]?.total ?? 0);
      setSalesTotal(total);
    } catch {
      setSalesTotal(0);
    }
  };

  const fetchHistory = async () => {
    let url = "";

    if (mode === "daily") {
      const today = new Date().toISOString().split("T")[0];
      url = `/sales/history/daily?date=${today}`;
    }

    if (mode === "weekly") {
      url = `/sales/history/weekly`;
    }

    if (mode === "monthly") {
      url = `/sales/history/monthly?year=${new Date().getFullYear()}`;
    }

    if (mode === "yearly") {
      url = `/sales/history/yearly`;
    }

    const res = await client.get(url);
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

    await client.post(`/sales/today`, {
      product_id: selectedProductId,
      quantity,
    });

    setShowModal(false);
    setQuantity(1);
    setSelectedProductId(null);

    fetchProducts();
    fetchSales();
    fetchHistory();
  };

  /* ================= CHART DATA ================= */
  const chartData = () => {
    if (mode === "weekly") {
      return historyData.map((d: any) => ({
        name: d.day,
        sales: Number(d.totalSales || 0),
      }));
    }

    if (mode === "monthly") {
      return historyData.map((d: any) => ({
        name: `Month ${d.month}`,
        sales: Number(d.totalSales || 0),
      }));
    }

    if (mode === "yearly") {
      return historyData.map((d: any) => ({
        name: `Year ${d.year}`,
        sales: Number(d.totalSales || 0),
      }));
    }

    return historyData.map((d: any) => ({
      name: d.date,
      sales: Number(d.totalSales || 0),
    }));
  };

  const totalSales = salesTotal;
  const profit = totalSales * 0.3;
  const lowStock = products.filter((p) => p.stock <= 5);

  return (
    <div style={ui.wrapper}>
      <Sidebar activePage="sales" />

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
              <h3 style={ui.title}>Add Sale</h3>

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

/* ================= UI ================= */
const ui: any = {
  wrapper: {
    display: "flex",
    width: "100vw",
    height: "100vh",
    fontFamily: "'Inter', sans-serif",
    overflow: "hidden",
    background: "#f0f7ff",
  },
  main: { flex: 1, padding: 20 },
  title: { fontSize: 26, fontWeight: 800, color: "#1e3a8a" },
  time: { color: "#64748b" },
  actions: { display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 15 },
  btn: {
    background: "#16a34a",
    color: "white",
    border: "none",
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
    flex: 1,
  },
  addBtn: {
    background: "#d1d5db",
    color: "black",
    border: "none",
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
    flex: 1,
  },
  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(4,1fr)",
    gap: 10,
  },
  card: {
    background: "white",
    padding: 15,
    borderRadius: 10,
    fontWeight: 600,
    color: "blue",
  },
  chart: {
    height: 300,
    background: "white",
    padding: 10,
    borderRadius: 10,
    marginTop: 15,
  },
  modalBg: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    background: "white",
    padding: "25px",
    borderRadius: "15px",
    width: "400px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  input: {
    padding: "12px 15px",
    borderRadius: "10px",
    border: "1px solid #dbeafe",
    fontSize: "14px",
    color: "black",
    backgroundColor: "white",
  },
};