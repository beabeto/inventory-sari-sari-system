import React, { useEffect, useState } from "react";
import axios from "axios";

interface Category {
  category_id: number;
  name: string;
}

interface Product {
  product_id: number;
  name: string;
  stock: number;
  category_id: number;
  price?: number;
}

export default function Products() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [stock, setStock] = useState(0);
  const [price, setPrice] = useState(0);

  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    const res = await axios.get("http://localhost:3000/categories");
    setCategories(res.data);
  };

  const fetchProducts = async (catId?: number) => {
    const url = catId
      ? `http://localhost:3000/products?category_id=${catId}`
      : "http://localhost:3000/products";
    const res = await axios.get(url);
    setProducts(res.data);
  };

  const addProduct = async () => {
    if (!name || selectedCategory === null) return alert("Fill all fields");

    await axios.post("http://localhost:3000/products", {
      name,
      stock,
      price,
      category_id: selectedCategory,
    });

    setShowModal(false);
    setName("");
    setStock(0);
    setPrice(0);

    fetchProducts(selectedCategory);
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);

  return (
    <div className="flex h-screen bg-blue-50 font-sans">
      {/* Sidebar */}
      <aside className="w-60 bg-blue-900 text-white p-5 flex flex-col justify-between">
        <div>
          <h1 className="text-xl font-bold mb-10">Sari-sari Store</h1>
          <nav className="space-y-2">
            {["Dashboard", "Categories", "Products", "Sales"].map((item) => (
              <div
                key={item}
                className={`p-3 rounded-lg cursor-pointer ${
                  item === "Products"
                    ? "bg-blue-500"
                    : "text-blue-200 hover:bg-blue-700"
                }`}
              >
                {item}
              </div>
            ))}
          </nav>
        </div>

        <button className="bg-indigo-500 p-2 rounded-lg hover:bg-indigo-600">
          Logout
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-900">Products</h2>
          <div className="bg-white px-6 py-3 rounded-xl shadow">
            <p className="text-sm text-gray-500">Total Stocks</p>
            <p className="text-xl font-bold">{totalStock}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between mb-4">
          <div className="flex gap-3">
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              + Add Product
            </button>

            <select
              onChange={(e) => {
                const val = Number(e.target.value);
                setSelectedCategory(val);
                fetchProducts(val);
              }}
              className="px-3 py-2 rounded-lg border"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.category_id} value={c.category_id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 rounded-full border w-60"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow overflow-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Total</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.product_id} className="border-t">
                  <td className="p-4">{p.name}</td>
                  <td className="p-4">₱{p.price || 0}</td>
                  <td className="p-4">{p.stock}</td>
                  <td className="p-4 font-semibold">
                    ₱{(p.price || 0) * p.stock}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-80 space-y-3">
            <h3 className="font-bold text-lg">Add Product</h3>

            <input
              placeholder="Name"
              className="w-full border p-2 rounded"
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="number"
              placeholder="Price"
              className="w-full border p-2 rounded"
              onChange={(e) => setPrice(Number(e.target.value))}
            />

            <input
              type="number"
              placeholder="Stock"
              className="w-full border p-2 rounded"
              onChange={(e) => setStock(Number(e.target.value))}
            />

            <div className="flex gap-2">
              <button
                onClick={addProduct}
                className="flex-1 bg-blue-600 text-white p-2 rounded"
              >
                Add
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-400 text-white p-2 rounded"
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

