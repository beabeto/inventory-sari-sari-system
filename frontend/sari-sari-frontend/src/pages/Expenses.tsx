import React, { useEffect, useState } from "react";
import client from "../api/client";
import Sidebar from "../components/Sidebar";

/* ================= INTERFACE ================= */
interface Expense {
  expense_id: number;
  name: string;
  amount: number;
  date: string;
}

export default function Expenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [debugUser, setDebugUser] = useState<any>(null);
  const [lastResp, setLastResp] = useState<any>(null);

  const [salesToday, setSalesToday] = useState(0);

  /* ================= FETCH ================= */
  const fetchExpenses = async () => {
    try {
      const res = await client.get(`/expenses?date=${selectedDate || ""}`);
      setLastResp(res.data);
      setExpenses(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSales = async () => {
    try {
      const res = await client.get(`/sales/today`);
      setLastResp(res.data);
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
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setDebugUser(payload);
      }
    } catch (e) {
      // ignore
    }

    fetchExpenses();
    fetchSales();
  }, [selectedDate]);

  /* ================= ADD ================= */
  const addExpense = async () => {
    if (!category || amount <= 0) return;

    try {
      const res = await client.post(`/expenses`, {
        name: `${category} - ${description || ""}`,
        amount,
        date: selectedDate || new Date().toISOString().split("T")[0],
      });
      setLastResp(res.data);

      setCategory("");
      setDescription("");
      setAmount(0);
      fetchExpenses();
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= DELETE ================= */
  const deleteExpense = async (id: number) => {
    if (!confirm("Delete this expense?")) return;

    try {
      const res = await client.delete(`/expenses/${id}`);
      setLastResp(res.data);
      fetchExpenses();
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= TOTAL ================= */
  const totalExpenses = expenses.reduce(
    (sum, e) => sum + Number(e.amount),
    0
  );

  const profit = salesToday - totalExpenses;

  return (
    <div style={ui.fullscreenWrapper}>
      <Sidebar activePage="expenses" />

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

  mainContent: { flex: 1, padding: "40px", overflowY: "auto" },

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
  }
};