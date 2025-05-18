import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const userId = sessionStorage.getItem("userId") || localStorage.getItem("userId");

  const fetchCart = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const response = await axios.get(`https://ecommerce-server-v2.onrender.com/api/cart/getCart/${userId}`);
      setCartItems(response.data.cart.products || []);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }
    fetchCart();
  }, [userId, navigate, fetchCart]);

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.productId._id === productId ? { ...item, updating: true } : item
      )
    );
    
    try {
      await axios.put('https://ecommerce-server-v2.onrender.com/api/cart/updateCart', {
        userId,
        productId,
        quantity: newQuantity
      });
      
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.productId._id === productId
            ? { ...item, quantity: newQuantity, updating: false }
            : item
        )
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.productId._id === productId ? { ...item, updating: false } : item
        )
      );
    }
  };

  const removeItem = async (productId) => {
    try {
      await axios.delete('https://ecommerce-server-v2.onrender.com/api/cart/removeFromCart', {
        data: { userId, productId }
      });
      setCartItems(prevItems => prevItems.filter(item => item.productId._id !== productId));
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const total = cartItems.reduce((sum, item) => sum + (item.productId.product_price * item.quantity), 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      {loading ? (
        <p className="text-center text-gray-600">Loading cart items...</p>
      ) : cartItems.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-xl text-gray-600">Your cart is empty</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {cartItems.map(item => (
              <div key={item.productId._id} className="flex items-center gap-4 border-b py-4">
                <img
                  src={item.productId.product_image}
                  alt={item.productId.product_name}
                  className="w-24 h-24 object-cover rounded"
                />
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold">{item.productId.product_name}</h3>
                  <p className="text-primary font-bold">₹{item.productId.product_price}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center border rounded">
                      <button
                        onClick={() => updateQuantity(item.productId._id, item.quantity - 1)}
                        className="px-3 py-1 hover:bg-gray-100"
                        disabled={item.quantity === 1 || item.updating}
                      >
                        -
                      </button>
                      <span className="px-3 py-1 border-x">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId._id, item.quantity + 1)}
                        className="px-3 py-1 hover:bg-gray-100"
                        disabled={item.updating}
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-gray-50 p-6 rounded-lg h-fit">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t pt-2 font-bold">
                <div className="flex justify-between">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate('/checkout', { state: { cart: cartItems, total } })}
              className="btn-primary w-full"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
