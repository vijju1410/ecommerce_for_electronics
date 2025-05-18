import React, { useEffect, useState } from "react"; 
import axios from "axios";
import Swal from "sweetalert2";
import { 
    FaBox, FaMapMarkerAlt, FaRupeeSign, FaCheckCircle, 
    FaClock, FaTimesCircle 
} from "react-icons/fa";

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!userId || !token) {
            setError("User ID or Token is missing!");
            setLoading(false);
            return;
        }

        const fetchOrders = async () => {
            try {
                const response = await axios.get(`https://ecommerce-server-v2.onrender.com/api/orders/getUserOrders/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setOrders(response.data.orders);
            } catch (error) {
                setError("Failed to load order history.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [userId, token]);

    const cancelOrder = async (orderId) => {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you really want to cancel this order?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, cancel it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await axios.delete(`https://ecommerce-server-v2.onrender.com/api/orders/cancelOrder/${orderId}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    Swal.fire("Order Cancelled!", response.data.message, "success");

                    setOrders((prevOrders) => prevOrders.filter(order => order._id !== orderId));
                } catch (error) {
                    Swal.fire("Error!", "Failed to cancel order. Please try again.", "error");
                }
            }
        });
    };

    if (loading) {
        return <p className="text-center text-gray-600 mt-10 text-lg animate-pulse">Loading...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500 mt-10 text-lg">{error}</p>;
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
            <div className="bg-white border border-gray-300 shadow-lg rounded-lg p-6 w-full max-w-3xl">
                <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">My Orders</h2>

                <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50">
                    {orders.length > 0 ? (
                        orders.map((order) => (
                            <div key={order._id} className="p-4 mb-4 border-b border-gray-300 bg-white shadow-sm rounded-lg">
                                <div className="flex justify-between items-center">
                                    <p className="text-lg font-medium text-gray-800">
                                        <FaBox className="inline-block text-blue-500 mr-2" />
                                        Order ID: <span className="text-gray-700">{order.orderId}</span>
                                    </p>
                                    <span className={`text-sm font-semibold ${order.status === "Delivered" ? "text-green-600" : "text-yellow-500"}`}>
                                        {order.status === "Delivered" ? <FaCheckCircle className="inline-block mr-1" /> : <FaClock className="inline-block mr-1" />}
                                        {order.status}
                                    </span>
                                </div>

                                <p className="text-sm text-gray-600 mt-1">
                                    <FaRupeeSign className="inline-block text-green-500 mr-1" />
                                    Total: ₹{order.totalPrice}
                                </p>
                                <p className="text-sm text-gray-600">Payment: {order.paymentMethod}</p>
                                <p className="text-xs text-gray-500">Date: {new Date(order.createdAt).toLocaleString()}</p>

                                <p className="text-sm text-gray-600 flex items-center mt-2">
                                    <FaMapMarkerAlt className="mr-2 text-red-500" />
                                    {order.address?.street}, {order.address?.city}, {order.address?.state} - {order.address?.postalCode}
                                </p>

                                <div className="mt-2">
                                    <h3 className="text-md font-semibold text-gray-800">Items:</h3>
                                    <ul className="list-disc list-inside text-sm text-gray-700">
                                        {order.items.map((item) => (
                                            <li key={item.productId}>
                                                {item.productName} - {item.quantity} pcs
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {order.status !== "Delivered" && (
                                    <button
                                        onClick={() => cancelOrder(order._id)}
                                        className="mt-4 bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-sm flex items-center"
                                    >
                                        <FaTimesCircle className="mr-2" /> Cancel Order
                                    </button>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center text-sm">No orders found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyOrders;
