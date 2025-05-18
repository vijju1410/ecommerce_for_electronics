import React from "react";
import { Link } from "react-router-dom";
import { FaTachometerAlt, FaBox, FaClipboardList, FaShoppingCart, FaCreditCard, FaUsers, FaSignOutAlt, FaUserCircle } from "react-icons/fa"; // Importing icons from React Icons

function AdminPanel() {
  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col p-6 h-screen">
      <h2 className="text-2xl font-bold text-primary mb-7">Admin Panel</h2>

      {/* Admin Profile Section */}
      <div className="flex items-center mb-8">
        <img
          src="/vijay.jpg" // Correct path to the image in the public folder
          alt="Admin"
          className="w-12 h-12 rounded-full mr-4"
        />
        <div>
          <h3 className="text-xl font-semibold">Vijay Prajapati</h3> {/* Replace with actual admin name */}
        </div>
      </div>

      {/* Sidebar Menu */}
      <ul className="space-y-4 flex-grow">
        <li>
          <Link to="/admin/Dashboard" className="text-lg text-gray-300 hover:text-white flex items-center">
            <FaTachometerAlt className="mr-3" /> Dashboard
          </Link>
        </li>
        <li>
          <Link to="/admin/products" className="text-lg text-gray-300 hover:text-white flex items-center">
            <FaBox className="mr-3" /> Products
          </Link>
        </li>
        <li>
          <Link to="/admin/orders" className="text-lg text-gray-300 hover:text-white flex items-center">
            <FaClipboardList className="mr-3" /> Orders
          </Link>
        </li>
        <li>
          <Link to="/admin/CategoryManagement" className="text-lg text-gray-300 hover:text-white flex items-center">
            <FaShoppingCart className="mr-3" /> Category
          </Link>
        </li>
        <li>
          <Link to="/admin/payments" className="text-lg text-gray-300 hover:text-white flex items-center">
            <FaCreditCard className="mr-3" /> Payments
          </Link>
        </li>
        <li>
          <Link to="/admin/users" className="text-lg text-gray-300 hover:text-white flex items-center">
            <FaUsers className="mr-3" /> Users
          </Link>
        </li>
        {/* My Profile Menu Item */}
        <li>
          <Link to="/admin/profile" className="text-lg text-gray-300 hover:text-white flex items-center">
            <FaUserCircle className="mr-3" /> My Profile
          </Link>
        </li>
      </ul>

      {/* Logout */}
      <div className="mt-auto">
        <Link to="/" className="text-lg text-red-500 hover:text-red-700 flex items-center">
          <FaSignOutAlt className="mr-3" /> Logout
        </Link>
      </div>
    </div>
  );
}

export default AdminPanel;
