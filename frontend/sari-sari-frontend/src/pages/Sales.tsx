import React, { useEffect, useState } from "react";
import axios from "axios";
import { logout } from "../api/auth";

/* ===================== INTERFACES ===================== */
interface Product {
  product_id: number;
  name: string;
  price: number;
  stock: number;
}

interface Sale {
  sale_id?: number;
  product_id: number;
  quantity: number;
  price?: number;
  total?: number;
  sale_date?: string;
}

/* ===================== COMPONENT ===================== */
export default function Sales() {
  const API_URL = "http://localhost:3000";

  const [sales, setSales] = useState<Sale[]>([]);
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showHistoryMenu, setShowHistoryMenu] = useState(false);

  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);

  /* ===================== HISTORY ===================== */
  const [historyView, setHistoryView] =
    useState<"daily" | "weekly" | "monthly" | "yearly">("daily");

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const weekday = new Date().toLocaleDateString("en-US", { weekday: "long" });
  const formattedDateTime = new Date().toLocaleString();

  /* ===================== AUTH ===================== */
  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  /* ===================== FETCH ===================== */
  const fetchProducts = async () => {
    const res = await axios.get(`${API_URL}/products`);
    setProducts(res.data);
  };

  const fetchTodaySales = async () => {
    const res = await axios.get(`${API_URL}/sales/today`);
    setSales(res.data);
  };

  const fetchHistory = async () => {
    try {
      let url = "";

      if (historyView === "daily") {
        url = `${API_URL}/sales/history/daily?date=${
          selectedDate || new Date().toISOString().split("T")[0]
        }`;
      }

      if (historyView === "weekly") {
        url = `${API_URL}/sales/history/weekly?month=${selectedMonth}&year=${selectedYear}`;
      }

      if (historyView === "monthly") {
        url = `${API_URL}/sales/history/monthly?year=${selectedYear}`;
      }

      if (historyView === "yearly") {
        url = `${API_URL}/sales/history/yearly`;
      }

      const res = await axios.get(url);

      setHistoryData(Array.isArray(res.data) ? res.data : [res.data]);
    } catch {
      setHistoryData([]);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchTodaySales();
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [historyView, selectedDate, selectedMonth, selectedYear]);

  /* ===================== PRODUCT ===================== */
  const handleProductChange = (id: number) => {
    setSelectedProductId(id);

    const product = products.find((p) => p.product_id === id);
    if (product) setPrice(product.price);
  };

  /* ===================== ADD SALE ===================== */
  const addSale = async () => {
    if (!selectedProductId || quantity <= 0) return;

    await axios.post(`${API_URL}/sales/today`, {
      product_id: selectedProductId,
      quantity,
    });

    setShowModal(false);
    setSelectedProductId(null);
    setQuantity(1);
    setPrice(0);

    fetchTodaySales();
    fetchHistory();
  };

  const safe = (v: any) => Number(v ?? 0);

  /* ===================== HISTORY UI ===================== */
  const renderHistoryView = () => {
    if (!historyData.length) {
      return <div style={ui.emptyState}>No sales data found.</div>;
    }

    switch (historyView) {
      case "daily":
        return (
          <table style={ui.table}>
            <thead>
              <tr>
                <th style={ui.th}>Date</th>
                <th style={ui.th}>Sales</th>
              </tr>
            </thead>
            <tbody>
              {historyData.map((s, i) => (
                <tr key={i}>
                  <td style={ui.td}>
                    {new Date(s.date || s.sale_date).toLocaleString()}
                  </td>
                  <td style={ui.td}>₱{safe(s.totalSales || s.total).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      case "weekly":
        return (
          <table style={ui.table}>
            <thead>
              <tr>
                <th style={ui.th}>Date</th>
                <th style={ui.th}>Total</th>
              </tr>
            </thead>
            <tbody>
              {historyData.map((s, i) => (
                <tr key={i}>
                  <td style={ui.td}>
                    {new Date(s.date).toLocaleDateString()}
                  </td>
                  <td style={ui.td}>₱{safe(s.totalSales).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      case "monthly":
        return (
          <table style={ui.table}>
            <thead>
              <tr>
                <th style={ui.th}>Date</th>
                <th style={ui.th}>Total</th>
              </tr>
            </thead>
            <tbody>
              {historyData.map((s, i) => (
                <tr key={i}>
                  <td style={ui.td}>{s.date}</td>
                  <td style={ui.td}>₱{safe(s.totalSales).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );

      case "yearly":
        return (
          <table style={ui.table}>
            <thead>
              <tr>
                <th style={ui.th}>Month</th>
                <th style={ui.th}>Total</th>
              </tr>
            </thead>
            <tbody>
              {historyData.map((s, i) => (
                <tr key={i}>
                  <td style={ui.td}>Month {s.month}</td>
                  <td style={ui.td}>₱{safe(s.totalSales).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
    }
  };

  /* ===================== UI ===================== */
  return (
    <div style={ui.fullscreenWrapper}>
      <aside style={ui.sidebar}>
        <div>
          <div style={ui.logo}>Sari-sari Store</div>

          <nav style={ui.nav}>
            <a href="/dashboard" style={ui.navItem}>Dashboard</a>
            <a href="/categories" style={ui.navItem}>Categories</a>
            <a href="/products" style={ui.navItem}>Products</a>
            <a href="/sales" style={{ ...ui.navItem, ...ui.navActive }}>Sales</a>
            <a href="/utang" style={ui.navItem}>Utang</a>
            <a href="/expenses" style={ui.navItem}>Expenses</a>
          </nav>
        </div>

        <button style={ui.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main style={ui.mainContent}>
        <header style={ui.header}>
          <div>
            <h1 style={ui.title}>Today's Sales</h1>
            <p style={ui.subtitle}>
              {weekday} | {formattedDateTime}
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px", position: "relative" }}>
            <button style={ui.btnPrimary} onClick={() => setShowModal(true)}>
              Add Sales
            </button>

            <button
              style={ui.btnSecondary}
              onClick={() => setShowHistoryMenu(!showHistoryMenu)}
            >
              History
            </button>

            {showHistoryMenu && (
              <div style={ui.dropdown}>
                <div onClick={() => setHistoryView("daily")} style={ui.dropdownItem}>Daily</div>
                <div onClick={() => setHistoryView("weekly")} style={ui.dropdownItem}>Weekly</div>
                <div onClick={() => setHistoryView("monthly")} style={ui.dropdownItem}>Monthly</div>
                <div onClick={() => setHistoryView("yearly")} style={ui.dropdownItem}>Yearly</div>
              </div>
            )}
          </div>
        </header>

        <div style={{ marginBottom: "15px" }}>
          {historyView === "daily" && (
            <input type="date" style={ui.input} value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)} />
          )}

          {historyView === "monthly" && (
            <select style={ui.input}
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i + 1}>Month {i + 1}</option>
              ))}
            </select>
          )}

          {historyView === "yearly" && (
            <input type="number" style={ui.input}
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))} />
          )}
        </div>

        <div style={ui.tableContainer}>{renderHistoryView()}</div>
      </main>

      {/* MODAL */}
      {showModal && (
        <div style={ui.modalOverlay}>
          <div style={ui.modal}>
            <h3>Add Sale</h3>

            <select style={ui.input}
              onChange={(e) => handleProductChange(Number(e.target.value))}>
              <option value="">Select Product</option>
              {products.map((p) => (
                <option key={p.product_id} value={p.product_id}>
                  {p.name}
                </option>
              ))}
            </select>

            <input style={ui.input} value={price} disabled />

            <input
              style={ui.input}
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />

            <button style={ui.btnSave} onClick={addSale}>Save</button>
            <button style={ui.btnCancel} onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ===================== STYLE (UNCHANGED) ===================== */
const ui: { [key: string]: React.CSSProperties } = {
  fullscreenWrapper: { display: "flex", width: "100vw", height: "100vh", background: "#f0f7ff" },
  sidebar: { width: "240px", background: "#1e3a8a", color: "white", padding: "30px 20px", display: "flex", flexDirection: "column", justifyContent: "space-between" },
  logo: { fontSize: "22px", fontWeight: 800, textAlign: "center", marginBottom: "40px" },
  nav: { display: "flex", flexDirection: "column", gap: "8px" },
  navItem: { padding: "12px 15px", color: "#bfdbfe", textDecoration: "none", borderRadius: "10px" },
  navActive: { background: "rgba(255,255,255,0.15)", color: "#fff", fontWeight: 600 },
  logoutBtn: { padding: "12px", background: "#644ceb", color: "white", border: "none", borderRadius: "10px" },

  mainContent: { flex: 1, padding: "40px" },
  header: { display: "flex", justifyContent: "space-between", marginBottom: "20px" },
  title: { fontSize: "28px", color: "#1e3a8a", fontWeight: 800 },
  subtitle: { color: "#60a5fa" },

  btnPrimary: { background: "#2563eb", color: "white", padding: "10px 20px", borderRadius: "10px", border: "none" },
  btnSecondary: { background: "white", color: "#1e3a8a", border: "1px solid #cbd5f5", padding: "10px 20px", borderRadius: "10px" },

  dropdown: { position: "absolute", top: "45px", right: 0, background: "white", borderRadius: "10px" },
  dropdownItem: { padding: "10px 20px", borderBottom: "1px solid #eee", color: "#1e3a8a", cursor: "pointer" },

  tableContainer: { background: "white", borderRadius: "20px", overflow: "hidden" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { padding: "15px", color: "#1e3a8a" },
  td: { padding: "15px", color: "blue" },

  input: { padding: "12px", borderRadius: "10px", border: "1px solid #dbeafe", width: "100%" },

  modalOverlay: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.4)", display: "flex", justifyContent: "center", alignItems: "center" },
  modal: { background: "white", padding: "25px", borderRadius: "15px", width: "400px", display: "flex", flexDirection: "column", gap: "10px" },

  btnSave: { background: "#16a34a", color: "white", padding: "10px", borderRadius: "8px", border: "none" },
  btnCancel: { background: "#d1d5db", padding: "10px", borderRadius: "8px", border: "none" },

  emptyState: { padding: "30px", textAlign: "center", color: "#94a3b8" }
};