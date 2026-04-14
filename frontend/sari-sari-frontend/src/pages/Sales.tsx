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
  sale_id: number;
  product_id: number;
  quantity: number;
  price: number;
  total: number;
  sale_date: string;
  product: Product;
}

/* ===================== COMPONENT ===================== */
export default function Sales() {
  const API_URL = "http://localhost:3000";

  const [sales, setSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showHistoryMenu, setShowHistoryMenu] = useState(false);

  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);

  /* ===================== HISTORY STATES ===================== */
  const [historyView, setHistoryView] = useState<
    "daily" | "weekly" | "monthly" | "yearly"
  >("daily");

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().getMonth() + 1
  );
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear()
  );

  /* ===================== DATE ===================== */
  const todayDate = new Date();
  const weekday = todayDate.toLocaleDateString("en-US", { weekday: "long" });
  const formattedDateTime = todayDate.toLocaleString();

  /* ===================== AUTH ===================== */
  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  /* ===================== FETCH ===================== */
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/products`);
      setProducts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTodaySales = async () => {
    try {
      const res = await axios.get(`${API_URL}/sales/today`);
      setSales(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchTodaySales();
  }, []);

  /* ===================== PRODUCT SELECT ===================== */
  const handleProductChange = (id: number) => {
    setSelectedProductId(id);

    const product = products.find((p) => p.product_id === id);
    if (product) setPrice(product.price);
  };

  /* ===================== ADD SALE ===================== */
  const addSale = async () => {
    if (!selectedProductId || quantity <= 0) {
      alert("Select product and valid quantity.");
      return;
    }

    try {
      await axios.post(`${API_URL}/sales/today`, {
        product_id: selectedProductId,
        quantity,
      });

      setShowModal(false);
      setSelectedProductId(null);
      setQuantity(1);
      setPrice(0);

      fetchTodaySales();
      fetchProducts();
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to add sale.");
    }
  };

  /* ===================== TOTAL ===================== */
  const totalSales = sales.reduce((sum, s) => sum + Number(s.total), 0);

  /* ===================== HISTORY RENDER ===================== */
  const renderHistoryView = () => {
    switch (historyView) {
      case "daily":
        return (
          <table style={ui.table}>
            <thead>
              <tr>
                <th style={ui.th}>Date</th>
                <th style={ui.th}>Total Sales</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={ui.td}>
                  {selectedDate || new Date().toLocaleDateString()}
                </td>
                <td style={ui.td}>₱{totalSales.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        );

      case "weekly":
        return (
          <>
            <table style={ui.table}>
              <thead>
                <tr>
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                    (d) => (
                      <th key={d} style={ui.th}>
                        {d}
                      </th>
                    )
                  )}
                </tr>
              </thead>

              <tbody>
                <tr>
                  {Array.from({ length: 7 }).map((_, i) => (
                    <td key={i} style={ui.td}>
                      ₱{(totalSales / 7).toFixed(2)}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>

            <div style={ui.summaryBar}>
              Total Week Sales: ₱{totalSales.toFixed(2)}
            </div>
          </>
        );

      case "monthly":
        return (
          <>
            {[1, 2, 3, 4].map((week) => (
              <div key={week} style={ui.summaryBar}>
                Week {week}: ₱{(totalSales / 4).toFixed(2)}
              </div>
            ))}

            <div style={{ ...ui.summaryBar, marginTop: "10px" }}>
              Total Monthly Sales: ₱{totalSales.toFixed(2)}
            </div>
          </>
        );

      case "yearly":
        return (
          <>
            {[
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ].map((m) => (
              <div key={m} style={ui.summaryBar}>
                {m}: ₱{(totalSales / 12).toFixed(2)}
              </div>
            ))}

            <div style={{ ...ui.summaryBar, marginTop: "10px" }}>
              Total Yearly Sales: ₱{totalSales.toFixed(2)}
            </div>
          </>
        );
    }
  };

  /* ===================== UI ===================== */
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
            <a href="/sales" style={{ ...ui.navItem, ...ui.navActive }}>Sales</a>
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
              Sales History
            </button>

            {showHistoryMenu && (
              <div style={ui.dropdown}>
                <div style={ui.dropdownItem} onClick={() => setHistoryView("daily")}>
                  Daily Sales
                </div>
                <div style={ui.dropdownItem} onClick={() => setHistoryView("weekly")}>
                  Weekly Sales
                </div>
                <div style={ui.dropdownItem} onClick={() => setHistoryView("monthly")}>
                  Monthly Sales
                </div>
                <div style={ui.dropdownItem} onClick={() => setHistoryView("yearly")}>
                  Yearly Sales
                </div>
              </div>
            )}
          </div>
        </header>

        {/* FILTER (optional future expansion hook) */}
        <div style={{ marginBottom: "15px", display: "flex", gap: "10px" }}>
          {historyView === "daily" && (
            <input
              type="date"
              style={ui.input}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          )}

          {historyView === "monthly" && (
            <select
              style={ui.input}
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  Month {i + 1}
                </option>
              ))}
            </select>
          )}

          {historyView === "yearly" && (
            <input
              type="number"
              style={ui.input}
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              placeholder="Year"
            />
          )}
        </div>

        {/* HISTORY VIEW */}
        <div style={ui.tableContainer}>{renderHistoryView()}</div>
      </main>

      {/* MODAL */}
      {showModal && (
        <div style={ui.modalOverlay}>
          <div style={ui.modal}>
            <h3 style={ui.modalTitle}>Add Sale</h3>

            <div style={ui.weekdayBadge}>
              {weekday.toUpperCase()}
            </div>

            <select
              style={ui.input}
              value={selectedProductId ?? ""}
              onChange={(e) => handleProductChange(Number(e.target.value))}
            >
              <option value="">Select Product</option>
              {products.map((p) => (
                <option key={p.product_id} value={p.product_id}>
                  {p.name} (Stock: {p.stock})
                </option>
              ))}
            </select>

            <input style={ui.input} value={price} disabled />

            <input
              style={ui.input}
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />

            <div style={{ display: "flex", gap: "10px" }}>
              <button style={ui.btnSave} onClick={addSale}>
                Save
              </button>
              <button style={ui.btnCancel} onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ===================== STYLES ===================== */
const ui: { [key: string]: React.CSSProperties } = {
  fullscreenWrapper: { display: "flex", width: "100vw", height: "100vh", background: "#f0f7ff" },
  sidebar: { width: "240px", background: "#1e3a8a", color: "white", padding: "30px 20px", display: "flex", flexDirection: "column", justifyContent: "space-between" },
  logo: { fontSize: "22px", fontWeight: 800, textAlign: "center", marginBottom: "40px" },
  nav: { display: "flex", flexDirection: "column", gap: "8px" },
  navItem: { padding: "12px 15px", color: "#bfdbfe", textDecoration: "none", borderRadius: "10px" },
  navActive: { background: "rgba(255,255,255,0.15)", color: "#fff", fontWeight: 600 },

  logoutBtn: { padding: "12px", background: "#644ceb", color: "white", border: "none", borderRadius: "10px" },

  mainContent: { flex: 1, padding: "40px", overflowY: "auto" },
  header: { display: "flex", justifyContent: "space-between", marginBottom: "20px" },
  title: { fontSize: "28px", color: "#1e3a8a", fontWeight: 800 },
  subtitle: { color: "#60a5fa" },

  btnPrimary: { background: "#2563eb", color: "white", padding: "10px 20px", borderRadius: "10px", border: "none" },
  btnSecondary: { background: "white", color: "#1e3a8a", border: "1px solid #cbd5f5", padding: "10px 20px", borderRadius: "10px" },

  dropdown: { position: "absolute", top: "45px", right: 0, background: "white", borderRadius: "10px" },
  dropdownItem: { padding: "10px 20px", borderBottom: "1px solid #eee", color: "#1e3a8a", cursor: "pointer" },

  tableContainer: { background: "white", borderRadius: "20px", overflow: "hidden" },
  table: { width: "100%", borderCollapse: "collapse" },
  thead: { background: "#f8fafc" },
  th: { padding: "15px", textAlign: "left", fontSize: "12px", color: "#1e3a8a" },
  td: { padding: "15px", fontSize: "14px", color: "blue" },

  summaryBar: { marginTop: "10px", padding: "15px", background: "#1e3a8a", color: "white", textAlign: "right" },
  emptyState: { padding: "30px", textAlign: "center", color: "#94a3b8" },

  modalOverlay: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.4)", display: "flex", justifyContent: "center", alignItems: "center" },
  modal: { background: "white", padding: "25px", borderRadius: "15px", width: "400px", display: "flex", flexDirection: "column", gap: "12px" },

  modalTitle: { fontSize: "18px", fontWeight: 700 },
  weekdayBadge: { background: "#1e3a8a", color: "white", padding: "8px", borderRadius: "8px", textAlign: "center" },

  input: { padding: "12px", borderRadius: "10px", border: "1px solid #dbeafe" },

  btnSave: { background: "#16a34a", color: "white", padding: "10px", borderRadius: "8px", border: "none", flex: 1 },
  btnCancel: { background: "#d1d5db", padding: "10px", borderRadius: "8px", border: "none", flex: 1 },
};