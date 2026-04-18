import React, { useEffect, useState } from "react";
import axios from "axios";
import { logout } from "../api/auth";

/* ================= INTERFACE ================= */
interface Expense {
  expense_id: number;
  name: string;
  amount: number;
  date: string;
}

export default function Expenses() {
  const API_URL = "http://localhost:3000";

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const [salesToday, setSalesToday] = useState(0);

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  /* ================= FETCH ================= */
  const fetchExpenses = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/expenses?date=${selectedDate || ""}`
      );
      setExpenses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSales = async () => {
    try {
      const res = await axios.get(`${API_URL}/sales/today`);
      const total = res.data.reduce(
        (sum: number, s: any) => sum + Number(s.total || 0),
        0
      );
      setSalesToday(total);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchExpenses();
    fetchSales();
  }, [selectedDate]);

  /* ================= ADD ================= */
  const addExpense = async () => {
    if (!category || amount <= 0) return;

    // ✅ FIX: send correct fields to backend
    await axios.post(`${API_URL}/expenses`, {
      name: `${category} - ${description || ""}`,
      amount,
      date: selectedDate || new Date().toISOString().split("T")[0],
    });

    setCategory("");
    setDescription("");
    setAmount(0);
    fetchExpenses();
  };

  /* ================= DELETE ================= */
  const deleteExpense = async (id: number) => {
    if (!confirm("Delete this expense?")) return;

    await axios.delete(`${API_URL}/expenses/${id}`);
    fetchExpenses();
  };

  /* ================= TOTAL ================= */
  const totalExpenses = expenses.reduce(
    (sum, e) => sum + Number(e.amount),
    0
  );

  const profit = salesToday - totalExpenses;

  return (
    <div style={ui.fullscreenWrapper}>
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
            <a href="/expenses" style={{ ...ui.navItem, ...ui.navActive }}>
              Expenses
            </a>
          </nav>
        </div>

        <button style={ui.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </aside>

      {/* MAIN */}
      <main style={ui.mainContent}>
        <header style={ui.header}>
          <div>
            <h1 style={ui.title}>Expenses</h1>
            <p style={ui.subtitle}>Track your daily store expenses</p>
          </div>
        </header>

        {/* SUMMARY */}
        <div style={ui.summaryGrid}>
          <div style={ui.summaryCard}>
            <h4 style={{ color: "#ef4444" }}>Total Expenses</h4>
            <p style={{ color: "#ef4444" }}>
              ₱{totalExpenses.toLocaleString()}
            </p>
          </div>

          <div style={ui.summaryCard}>
            <h4 style={{ color: "#16a34a" }}>Sales Today</h4>
            <p style={{ color: "#16a34a" }}>
              ₱{salesToday.toLocaleString()}
            </p>
          </div>

          <div style={ui.summaryCard}>
            <h4 style={{ color: profit >= 0 ? "#16a34a" : "#ef4444" }}>Profit</h4>
            <p style={{ color: profit >= 0 ? "#16a34a" : "#ef4444" }}>
              ₱{profit.toLocaleString()}
            </p>
          </div>
        </div>

        {/* ADD EXPENSE */}
        <div style={ui.actionBar}>
          <select
            style={ui.input}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select Category</option>
            <option>📱 Load (Phones)</option>
            <option>📶 Piso WiFi</option>
            <option>💧 Mineral Water</option>
            <option>💡 Electricity</option>
            <option>📦 Supplies</option>
          </select>

          <input
            type="number"
            placeholder="Amount"
            style={ui.input}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />

          <input
            type="text"
            placeholder="Description"
            style={ui.input}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button style={ui.btnPrimary} onClick={addExpense}>
            + Add Expense
          </button>
        </div>

        {/* DATE FILTER */}
        <input
          type="date"
          style={{ ...ui.input, marginBottom: "15px" }}
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />

        {/* TABLE */}
        <div style={ui.tableContainer}>
          <table style={ui.table}>
            <thead>
              <tr style={ui.thead}>
                <th style={ui.th}>Date</th>
                <th style={ui.th}>Category</th>
                <th style={ui.th}>Description</th>
                <th style={ui.th}>Amount</th>
                <th style={ui.th}>Action</th>
              </tr>
            </thead>

            <tbody>
              {expenses.map((e) => {
                const [cat, desc] = e.name.split(" - ");

                return (
                  <tr key={e.expense_id}>
                    <td style={ui.td}>
                      {new Date(e.date).toLocaleDateString()}
                    </td>
                    <td style={ui.td}>{cat}</td>
                    <td style={ui.td}>{desc || "-"}</td>
                    <td style={{ ...ui.td, color: "#ef4444" }}>
                      ₱{Number(e.amount).toLocaleString()}
                    </td>
                    <td style={ui.td}>
                      <button
                        style={ui.btnDelete}
                        onClick={() => deleteExpense(e.expense_id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {expenses.length === 0 && (
            <div style={ui.emptyState}>No expenses found.</div>
          )}
        </div>
      </main>
    </div>
  );
}

/* ================= UI (UNCHANGED) ================= */
const ui: { [key: string]: React.CSSProperties } = {
  fullscreenWrapper: {
    display: "flex",
    width: "100vw",
    height: "100vh",
    background: "#f0f7ff",
    fontFamily: "'Inter', sans-serif",
  },

  sidebar: {
    width: "240px",
    background: "linear-gradient(180deg, #1e40af, #1e3a8a)",
    color: "white",
    padding: "30px 20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },

  logo: { fontSize: "22px", fontWeight: 800, textAlign: "center" },

  nav: { display: "flex", flexDirection: "column", gap: "8px" },

  navItem: {
    padding: "12px",
    color: "#bfdbfe",
    textDecoration: "none",
    borderRadius: "10px",
  },

  navActive: {
    background: "rgba(255,255,255,0.15)",
    color: "#fff",
  },

  logoutBtn: {
    padding: "12px",
    background: "#644ceb",
    color: "white",
    borderRadius: "10px",
  },

  mainContent: { flex: 1, padding: "40px" },

  header: { marginBottom: "20px" },

  title: { fontSize: "28px", color: "#1e3a8a", fontWeight: 800 },

  subtitle: { color: "#60a5fa" },

  summaryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
    marginBottom: "20px",
  },

  summaryCard: {
    background: "white",
    padding: "20px",
    borderRadius: "15px",
    fontWeight: 700,
  },

  actionBar: {
    display: "flex",
    gap: "10px",
    marginBottom: "15px",
  },

  input: {
    padding: "10px",
    borderRadius: "10px",
    border: "1px solid #dbeafe",
  },

  btnPrimary: {
    background: "#2563eb",
    color: "white",
    borderRadius: "10px",
    padding: "10px",
  },

  tableContainer: {
    background: "white",
    borderRadius: "20px",
    overflow: "hidden",
  },

  table: { width: "100%", borderCollapse: "collapse" },

  thead: { background: "#f8fafc" },

  th: { padding: "15px", color: "#64748b" },

  td: { padding: "15px", color: "blue" },

  btnDelete: {
    background: "#fee2e2",
    color: "#ef4444",
    padding: "6px 12px",
    borderRadius: "6px",
  },

  emptyState: {
    padding: "30px",
    textAlign: "center",
    color: "#94a3b8",
  },
};