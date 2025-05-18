import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const OrderDetails = () => {
  const { orderId } = useParams();  // Get orderId from URL
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch order details when the component mounts
  useEffect(() => {
    console.log("useEffect triggered with orderId:", orderId);  // Log orderId

    const fetchOrderDetails = async () => {
      try {
        console.log("Making API request for orderId:", orderId);  // Log before the API call
        
        const response = await axios.get(`https://ecommerce-server-v2.onrender.com/api/orders/getUserOrders/${orderId}`);
        console.log("API Response:", response.data);  // Log the full response

        if (response.data.orders && response.data.orders.length > 0) {
          setOrder(response.data.orders[0]);  // Set the order data
        } else {
          console.log('No orders found for this orderId:', orderId);  // Add debug log
          setError('Order not found');
        }

        setLoading(false);
      } catch (err) {
        setError('Error fetching order details');
        setLoading(false);
        console.error('Error fetching data:', err);  // Log any error
      }
    };

    fetchOrderDetails();
  }, [orderId]);  // Depend on orderId to refetch if it changes

  // Show loading text while data is fetching
  if (loading) {
    return <div>Loading...</div>;
  }

  // Show error if something went wrong
  if (error) {
    return <div>{error}</div>;
  }

  // If we have the order data, display it
  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">Order Details</h2>
      
      {order ? (
        <div>
          <p><strong>Order ID:</strong> {order._id}</p>
          <p><strong>User Name:</strong> {order.userId?.user_name || 'N/A'}</p>
          <p><strong>Total Price:</strong> ${order.totalPrice}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Address:</strong> {order.address}</p>
          <p><strong>Payment Method:</strong> {order.paymentMethod}</p>

          {/* Display items */}
          <h3 className="mt-4 text-xl font-semibold">Items</h3>
          <ul>
            {order.items && order.items.length > 0 ? (
              order.items.map(item => (
                <li key={item.productId._id}>
                  {item.productId.product_name} (x{item.quantity})
                </li>
              ))
            ) : (
              <p>No items found</p>
            )}
          </ul>
        </div>
      ) : (
        <div>Order not found.</div>
      )}
    </div>
  );
};

export default OrderDetails;
