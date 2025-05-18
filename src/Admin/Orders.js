import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from 'sweetalert2';


const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [status, setStatus] = useState("");

        // State for cancel confirmation modal
        const [showCancelModal, setShowCancelModal] = useState(false);
        const [orderToCancel, setOrderToCancel] = useState(null);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 5;

    useEffect(() => {
        fetchOrders();
    }, []);

    // ✅ Fetch Orders from Backend
    const fetchOrders = async () => {
        try {
            const response = await axios.get("https://ecommerce-server-v2.onrender.com/api/orders/allOrders");
            setOrders(response.data.orders);
        } catch (err) {
            setError("Error fetching orders. Try again.");
        } finally {
            setLoading(false);
        }
    };

    // ✅ Open Order Details Modal
    const handleShowModal = (order) => {
        setSelectedOrder(order);
        setStatus(order.status);
        setShowModal(true);
    };

    // ✅ Close Modal
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedOrder(null);
    };

    // ✅ Update Order Status
    const updateOrderStatus = async () => {
        if (!selectedOrder) return;
        try {
            await axios.put(
                `https://ecommerce-server-v2.onrender.com/api/orders/updateOrderStatus/${selectedOrder._id}`,
                { status }
            );
            fetchOrders();
            setShowModal(false);
        } catch (err) {
            alert("Failed to update order status!");
        }
    };

    // ✅ Cancel Order (Delete)
    const cancelOrder = async (orderId) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, cancel it!'
        });
    
        if (result.isConfirmed) {
            try {
                await axios.delete(`https://ecommerce-server-v2.onrender.com/api/orders/cancelOrder/${orderId}`);
                fetchOrders();
                Swal.fire('Cancelled!', 'The order has been cancelled.', 'success');
            } catch (err) {
                Swal.fire('Error!', 'Failed to cancel the order!', 'error');
            }
        }
    };

    // Pagination logic
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

    return (
        <div className="container mx-auto p-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">All Orders</h2>

            {loading ? (
                <p className="text-gray-600 text-center">Loading...</p>
            ) : error ? (
                <p className="text-red-500 text-center">{error}</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse shadow-md rounded-lg text-center">
                    <thead className="bg-gradient-to-r from-blue-500 to-blue-700 text-white">
                            <tr>
                                {["Order ID", "User Name", "Total Price", "Payment Method", "Status", "Actions"].map(
                                    (header, index) => (
                                        <th key={index} className="p-4">
                                            {header}
                                        </th>
                                    )
                                )}
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {currentOrders.length > 0 ? (
                                currentOrders.map((order) => (
                                    <tr key={order._id} className="border-b hover:bg-gray-100">
                                        <td className="p-4 text-gray-700">{order._id}</td>
                                        <td className="p-4 text-gray-700">{order.userId?.user_name || "Unknown"}</td>
                                        <td className="p-4 font-semibold text-green-600">₹{order.totalPrice}</td>
                                        <td className="p-4">{order.paymentMethod}</td>
                                        <td className="p-4">
                                            <span
                                                className={`px-3 py-1 text-sm font-semibold rounded-lg ${
                                                    order.status === "Pending"
                                                        ? "bg-yellow-200 text-yellow-800"
                                                        : order.status === "Processing"
                                                        ? "bg-blue-200 text-blue-800"
                                                        : order.status === "Shipped"
                                                        ? "bg-purple-200 text-purple-800"
                                                        : order.status === "Delivered"
                                                        ? "bg-green-200 text-green-800"
                                                        : "bg-red-200 text-red-800"
                                                }`}
                                            >
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <button
                                                className="bg-blue-500 text-white px-3 py-1 rounded-md mr-2 hover:bg-blue-600 transition"
                                                onClick={() => handleShowModal(order)}
                                            >
                                                View/Edit
                                            </button>
                                            <button
                                                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                                                onClick={() => cancelOrder(order._id)}
                                            >
                                                Cancel
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="p-4 text-center text-gray-500">
                                        No orders found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Pagination Controls */}
                    <div className="flex justify-center items-center mt-4">
                        <button
                            className={`px-4 py-2 mx-2 text-white bg-blue-600 rounded-md ${
                                currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
                            }`}
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Prev
                        </button>
                        <span className="text-gray-700 font-semibold mx-2">
                            Page {currentPage} of {Math.ceil(orders.length / ordersPerPage)}
                        </span>
                        <button
                            className={`px-4 py-2 mx-2 text-white bg-blue-600 rounded-md ${
                                indexOfLastOrder >= orders.length ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
                            }`}
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={indexOfLastOrder >= orders.length}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}

            {/* Order Details Modal */}
            {showModal && selectedOrder && (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h3 className="text-xl font-semibold mb-4">Order Details</h3>
            <p><strong>Order ID:</strong> {selectedOrder._id}</p>
            <p><strong>User:</strong> {selectedOrder.userId?.user_name || "Unknown"}</p>
            <p><strong>Total Price:</strong> ₹{selectedOrder.totalPrice}</p>
            <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod}</p>
            <p><strong>Address:</strong> {`${selectedOrder.address.street}, ${selectedOrder.address.city}, ${selectedOrder.address.state}, ${selectedOrder.address.postalCode}`}</p>
            <p className="mt-4"><strong>Ordered Items:</strong></p>
            <ul className="list-disc pl-5">
                {selectedOrder.items.map((item, index) => (
                    <li key={index}>
                        {item.productId?.product_name || "Unknown"} - Qty: {item.quantity}
                    </li>
                ))}
            </ul>
            <div className="mt-4">
                <label className="font-semibold">Update Status:</label>
                <select
                    className="w-full mt-2 p-2 border rounded-md"
                    value={status || selectedOrder?.status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
            </div>

            <div className="flex justify-end mt-4">
                <button 
                    className="bg-gray-400 text-white px-3 py-1 rounded-md mr-2 hover:bg-gray-500 transition"
                    onClick={handleCloseModal}
                >
                    Close
                </button>
                <button 
                    className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition"
                    onClick={updateOrderStatus}
                >
                    Save Changes
                </button>
            </div>
        </div>
    </div>
)}
 {showCancelModal && (
                <div className="fixed inset-0 flex items-start justify-center bg-black bg-opacity-50 pt-20">
                    <div className="bg-white p-4 rounded-lg shadow-lg w-96 text-center">
                        <h3 className="text-lg font-semibold mb-2 text-red-600">Confirm Order Cancellation</h3>
                        <p className="text-gray-700">Are you sure you want to cancel this order?</p>
                        <div className="mt-4 flex justify-center gap-3">
                            <button 
                                className="bg-gray-400 text-white px-3 py-1 rounded-md hover:bg-gray-500 transition"
                                onClick={() => setShowCancelModal(false)}
                            >
                                No
                            </button>
                            <button 
                                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                                onClick={cancelOrder}
                            >
                                Yes, Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Orders;
