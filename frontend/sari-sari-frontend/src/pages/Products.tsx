import React, { useEffect, useState } from "react";
import client from "../api/client";
import Sidebar from "../components/Sidebar";

/* ===================== INTERFACES ===================== */
interface Category {
  category_id: number;
  name: string;
}

interface Product {
  product_id: number;
  name: string;
  stock: number;
  price: number;
  category_id: number;
  categoryName?: string;
}

/* ===================== COMPONENT ===================== */
export default function Products() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [debugUser, setDebugUser] = useState<any>(null);
  const [lastResp, setLastResp] = useState<any>(null);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [name, setName] = useState("");
  const [stock, setStock] = useState(0);
  const [price, setPrice] = useState(0);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const API_URL = "http://localhost:3000";

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setDebugUser(payload);
      }
    } catch (e) {}

    fetchCategories();
    fetchProducts();
  }, []);

  /* ===================== FETCH DATA ===================== */
  const fetchCategories = async () => {
    const res = await client.get(`/categories`);
    console.log("API /categories response", res.data);
    setLastResp(res.data);
    setCategories(res.data);
  };

  const fetchProducts = async (catId?: number | null) => {
    const url = catId ? `/products?category_id=${catId}` : `/products`;
    const res = await client.get(url);
    console.log("API /products response", res.data);
    setLastResp(res.data);
    setProducts(res.data);
  };

  /* ===================== ADD PRODUCT ===================== */
  const openAddModal = () => {
    setName("");
    setStock(0);
    setPrice(0);
    setCategoryId(null);
    setShowAddModal(true);
  };

  const addProduct = async () => {
    if (!name || categoryId === null) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      await client.post(`/products`, {
        name,
        stock,
        price,
        category_id: categoryId,
      });

      setShowAddModal(false);
      fetchProducts(selectedCategory);
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to add product.");
    }
  };

  /* ===================== EDIT PRODUCT ===================== */
  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    setName(product.name);
    setStock(product.stock);
    setPrice(product.price);
    setCategoryId(product.category_id);
    setShowEditModal(true);
  };

  const updateProduct = async () => {
    if (!selectedProduct || categoryId === null) return;

    try {
      await client.put(`/products/${selectedProduct.product_id}`, {
        name,
        stock,
        price,
        category_id: categoryId,
      });

      setShowEditModal(false);
      fetchProducts(selectedCategory);
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to update product.");
    }
  };

  /* ===================== DELETE PRODUCT ===================== */
  const openDeleteModal = (product: Product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const deleteProduct = async () => {
    if (!selectedProduct) return;

    try {
      await client.delete(`/products/${selectedProduct.product_id}`);
      setShowDeleteModal(false);
      fetchProducts(selectedCategory);
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to delete product.");
    }
  };

  /* ===================== FILTERS ===================== */
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);

  const getCategoryName = (category_id: number) => {
    const category = categories.find((c) => c.category_id === category_id);
    return category ? category.name : "Unknown";
  };

  return (
    <div style={ui.fullscreenWrapper}>
      <Sidebar activePage="products" />

      <main style={ui.mainContent}>
        <header style={ui.header}>
          <div>
            <h1 style={ui.title}>Products</h1>
            <p style={ui.subtitle}>Manage and monitor your store inventory</p>
          </div>

          <div style={{ display: "flex", gap: "15px" }}>
            <div style={ui.summaryCard}>
              <div style={ui.summaryIcon}>📦</div>
              <div>
                <div style={ui.summaryLabel}>Total Stocks</div>
                <div style={ui.summaryValue}>{totalStock}</div>
              </div>
            </div>

            <div style={ui.summaryCard}>
              <div style={ui.summaryIcon}>💰</div>
              <div>
                <div style={ui.summaryLabel}>Inventory Value</div>
                <div style={ui.summaryValue}>
                  ₱{totalValue.toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </header>

        <div style={ui.actionBar}>
          <div style={ui.addBox}>
            <button onClick={openAddModal} style={ui.btnPrimary}>
              + Add Product
            </button>

            <select
              onChange={(e) => {
                const val = e.target.value ? Number(e.target.value) : null;
                setSelectedCategory(val);
                fetchProducts(val);
              }}
              style={ui.input}
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.category_id} value={c.category_id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ position: "relative" }}>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                ...ui.input,
                width: "300px",
                paddingLeft: "40px",
                backgroundColor: "white",
              }}
            />
            <span style={ui.searchIcon}>🔍</span>
          </div>
        </div>

        <div style={ui.tableContainer}>
          <table style={ui.table}>
            <thead>
              <tr style={ui.thead}>
                <th style={ui.th}>Name</th>
                <th style={ui.th}>Category</th>
                <th style={ui.th}>Price</th>
                <th style={ui.th}>Stock</th>
                <th style={ui.th}>Total Value</th>
                <th style={{ ...ui.th, textAlign: "right" }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((p) => (
                <tr key={p.product_id} style={ui.tr}>
                  <td style={{ ...ui.td, ...ui.productName }}>{p.name}</td>
                  <td style={{ ...ui.td, ...ui.categoryText }}>
                    {p.categoryName || getCategoryName(p.category_id)}
                  </td>
                  <td style={{ ...ui.td, ...ui.priceText }}>
                    ₱{p.price.toFixed(2)}
                  </td>
                  <td style={{ ...ui.td, ...ui.stockText }}>{p.stock}</td>
                  <td style={{ ...ui.td, ...ui.totalValueText }}>
                    ₱{(p.price * p.stock).toLocaleString()}
                  </td>
                  <td style={{ ...ui.td, textAlign: "right" }}>
                    <button style={ui.btnEdit} onClick={() => openEditModal(p)}>
                      Edit
                    </button>
                    <button
                      style={ui.btnDelete}
                      onClick={() => openDeleteModal(p)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredProducts.length === 0 && (
            <div style={ui.emptyState}>No products found.</div>
          )}
        </div>
      </main>

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div style={ui.modalOverlay}>
          <div style={ui.modal}>
            <h3 style={ui.modalTitle}>
              {showEditModal ? "Edit Product" : "Add Product"}
            </h3>

            <input
              placeholder="Product Name"
              style={ui.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <select
              style={ui.input}
              value={categoryId ?? ""}
              onChange={(e) => setCategoryId(Number(e.target.value))}
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.category_id} value={c.category_id}>
                  {c.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Price"
              style={ui.input}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
            />

            <input
              type="number"
              placeholder="Stock"
              style={ui.input}
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
            />

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                style={ui.btnSave}
                onClick={showEditModal ? updateProduct : addProduct}
              >
                Save
              </button>
              <button
                style={ui.btnCancel}
                onClick={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div style={ui.modalOverlay}>
          <div style={ui.modal}>
            <h3 style={ui.modalTitle}>Delete Product</h3>
            <p style={ui.th}>
              Are you sure you want to delete this product?
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button style={ui.btnDelete} onClick={deleteProduct}>
                Delete
              </button>
              <button
                style={ui.btnCancel}
                onClick={() => setShowDeleteModal(false)}
              >
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
  fullscreenWrapper: {
    display: "flex",
    width: "100vw",
    height: "100vh",
    fontFamily: "'Inter', sans-serif",
    overflow: "hidden",
    background: "#f0f7ff",
  },
  mainContent: { flex: 1, padding: "40px", overflowY: "auto" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "30px",
  },
  title: {
    fontSize: "28px",
    color: "#1e3a8a",
    fontWeight: 800,
    margin: 0,
  },
  subtitle: { color: "#60a5fa" },
  summaryCard: {
    background: "white",
    padding: "15px 25px",
    borderRadius: "15px",
    display: "flex",
    gap: "15px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
  },
  summaryIcon: {
    fontSize: "24px",
    background: "#eff6ff",
    padding: "10px",
    borderRadius: "12px",
  },
  summaryLabel: {
    fontSize: "12px",
    color: "#64748b",
    textTransform: "uppercase",
    fontWeight: 700,
  },
  summaryValue: {
    fontSize: "20px",
    fontWeight: 800,
    color: "#1e293b",
  },
  actionBar: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "25px",
    alignItems: "center",
  },
  addBox: { display: "flex", gap: "10px" },
  input: {
    padding: "12px 15px",
    borderRadius: "10px",
    border: "1px solid #dbeafe",
    fontSize: "14px",
    color: "black",
    backgroundColor: "white",
  },
  searchIcon: {
    position: "absolute",
    left: "15px",
    top: "50%",
    transform: "translateY(-50%)",
    opacity: 0.3,
  },
  btnPrimary: {
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "0 20px",
    borderRadius: "10px",
    cursor: "pointer",
  },
  tableContainer: {
    background: "white",
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow: "0 10px 25px rgba(30, 58, 138, 0.05)",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  thead: {
    background: "#f8fafc",
    borderBottom: "1px solid #e2e8f0",
    color: "blue",
  },
  th: {
    padding: "15px 25px",
    textAlign: "left",
    fontSize: "12px",
    color: "blue",
    textTransform: "uppercase",
  },
  tr: { borderBottom: "1px solid #f1f5f9" },
  td: { padding: "15px 25px", fontSize: "14px" },
  btnEdit: {
    border: "1px solid #bfdbfe",
    color: "#2563eb",
    padding: "6px 12px",
    borderRadius: "6px",
    marginRight: "8px",
    cursor: "pointer",
    background: "none",
  },
  btnDelete: {
    border: "1px solid #fecaca",
    color: "#ef4444",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    background: "none",
  },
  emptyState: {
    padding: "40px",
    textAlign: "center",
    color: "#94a3b8",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.4)",
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
  modalTitle: {
    fontSize: "18px",
    fontWeight: 700,
    color: "#1e3a8a",
  },
  btnSave: {
    background: "#16a34a",
    color: "white",
    border: "none",
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
    flex: 1,
  },
  btnCancel: {
    background: "#d1d5db",
    color: "black",
    border: "none",
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
    flex: 1,
  },

  productName: {
  color: "#1e3a8a", // dark blue
  fontWeight: 600,
},
categoryText: {
  color: "#2563eb", // blue
},
priceText: {
  color: "#7c3aed", // purple
},
stockText: {
  color: "#ea580c", // orange
},
totalValueText: {
  color: "#16a34a", // green
  fontWeight: "bold",
},
};
