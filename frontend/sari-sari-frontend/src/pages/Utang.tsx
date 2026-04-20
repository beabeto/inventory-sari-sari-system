import { useEffect, useState } from "react";
import axios from "axios";
import { logout } from "../api/auth";

/* ================= INTERFACES ================= */
interface Product {
  product_id: number;
  name: string;
  price: number;
}

interface UtangItem {
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface Utang {
  utang_id: number;
  name: string;
  total_debt: number;
  is_paid: boolean;
  items: UtangItem[];
}

/* ================= COMPONENT ================= */
export default function UtangPage() {
  const API_URL = "http://localhost:3000";

  const [utangList, setUtangList] = useState<Utang[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState(false);

  const [editId, setEditId] = useState<number | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<number | "">("");
  const [quantity, setQuantity] = useState(1);
  const [items, setItems] = useState<UtangItem[]>([]);

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  /* ================= FETCH ================= */
  const fetchUtang = async () => {
    const res = await axios.get(`${API_URL}/utang`);
    setUtangList(res.data);
  };

  const fetchProducts = async () => {
    const res = await axios.get(`${API_URL}/products`);
    setProducts(res.data);
  };

  useEffect(() => {
    fetchUtang();
    fetchProducts();
  }, []);

  /* ================= ADD ITEM ================= */
  const addItem = () => {
    const product = products.find(
      (p) => p.product_id === Number(selectedProduct)
    );
    if (!product || quantity <= 0) return;

    setItems([
      ...items,
      {
        product_id: product.product_id,
        product_name: product.name,
        quantity,
        price: product.price,
        subtotal: product.price * quantity,
      },
    ]);

    setSelectedProduct("");
    setQuantity(1);
  };

  const removeItem = (index: number) => {
    const updated = [...items];
    updated.splice(index, 1);
    setItems(updated);
  };

  /* ================= TOTAL ================= */
  const totalDebt = items.reduce((sum, i) => sum + i.subtotal, 0);

  /* ================= SAVE / UPDATE ================= */
  const handleSubmit = async () => {
    if (!customerName || items.length === 0) return;

    if (editId) {
      await axios.put(`${API_URL}/utang/${editId}`, {
        name: customerName,
        items,
      });
    } else {
      await axios.post(`${API_URL}/utang`, {
        name: customerName,
        items,
      });
    }

    resetForm();
    fetchUtang();
  };

  /* ================= EDIT ================= */
  const handleEdit = (u: Utang) => {
    setEditId(u.utang_id);
    setCustomerName(u.name);
    setItems(u.items);
    setShowModal(true);
  };

  /* ================= TOGGLE PAID ================= */
  const togglePaid = async (id: number) => {
    await axios.patch(`${API_URL}/utang/${id}/toggle`);
    fetchUtang();
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id: number) => {
    await axios.delete(`${API_URL}/utang/${id}`);
    fetchUtang();
  };

  const resetForm = () => {
    setCustomerName("");
    setItems([]);
    setEditId(null);
    setShowModal(false);
  };

  /* ================= FORMAT ================= */
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(amount);

  return (
    <div style={ui.fullscreenWrapper}>
      {/* SIDEBAR */}
      <aside style={ui.sidebar}>
        <div>
          <div style={ui.logo}> Sari-sari Store</div>

          <nav style={ui.nav}>
            <a href="/dashboard" style={ui.navItem}>Dashboard</a>
            <a href="/categories" style={ui.navItem}>Categories</a>
            <a href="/products" style={ui.navItem}>Products</a>
            <a href="/sales" style={ui.navItem}>Sales</a>
            <a href="/utang" style={{ ...ui.navItem, ...ui.navActive }}>Utang</a>
            <a href="/expenses" style={ui.navItem}>Expenses</a>
            <a href="/account" style={ui.navItem}>Account Settings</a>
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
            <h1 style={ui.title}>Utang Management</h1>
            <p style={ui.subtitle}>Track customer debts</p>
          </div>

          <button style={ui.btnPrimary} onClick={() => setShowModal(true)}>
            + Add Utang
          </button>
        </header>

        {/* TABLE */}
        <div style={ui.tableContainer}>
          <table style={ui.table}>
            <thead>
              <tr style={ui.thead}>
                <th style={ui.th}>Customer</th>
                <th style={ui.th}>Items</th>
                <th style={ui.th}>Total</th>
                <th style={ui.th}>Status</th>
                <th style={ui.th}>Action</th>
              </tr>
            </thead>

            <tbody>
              {utangList.map((u) => (
                <tr key={u.utang_id}>
                  <td style={ui.td}>{u.name}</td>

                  <td style={ui.td}>
                    {u.items?.map((i, idx) => (
                      <div key={idx}>
                        {i.product_name} x{i.quantity}
                      </div>
                    ))}
                  </td>

                  <td style={ui.td}>{formatCurrency(u.total_debt)}</td>

                  <td style={ui.td}>
                    <span style={{ color: u.is_paid ? "green" : "red", fontWeight: 700 }}>
                      {u.is_paid ? "PAID" : "UNPAID"}
                    </span>
                  </td>

                  <td style={ui.td}>
                    <button style={ui.btnEdit} onClick={() => handleEdit(u)}>
                      Edit
                    </button>

                    <button
                      style={{
                        ...ui.btnEdit,
                        border: "1px solid",
                        background: u.is_paid ? "#dcfce7" : "#fee2e2",
                        color: u.is_paid ? "#16a34a" : "#ef4444",
                      }}
                      onClick={() => togglePaid(u.utang_id)}
                    >
                      {u.is_paid ? "PAID" : "UNPAID"}
                    </button>

                    <button style={ui.btnDelete} onClick={() => handleDelete(u.utang_id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* MODAL */}
      {showModal && (
        <div style={ui.modalOverlay}>
          <div style={ui.modal}>
            <h3>{editId ? "Edit Utang" : "Add Utang"}</h3>

            <input
              style={ui.input}
              placeholder="Customer Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />

            <select
              style={ui.input}
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(Number(e.target.value))}
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

            <button style={ui.btnPrimary} onClick={addItem}>
              Add Item
            </button>

            {items.map((i, idx) => (
              <div key={idx} style={ui.itemRow}>
                <span style={{ color: "#111" }}>
                  {i.product_name} x{i.quantity}
                </span>
                <button onClick={() => removeItem(idx)}>✕</button>
              </div>
            ))}

            <h4 style={ui.itemRow}>Total: {formatCurrency(totalDebt)}</h4>

            <button style={ui.btnSave} onClick={handleSubmit}>
              Save
            </button>

            <button style={ui.btnCancel} onClick={resetForm}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= UI (UNCHANGED STYLE) ================= */
const ui: { [key: string]: React.CSSProperties } = {
  fullscreenWrapper: {
    display: "flex",
    width: "100vw",
    height: "100vh",
    fontFamily: "'Inter', sans-serif",
    overflow: "hidden",
    background: "#f0f7ff",
  },
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
    textAlign: "center",
    marginBottom: "40px",
  },
  nav: { display: "flex", flexDirection: "column", gap: "8px" },

  navItem: {
    padding: "12px 15px",
    color: "#bfdbfe",
    textDecoration: "none",
    borderRadius: "10px",
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
    border: "none",
  },
  mainContent: { flex: 1, padding: "40px", overflowY: "auto" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" },
  title: { fontSize: "28px", color: "#1e3a8a", margin: 0, fontWeight: 800 },
  subtitle: { color: "#60a5fa", margin: "5px 0 0 0" },
  tableContainer: { background: "white", borderRadius: "20px", boxShadow: "0 10px 25px rgba(30, 58, 138, 0.05)", overflow: "hidden" },
  table: { width: "100%", borderCollapse: "collapse" },
  thead: { background: "#f8fafc" },
  th: { padding: "15px 25px", textAlign: "left", fontSize: "12px", color: "#64748b", textTransform: "uppercase" },
  td: { padding: "15px 25px", borderBottom: "1px solid #f1f5f9", fontSize: "14px", color: "#111" },
  btnEdit: { background: "none", border: "1px solid #bfdbfe", color: "#2563eb", padding: "6px 12px", borderRadius: "6px", marginRight: "8px", cursor: "pointer" },
  btnDelete: { background: "none", border: "1px solid #fecaca", color: "#ef4444", padding: "6px 12px", borderRadius: "6px", cursor: "pointer" },
  btnSave: { background: "#16a34a", color: "white", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", marginRight: "8px" },
  btnCancel: { background: "#d1d5db", color: "black", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer" },
  input: { padding: "12px 15px", borderRadius: "10px", border: "1px solid #dbeafe", background: "white", color: "#000", marginBottom: "10px", width: "100%" },
  modalOverlay: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.3)", display: "flex", justifyContent: "center", alignItems: "center" },
  modal: { background: "white", padding: "25px", borderRadius: "12px", width: "400px" },
  itemRow: { display: "flex", justifyContent: "space-between", marginTop: "5px", color: "#111" },
};