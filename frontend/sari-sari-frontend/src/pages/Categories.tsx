import React, { useEffect, useState } from "react";
import axios from "axios";
import { logout } from "../api/auth";

interface Category {
  category_id: number;
  name: string;
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [search, setSearch] = useState("");

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  const fetchCategories = () => {
    axios
      .get("http://localhost:3000/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const addCategory = () => {
    if (!newCategory) return;
    axios
      .post("http://localhost:3000/categories", { name: newCategory })
      .then(() => {
        setNewCategory("");
        fetchCategories();
      })
      .catch((err) => console.error(err));
  };

  const deleteCategory = (id: number) => {
    if (!confirm("Delete this category?")) return;
    axios
      .delete(`http://localhost:3000/categories/${id}`)
      .then(() => fetchCategories())
      .catch((err) => console.error(err));
  };

  // --- Editing state & handlers ---
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");

  const startEdit = (cat: Category) => {
    setEditingId(cat.category_id);
    setEditingName(cat.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  const saveEdit = (id: number) => {
    if (!editingName.trim()) return;
    axios
      .put(`http://localhost:3000/categories/${id}`, { name: editingName })
      .then(() => {
        cancelEdit();
        fetchCategories();
      })
      .catch((err) => console.error(err));
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={ui.fullscreenWrapper}>
      {/* Sidebar - Matches Dashboard */}
      <aside style={ui.sidebar}>
        <div>
          <div style={ui.logo}>Sari-sari Store</div>
          <nav style={ui.nav}>
            <a href="/dashboard" style={ui.navItem}>Dashboard</a>
            <a href="/categories" style={{...ui.navItem, ...ui.navActive}}>Categories</a>
            <a href="/products" style={ui.navItem}>Products</a>
            <a href="/sales" style={ui.navItem}>Sales</a>
            <a href="/utang" style={ui.navItem}>Utang</a>
            <a href="/expenses" style={ui.navItem}>Expenses</a>
          </nav>
        </div>
        <button style={ui.logoutBtn} onClick={handleLogout}>Logout</button>
      </aside>

      {/* Main Content */}
      <main style={ui.mainContent}>
        <header style={ui.header}>
          <div>
            <h1 style={ui.title}>Categories</h1>
            <p style={ui.subtitle}>Manage and organize your inventory groupings</p>
          </div>
          {/* Summary Card like Dashboard */}
          <div style={ui.summaryCard}>
            <div style={ui.summaryIcon}>📂</div>
            <div>
              <div style={ui.summaryLabel}>Total Categories</div>
              <div style={ui.summaryValue}>{categories.length}</div>
            </div>
          </div>
        </header>

        {/* Action Bar */}
        <div style={ui.actionBar}>
          <div style={ui.addBox}>
            <input
              type="text"
              placeholder="Enter new category name..."
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              style={ui.input}
            />
            <button onClick={addCategory} style={ui.btnPrimary}>+ Add Category</button>
          </div>

          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{...ui.input, width: '300px', paddingLeft: '40px', backgroundColor: 'white'}}
            />
            <span style={ui.searchIcon}>🔍</span>
          </div>
        </div>

        {/* Table Area */}
        <div style={ui.tableContainer}>
          <table style={ui.table}>
            <thead>
              <tr style={ui.thead}>
                <th style={ui.th}>ID</th>
                <th style={ui.th}>Category Name</th>
                <th style={{...ui.th, textAlign: 'right'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((cat) => (
                <tr key={cat.category_id} style={ui.tr}>
                  <td style={ui.td}><span style={ui.idBadge}>#{cat.category_id}</span></td>
                  <td style={{...ui.td}}>
                    {editingId === cat.category_id ? (
                      <input
                        autoFocus
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveEdit(cat.category_id);
                          if (e.key === "Escape") cancelEdit();
                        }}
                        style={{...ui.input, width: '70%'}}
                      />
                    ) : (
                      <span style={{fontWeight: 600, color: '#1e3a8a'}}>{cat.name}</span>
                    )}
                  </td>
                  <td style={{...ui.td, textAlign: 'right'}}>
                    {editingId === cat.category_id ? (
                      <>
                        <button onClick={() => saveEdit(cat.category_id)} style={ui.btnSave}>Save</button>
                        <button onClick={cancelEdit} style={ui.btnCancel}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => startEdit(cat)} style={ui.btnEdit}>Edit</button>
                        <button 
                          onClick={() => deleteCategory(cat.category_id)} 
                          style={ui.btnDelete}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredCategories.length === 0 && (
            <div style={ui.emptyState}>No categories found matching your search.</div>
          )}
        </div>
      </main>
    </div>
  );
}

// --- Combined UI Theme ---
const ui: { [key: string]: React.CSSProperties } = {
  fullscreenWrapper: {
    display: "flex",
    width: "100vw",
    height: "100vh",
    background: "#f0f7ff",
    fontFamily: "'Inter', sans-serif",
    overflow: "hidden",
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
  logo: { fontSize: "22px", fontWeight: 800, marginBottom: "40px", textAlign: "center" },
  nav: { display: "flex", flexDirection: "column", gap: "8px" },
  navItem: {
    padding: "12px 15px",
    color: "#bfdbfe",
    textDecoration: "none",
    borderRadius: "10px",
    fontSize: "14px",
    transition: "0.2s",
  },
  navActive: { background: "rgba(255,255,255,0.15)", color: "#fff", fontWeight: 600 },
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
  mainContent: { flex: 1, padding: "40px", overflowY: "auto" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" },
  title: { fontSize: "28px", color: "#1e3a8a", margin: 0, fontWeight: 800 },
  subtitle: { color: "#60a5fa", margin: "5px 0 0 0" },
  summaryCard: {
    background: "white",
    padding: "15px 25px",
    borderRadius: "15px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
  },
  summaryIcon: { fontSize: "24px", background: "#eff6ff", padding: "10px", borderRadius: "12px" },
  summaryLabel: { fontSize: "12px", color: "#64748b", textTransform: "uppercase", fontWeight: 700 },
  summaryValue: { fontSize: "20px", fontWeight: 800, color: "#1e293b" },
  actionBar: { display: "flex", justifyContent: "space-between", marginBottom: "25px", alignItems: "center" },
  addBox: { display: "flex", gap: "10px" },
  input: {
    padding: "12px 15px",
    borderRadius: "10px",
    border: "1px solid #dbeafe",
    outline: "none",
    fontSize: "14px",
    color: 'black',
    backgroundColor: 'white',
  },
  searchIcon: { position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', opacity: 0.3 },
  btnPrimary: {
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "0 20px",
    borderRadius: "10px",
    fontWeight: 600,
    cursor: "pointer",
  },
  tableContainer: {
    background: "white",
    borderRadius: "20px",
    boxShadow: "0 10px 25px rgba(30, 58, 138, 0.05)",
    overflow: "hidden",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  thead: { background: "#f8fafc", borderBottom: "1px solid #e2e8f0" },
  th: { padding: "15px 25px", textAlign: "left", fontSize: "12px", color: "#64748b", textTransform: "uppercase" },
  td: { padding: "15px 25px", borderBottom: "1px solid #f1f5f9", fontSize: "14px" },
  idBadge: { background: "#f1f5f9", padding: "4px 8px", borderRadius: "6px", color: "#64748b", fontSize: "12px" },
  btnEdit: { background: "none", border: "1px solid #bfdbfe", color: "#2563eb", padding: "6px 12px", borderRadius: "6px", marginRight: "8px", cursor: "pointer" },
  btnDelete: { background: "none", border: "1px solid #fecaca", color: "#ef4444", padding: "6px 12px", borderRadius: "6px", cursor: "pointer" },
  emptyState: { padding: "40px", textAlign: "center", color: "#94a3b8" }
};