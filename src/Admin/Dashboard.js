import React, { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0); // State to store total products
  const [pendingOrders, setPendingOrders] = useState(0);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token"); // Fetch JWT token from local storage

        // Fetch total users
        const usersResponse = await axios.get("https://ecommerce-server-v2.onrender.com/api/totalUsers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTotalUsers(usersResponse.data.totalUsers);

        // Fetch total orders
        const ordersResponse = await axios.get("https://ecommerce-server-v2.onrender.com/api/orders/totalOrders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTotalOrders(ordersResponse.data.totalOrders);

        // Fetch total products
        const productsResponse = await axios.get("https://ecommerce-server-v2.onrender.com/api/products/totalProducts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTotalProducts(productsResponse.data.totalProducts);

        // Fetch pending orders
        const pendingResponse = await axios.get("https://ecommerce-server-v2.onrender.com/api/orders/pendingOrders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPendingOrders(pendingResponse.data.pendingOrders);

        // Fetch recent orders
        const recentOrdersResponse = await axios.get("https://ecommerce-server-v2.onrender.com/api/orders/recentOrders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecentOrders(recentOrdersResponse.data.orders);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex-1 p-8">
      <div className="bg-white p-6 rounded-lg shadow-md mb-6 min-h-[500px]">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          {/* Total Users Card */}
          <div className="bg-blue-100 p-8 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
            <h3 className="text-xl font-semibold text-gray-700">Total Users</h3>
            <p className="text-3xl font-bold text-gray-900">{totalUsers}</p>
          </div>

          {/* Total Orders Card */}
          <div className="bg-green-100 p-8 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
            <h3 className="text-xl font-semibold text-gray-700">Total Orders</h3>
            <p className="text-3xl font-bold text-gray-900">{totalOrders}</p>
          </div>

          {/* Total Products Card */}
          <div className="bg-purple-100 p-8 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
            <h3 className="text-xl font-semibold text-gray-700">Total Products</h3>
            <p className="text-3xl font-bold text-gray-900">{totalProducts}</p>
          </div>

          {/* Pending Orders Card */}
          <div className="bg-red-100 p-8 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
            <h3 className="text-xl font-semibold text-gray-700">Pending Orders</h3>
            <p className="text-3xl font-bold text-gray-900">{pendingOrders}</p>
          </div>
        </div>

        {/* Recent Orders Section */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md mt-6">
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">Recent Orders</h3>
          {recentOrders.length === 0 ? (
            <p className="text-gray-600">No recent orders to display.</p>
          ) : (
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">Order ID</th>
                  <th className="px-6 py-3">Customer Name</th>
                  <th className="px-6 py-3">Total Price</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Order Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order.orderId} className="bg-white border-b">
                    <td className="px-6 py-4">{order.orderId}</td>
                    <td className="px-6 py-4">{order.username}</td>
                    <td className="px-6 py-4">₹{order.totalPrice}</td>
                    <td className="px-6 py-4">{order.status}</td>
                    <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
