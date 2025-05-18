import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Swal from "sweetalert2";


function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart = [], total = 0 } = location.state || { cart: [], total: 0 };

  console.log("Checkout Page - Received State:", location.state);

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (cart.length === 0) {
      navigate("/");
    }
  }, [cart, navigate]);

  const validateForm = () => {
    if (!address.street || !address.city || !address.state || !address.postalCode) {
      alert("Please fill in all address fields.");
      return false;
    }
    if (!/^[0-9]{5,6}$/.test(address.postalCode)) {
      alert("Please enter a valid postal code.");
      return false;
    }
    return true;
  };

  const handlePayment = async () => {
    console.log("Starting Razorpay payment...");
    if (!window.Razorpay) {
      alert("Razorpay SDK not loaded.");
      return;
    }
    try {
      const response = await fetch("https://ecommerce-server-v2.onrender.com/api/payment/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total }),
      });

      if (!response.ok) throw new Error("Payment API error");
      const data = await response.json();

      const options = {
        key: "rzp_test_fRxi4JoLSiD2EZ", // Replace with actual key
        amount: data.amount,
        currency: "INR",
        name: "Your Store",
        description: "Order Payment",
        order_id: data.id,
        handler: async function (response) {
          console.log("Payment successful:", response);
          placeOrder(response.razorpay_payment_id);
        },
        prefill: {
          name: "Your Customer Name",
          email: "customer@example.com",
          contact: "7490983889",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("Payment error:", error);
      alert("Error initiating payment. Try again.");
    }
  };

  const placeOrder = async (paymentId = "") => {
    if (!validateForm()) return;
    setLoading(true);
  
    const userId = localStorage.getItem("userId");
  
    const orderData = {
      userId,
      items: cart,
      totalPrice: total,
      address,
      paymentMethod,
      paymentInfo: paymentMethod === "Online" ? { paymentId, status: "Completed" } : {},
    };
  
    try {
      const response = await fetch("https://ecommerce-server-v2.onrender.com/api/orders/placeOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
  
      if (response.ok) {
        // Show success alert using SweetAlert2
        Swal.fire({
          title: "Order Placed Successfully!",
          text: "Your order has been placed. You will receive a confirmation message shortly.",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          navigate("/"); // Redirect after user clicks OK
        });
      } else {
        Swal.fire({
          title: "Order Failed!",
          text: "Something went wrong. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error placing order:", error);
      Swal.fire({
        title: "Error!",
        text: "There was an error placing your order. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  
    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Payment Method:", paymentMethod);
    if (paymentMethod === "Online") {
      console.log("Calling handlePayment...");
      handlePayment();
    } else {
      console.log("Calling placeOrder...");
      placeOrder();
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>

        {/* Styled Success Message */}
        {successMessage && (
  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative text-center transition-opacity duration-500">
    <strong className="font-bold">Success! </strong>
    <span className="block sm:inline">{successMessage}</span>
  </div>
)}

        {cart.length > 0 ? (
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">Product</th>
                  <th className="border p-2">Quantity</th>
                  <th className="border p-2">Price</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item, index) => (
                  <tr key={index} className="text-center">
                    <td className="border p-2">
                      {item.product_name || item.productId?.product_name || "Unnamed Product"}
                    </td>
                    <td className="border p-2">{item.quantity}</td>
                    <td className="border p-2">
                      ₹{(item.product_price || item.productId?.product_price) * item.quantity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h2 className="text-xl font-bold mt-4">Total: ₹{total}</h2>
          </div>
        ) : (
          <p className="text-red-500">No items in cart.</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Delivery Address</h3>
            <input
              type="text"
              placeholder="Street Address"
              className="input-field"
              value={address.street}
              onChange={(e) => setAddress({ ...address, street: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="City"
              className="input-field"
              value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="State"
              className="input-field"
              value={address.state}
              onChange={(e) => setAddress({ ...address, state: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Postal Code"
              className="input-field"
              value={address.postalCode}
              onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Select Payment Method</label>
            <div className="flex space-x-4">
              {["COD", "Online"].map((method) => (
                <label key={method} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={() => setPaymentMethod(method)}
                  />
                  <span>{method}</span>
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? "Processing..." : "Complete Purchase"}
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default Checkout;
