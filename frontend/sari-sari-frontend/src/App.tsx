import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Categories from "./pages/Categories";
import Products from "./pages/Products"; // only if this file exists
import Sales from "./pages/Sales";       // only if this file exists
import Utang from "./pages/Utang";       // only if this file exists
import Expenses from "./pages/Expenses"; // only if this file exists

import ProtectedRoute from "./components/ProtectedRoute";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/categories"
          element={
            <ProtectedRoute>
              <Categories />
            </ProtectedRoute>
          }
        />

        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <Products /> {/* replace with placeholder <div>Products Page</div> if not ready */}
            </ProtectedRoute>
          }
        />

        <Route
          path="/sales"
          element={
            <ProtectedRoute>
              <Sales /> {/* or <div>Sales Page</div> */}
            </ProtectedRoute>
          }
        />

        <Route
          path="/utang"
          element={
            <ProtectedRoute>
              <Utang /> {/* or <div>Utang Page</div> */}
            </ProtectedRoute>
          }
        />

        <Route
          path="/expenses"
          element={
            <ProtectedRoute>
              <Expenses /> {/* or <div>Expenses Page</div> */}
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;