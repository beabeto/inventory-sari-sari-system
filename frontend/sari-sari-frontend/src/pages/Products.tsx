import React, { useEffect, useState } from "react";
import axios from "axios";
import { logout } from "../api/auth";

// --- INTERFACES ---
interface Category {
  category_id: number;
  name: string;
  productCount?: number;
  totalStock?: number;
}

interface Brand {
  brand_id: number;
  name: string;
  category_id: number;
}

interface Product {
  product_id: number;
  name: string;
  stock: number;
  category_id: number;
  brand_id: number;
  category?: Category;
  brand?: Brand;
}

export default function Products() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [newProductName, setNewProductName] = useState("");
  const [newProductStock, setNewProductStock] = useState(0);
  const [newProductBrand, setNewProductBrand] = useState<number | null>(null);
  const [newBrandName, setNewBrandName] = useState("");
  const [search, setSearch] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  // --- FETCH ---
  const fetchCategories = () => {
    axios
      .get("http://localhost:3000/categories") // ✅ fixed endpoint
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Failed to fetch categories:", err));
  };

  const fetchBrands = (categoryId?: number) => {
    const url = categoryId
      ? `http://localhost:3000/brands?category_id=${categoryId}`
      : "http://localhost:3000/brands";

    axios.get(url).then((res) => setBrands(res.data));
  };

  const fetchProducts = (categoryId?: number) => {
    const url = categoryId
      ? `http://localhost:3000/products?category_id=${categoryId}`
      : "http://localhost:3000/products";

    axios.get(url).then((res) => setProducts(res.data));
  };

  useEffect(() => {
    fetchCategories();
    fetchBrands();
    fetchProducts();
  }, []);

  // --- CATEGORY FILTER ---
  const handleCategoryChange = (id: number) => {
    setSelectedCategory(id);
    fetchBrands(id);
    fetchProducts(id);
  };

  // --- ADD PRODUCT ---
  const addProduct = () => {
    if (!newProductName || !newProductBrand || !selectedCategory) return;

    axios
      .post("http://localhost:3000/products", {
        name: newProductName,
        stock: newProductStock,
        brand_id: newProductBrand,
        category_id: selectedCategory,
      })
      .then(() => {
        setNewProductName("");
        setNewProductStock(0);
        fetchProducts(selectedCategory);
        fetchCategories(); // update category stock
      });
  };

  // --- ADD BRAND ---
  const addBrand = () => {
    if (!newBrandName || !selectedCategory) return;

    axios
      .post("http://localhost:3000/brands", {
        name: newBrandName,
        category_id: selectedCategory,
      })
      .then(() => {
        setNewBrandName("");
        fetchBrands(selectedCategory);
      });
  };

  // --- DELETE ---
  const deleteProduct = (id: number) => {
    if (!confirm("Delete product?")) return;

    axios.delete(`http://localhost:3000/products/${id}`).then(() => {
      fetchProducts(selectedCategory || undefined);
      fetchCategories();
    });
  };

  // --- STOCK CONTROL (+ / -) ---
  const updateStock = (prod: Product, change: number) => {
    const newStock = prod.stock + change;
    if (newStock < 0) return;

    axios
      .put(`http://localhost:3000/products/${prod.product_id}`, {
        name: prod.name,
        stock: newStock,
        category_id: prod.category_id,
        brand_id: prod.brand_id,
      })
      .then(() => {
        fetchProducts(selectedCategory || undefined);
        fetchCategories();
      });
  };

  // --- EDIT ---
  const startEdit = (p: Product) => {
    setEditingId(p.product_id);
    setEditingName(p.name);
  };

  const saveEdit = (id: number, prod: Product) => {
    axios
      .put(`http://localhost:3000/products/${id}`, {
        name: editingName,
        stock: prod.stock,
        category_id: prod.category_id,
        brand_id: prod.brand_id,
      })
      .then(() => {
        setEditingId(null);
        fetchProducts(selectedCategory || undefined);
      });
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={ui.fullscreenWrapper}>
      {/* Sidebar */}
      <aside style={ui.sidebar}>
        <div>
          <div style={ui.logo}>Sari-sari Store</div>
          <nav style={ui.nav}>
            <a href="/dashboard" style={ui.navItem}>
              Dashboard
            </a>
            <a href="/categories" style={ui.navItem}>
              Categories
            </a>
            <a href="/products" style={{ ...ui.navItem, ...ui.navActive }}>
              Products
            </a>
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
        <header style={ui.header}>
          <div>
            <h1 style={ui.title}>Products</h1>
            <p style={ui.subtitle}>Manage your store inventory</p>
          </div>

          <div style={ui.summaryCard}>
            <div style={ui.summaryIcon}>📦</div>
            <div>
              <div style={ui.summaryLabel}>Total Products</div>
              <div style={ui.summaryValue}>{products.length}</div>
            </div>
          </div>
        </header>

        {/* ACTION BAR */}
        <div style={ui.actionBar}>
          <div style={ui.addBox}>
            {/* CATEGORY */}
            <select
              style={ui.input}
              value={selectedCategory || ""}
              onChange={(e) => handleCategoryChange(Number(e.target.value))}
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.category_id} value={c.category_id}>
                  {c.name} ({c.productCount || 0})
                </option>
              ))}
            </select>

            {/* NEW BRAND */}
            <input
              style={ui.input}
              placeholder="New Brand"
              value={newBrandName}
              onChange={(e) => setNewBrandName(e.target.value)}
            />
            <button onClick={addBrand} style={ui.btnPrimary}>
              + Brand
            </button>

            {/* BRAND SELECT */}
            <select
              style={ui.input}
              onChange={(e) => setNewProductBrand(Number(e.target.value))}
            >
              <option value="">Select Brand</option>
              {brands.map((b) => (
                <option key={b.brand_id} value={b.brand_id}>
                  {b.name}
                </option>
              ))}
            </select>

            {/* PRODUCT NAME */}
            <input
              style={ui.input}
              placeholder="Product name"
              value={newProductName}
              onChange={(e) => setNewProductName(e.target.value)}
            />

            {/* STOCK */}
            <input
              style={ui.input}
              type="number"
              value={newProductStock}
              onChange={(e) => setNewProductStock(Number(e.target.value))}
            />

            <button onClick={addProduct} style={ui.btnPrimary}>
              + Add
            </button>
          </div>

          {/* SEARCH */}
          <input
            style={{ ...ui.input, width: "250px" }}
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* TABLE */}
        <div style={ui.tableContainer}>
          <table style={ui.table}>
            <thead>
              <tr style={ui.thead}>
                <th style={ui.th}>Category</th>
                <th style={ui.th}>Brand</th>
                <th style={ui.th}>Product Name</th>
                <th style={ui.th}>Stocks</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((p) => (
                <tr key={p.product_id}>
                  <td style={ui.td}>
                    {editingId === p.product_id ? (
                      <input
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                      />
                    ) : (
                      <b>{p.name}</b>
                    )}
                  </td>

                  <td style={ui.td}>
                    <button onClick={() => updateStock(p, -1)}>-</button>{" "}
                    {p.stock} <button onClick={() => updateStock(p, +1)}>+</button>
                  </td>

                  <td style={ui.td}>{p.category?.name}</td>
                  <td style={ui.td}>{p.brand?.name}</td>

                  <td style={ui.td}>
                    {editingId === p.product_id ? (
                      <button onClick={() => saveEdit(p.product_id, p)}>Save</button>
                    ) : (
                      <button onClick={() => startEdit(p)}>Edit</button>
                    )}
                    <button onClick={() => deleteProduct(p.product_id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredProducts.length === 0 && (
            <div style={ui.emptyState}>No products found</div>
          )}
        </div>
      </main>
    </div>
  );
}



const ui: { [key: string]: React.CSSProperties } = {
  fullscreenWrapper: { display: "flex", width: "100vw", height: "100vh", fontFamily: "'Inter', sans-serif", overflow: "hidden", background: "#f0f7ff" },
  sidebar: { width: "240px", background: "linear-gradient(180deg, #1e40af 0%, #1e3a8a 100%)", color: "white", padding: "30px 20px", display: "flex", flexDirection: "column", justifyContent: "space-between" },
  logo: { fontSize: "22px", fontWeight: 800, marginBottom: "40px", textAlign: "center" },
  nav: { display: "flex", flexDirection: "column", gap: "8px" },
  navItem: { padding: "12px 15px", color: "#bfdbfe", textDecoration: "none", borderRadius: "10px", fontSize: "14px" },
  navActive: { background: "rgba(255,255,255,0.15)", color: "#fff", fontWeight: 600 },
  logoutBtn: { padding: "12px", background: "#644ceb", color: "white", borderRadius: "10px", cursor: "pointer", fontWeight: 600 },
  mainContent: { flex: 1, padding: "40px", overflowY: "auto" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" },
  title: { fontSize: "28px", color: "#1e3a8a", margin: 0, fontWeight: 800 },
  subtitle: { color: "#60a5fa", margin: "5px 0 0 0" },
  summaryCard: { background: "white", padding: "15px 25px", borderRadius: "15px", display: "flex", alignItems: "center", gap: "15px", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" },
  summaryIcon: { fontSize: "24px", background: "#eff6ff", padding: "10px", borderRadius: "12px" },
  summaryLabel: { fontSize: "12px", color: "#64748b", textTransform: "uppercase", fontWeight: 700 },
  summaryValue: { fontSize: "20px", fontWeight: 800, color: "#1e293b" },
  actionBar: { display: "flex", justifyContent: "space-between", marginBottom: "25px", alignItems: "center" },
  addBox: { display: "flex", gap: "10px", flexWrap: 'wrap', alignItems: 'center' },
  input: { padding: "12px 15px", borderRadius: "10px", border: "1px solid #dbeafe", outline: "none", fontSize: "14px", color: 'black', backgroundColor: 'white' },
  searchIcon: { position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', opacity: 0.3 },
  btnPrimary: { background: "#2563eb", color: "white", border: "none", padding: "0 20px", borderRadius: "10px", fontWeight: 600, cursor: "pointer" },
  tableContainer: { background: "white", borderRadius: "20px", boxShadow: "0 10px 25px rgba(30, 58, 138, 0.05)", overflow: "hidden" },
  table: { width: "100%", borderCollapse: "collapse" },
  thead: { background: "#f8fafc", borderBottom: "1px solid #e2e8f0" },
  th: { padding: "15px 25px", textAlign: "left", fontSize: "12px", color: "#64748b", textTransform: "uppercase" },
  td: { padding: "15px 25px", borderBottom: "1px solid #f1f5f9", fontSize: "14px" },
  idBadge: { background: "#f1f5f9", padding: "4px 8px", borderRadius: "6px", color: "#64748b", fontSize: "12px" },
  btnEdit: { background: "none", border: "1px solid #bfdbfe", color: "#2563eb", padding: "6px 12px", borderRadius: "6px", marginRight: "8px", cursor: "pointer" },
  btnDelete: { background: "none", border: "1px solid #fecaca", color: "#ef4444", padding: "6px 12px", borderRadius: "6px", cursor: "pointer" },
  btnSave: { background: "#16a34a", color: "white", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", marginRight: "8px" },
  btnCancel: { background: "#d1d5db", color: "black", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer" },
  emptyState: { padding: "40px", textAlign: "center", color: "#94a3b8" }
};