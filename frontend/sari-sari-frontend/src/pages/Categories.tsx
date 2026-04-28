import React, { useEffect, useState } from "react";
import client from "../api/client";
import Sidebar from "../components/Sidebar";

interface Category {
  category_id: number;
  name: string;
  productCount: number;
  totalStock: number;
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");

  // --- FETCH CATEGORIES ---
  const fetchCategories = async () => {
    try {
      const res = await client.get(`/categories`);

      const mappedCategories = res.data.map((cat: any) => ({
        category_id: cat.category_id ?? cat.category_category_id,
        name: cat.name ?? cat.category_name,
        productCount: Number(
          cat.productCount ?? cat.category_productCount ?? 0
        ),
        totalStock: Number(cat.totalStock ?? 0),
      }));

      setCategories(mappedCategories);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // --- ADD CATEGORY ---
  const addCategory = () => {
    if (!newCategory.trim()) return;

    client
      .post(`/categories`, { name: newCategory })
      .then(() => {
        setNewCategory("");
        fetchCategories();
      })
      .catch((err) => console.error(err));
  };

  // --- DELETE CATEGORY ---
  const deleteCategory = (id: number) => {
    if (!confirm("Delete this category?")) return;

    client
      .delete(`/categories/${id}`)
      .then(() => fetchCategories())
      .catch((err) => console.error(err));
  };

  // --- EDIT CATEGORY ---
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

    client
      .put(`/categories/${id}`, { name: editingName })
      .then(() => {
        cancelEdit();
        fetchCategories();
      })
      .catch((err) => console.error(err));
  };

  // --- FILTER CATEGORIES ---
  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={ui.fullscreenWrapper}>
      <Sidebar activePage="categories" />

      <main style={ui.mainContent}>
        <header style={ui.header}>
          <div>
            <h1 style={ui.title}>Categories</h1>

            <p style={ui.subtitle}>
              Manage and organize your inventory groupings
            </p>
          </div>
        </header>

        <div style={ui.actionBar}>
          <div style={ui.addBox}>
            <input
              type="text"
              placeholder="Enter new category name..."
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              style={ui.input}
            />

            <button onClick={addCategory} style={ui.btnPrimary}>
              + Add Category
            </button>
          </div>

          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ ...ui.input, width: "300px" }}
          />
        </div>

        <div style={ui.tableContainer}>
          <table style={ui.table}>
            <thead>
              <tr style={ui.thead}>
                <th style={ui.th}>ID</th>
                <th style={ui.th}>Category Name</th>
                <th style={ui.th}>Products Count</th>
                <th style={ui.th}>Stock Count</th>

                <th style={{ ...ui.th, textAlign: "right" }}>
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredCategories.map((cat) => (
                <tr key={cat.category_id} style={ui.tr}>
                  <td style={{ ...ui.td, color: "#2563eb" }}>
                    #{cat.category_id}
                  </td>

                  <td style={{ ...ui.td, color: "#1e3a8a" }}>
                    {editingId === cat.category_id ? (
                      <input
                        autoFocus
                        value={editingName}
                        onChange={(e) =>
                          setEditingName(e.target.value)
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter")
                            saveEdit(cat.category_id);

                          if (e.key === "Escape")
                            cancelEdit();
                        }}
                        style={{ ...ui.input, width: "70%" }}
                      />
                    ) : (
                      cat.name
                    )}
                  </td>

                  <td
                    style={{
                      ...ui.td,
                      color: "#16a34a",
                      fontWeight: 600,
                    }}
                  >
                    {cat.productCount}
                  </td>

                  <td
                    style={{
                      ...ui.td,
                      color: "#dc2626",
                      fontWeight: 600,
                    }}
                  >
                    {cat.totalStock}
                  </td>

                  <td style={{ ...ui.td, textAlign: "right" }}>
                    {editingId === cat.category_id ? (
                      <>
                        <button
                          style={ui.btnSave}
                          onClick={() =>
                            saveEdit(cat.category_id)
                          }
                        >
                          Save
                        </button>

                        <button
                          style={ui.btnCancel}
                          onClick={cancelEdit}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          style={ui.btnEdit}
                          onClick={() => startEdit(cat)}
                        >
                          Edit
                        </button>

                        <button
                          style={ui.btnDelete}
                          onClick={() =>
                            deleteCategory(cat.category_id)
                          }
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
            <div style={ui.emptyState}>
              No categories found matching your search.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// --- UI ---
const ui: { [key: string]: React.CSSProperties } = {
  fullscreenWrapper: {
    display: "flex",
    width: "100vw",
    height: "100vh",
    fontFamily: "'Inter', sans-serif",
    overflow: "hidden",
    background: "#f0f7ff",
  },

  mainContent: {
    flex: 1,
    padding: "40px",
    overflowY: "auto",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },

  title: {
    fontSize: "28px",
    color: "#1e3a8a",
    margin: 0,
    fontWeight: 800,
  },

  subtitle: {
    color: "#60a5fa",
    margin: "5px 0 0 0",
  },

  actionBar: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "25px",
    alignItems: "center",
  },

  addBox: {
    display: "flex",
    gap: "10px",
  },

  input: {
    padding: "12px 15px",
    borderRadius: "10px",
    border: "1px solid #dbeafe",
    outline: "none",
    fontSize: "14px",
    color: "black",
    backgroundColor: "white",
  },

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

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  thead: {
    background: "#f8fafc",
    borderBottom: "1px solid #e2e8f0",
  },

  th: {
    padding: "15px 25px",
    textAlign: "left",
    fontSize: "12px",
    color: "#64748b",
    textTransform: "uppercase",
  },

  td: {
    padding: "15px 25px",
    borderBottom: "1px solid #f1f5f9",
    fontSize: "14px",
  },

  tr: {},

  btnEdit: {
    background: "none",
    border: "1px solid #bfdbfe",
    color: "#2563eb",
    padding: "6px 12px",
    borderRadius: "6px",
    marginRight: "8px",
    cursor: "pointer",
  },

  btnDelete: {
    background: "none",
    border: "1px solid #fecaca",
    color: "#ef4444",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
  },

  btnSave: {
    background: "#16a34a",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    marginRight: "8px",
  },

  btnCancel: {
    background: "#d1d5db",
    color: "black",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer",
  },

  emptyState: {
    padding: "40px",
    textAlign: "center",
    color: "#94a3b8",
  },
};