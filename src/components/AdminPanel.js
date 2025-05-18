import React from "react";
import { Link, Routes, Route, useNavigate } from "react-router-dom";
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import ProductPage from "./ProductPage"; // Import Product Page Component

function AdminPanel() {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-blue-800 text-white">
        <div className="flex items-center">
          <img src="logo.webp" alt="Website Logo" className="w-12 h-12 mr-4" />
          <h1 className="text-2xl font-bold">ElectroHub</h1>
        </div>

        {/* Search Bar */}
        <div className="flex items-center max-w-sm mx-4">
          <MagnifyingGlassIcon className="w-7 h-7 text-white-500 mr-4" />
          <input
            type="text"
            placeholder="Search Products, Categories, Users..."
            className="w-full p-2 rounded border border-gray-300 text-gray-900 bg-white"
          />
        </div>

        <div className="flex items-center space-x-4">
          <span>Admin</span>
          <img src="cart.png" alt="Cart" className="w-8 h-8" />
        </div>
      </header>

      {/* Layout with Sidebar and Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 text-white flex flex-col p-6 h-screen">
          <h2 className="text-2xl font-bold text-primary mb-7">Admin Panel</h2>
          <ul className="space-y-4">
            <li>
              <Link to="/admin/dashboard" className="text-lg text-gray-300 hover:text-white">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/admin/products" className="text-lg text-gray-300 hover:text-white">
                Products
              </Link>
            </li>
            <li>
              <Link to="/admin/categories" className="text-lg text-gray-300 hover:text-white">
                Categories
              </Link>
            </li>
            <li>
              <Link to="/admin/users" className="text-lg text-gray-300 hover:text-white">
                Users
              </Link>
            </li>
            <li>
              <Link to="/admin/orders" className="text-lg text-gray-300 hover:text-white">
                Orders
              </Link>
            </li>
            <li>
              <button onClick={handleLogout} className="text-lg text-gray-300 hover:text-white mt-8">
                Logout
              </button>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="flex-grow p-8 bg-white">
          <Routes>
            <Route path="/admin/dashboard" element={<h1 className="text-4xl font-bold text-primary mb-4">Dashboard</h1>} />
            <Route path="/admin/products" element={<ProductPage />} />
            <Route path="/admin/categories" element={<h2>Categories Page</h2>} />
            <Route path="/admin/users" element={<h2>Users Page</h2>} />
            <Route path="/admin/orders" element={<h2>Orders Page</h2>} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
