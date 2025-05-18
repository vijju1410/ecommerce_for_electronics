import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // Import SweetAlert2

function ProductPage() {
  const [products, setProducts] = useState([]);
  const [userId, setUserId] = useState(null);
  const [cartItems, setCartItems] = useState(new Set()); // Track cart items
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserId =
      sessionStorage.getItem("userId") || localStorage.getItem("userId");

    if (!storedUserId) {
      navigate("/login");
      return;
    }

    setUserId(storedUserId);

    // Fetch products and cart data
    const fetchData = async () => {
      try {
        const [productResponse, cartResponse] = await Promise.all([
          axios.get("https://ecommerce-server-v2.onrender.com/api/products/getProduct"),
          axios.get(`https://ecommerce-server-v2.onrender.com/api/cart/getCart/${storedUserId}`),
        ]);

        setProducts(productResponse.data.data);
        const cartProducts = cartResponse.data.cart.products.map(
          (p) => p.productId._id
        );
        setCartItems(new Set(cartProducts));

        // Update sessionStorage with cart count
        sessionStorage.setItem("cartCount", cartProducts.length);
        window.dispatchEvent(new Event("storage")); // Trigger update in Header
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleAddToCart = async (productId) => {
    if (!userId) {
      Swal.fire({
        icon: "warning",
        title: "Login Required",
        text: "Please log in to add products to the cart.",
      });
      return;
    }

    try {
      await axios.post("https://ecommerce-server-v2.onrender.com/api/cart/addToCart", {
        userId,
        productId,
        quantity: 1,
      });

      // SweetAlert2 popup
      Swal.fire({
        icon: "success",
        title: "Added to Cart",
        text: "The product has been added to your cart successfully!",
        showConfirmButton: false,
        timer: 2200, // Auto close after 1.5 seconds
      });

      // Fetch updated cart data after adding an item
      const cartResponse = await axios.get(
        `https://ecommerce-server-v2.onrender.com/api/cart/getCart/${userId}`
      );
      const updatedCartProducts = cartResponse.data.cart.products.map(
        (p) => p.productId._id
      );

      setCartItems(new Set(updatedCartProducts)); // Update cart items

      // Update sessionStorage with cart count
      sessionStorage.setItem("cartCount", updatedCartProducts.length);
      window.dispatchEvent(new Event("storage")); // Trigger update in Header
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to add product to cart!",
      });
    }
  };

  const handleBuyNow = (product) => {
    navigate("/checkout", {
      state: {
        cart: [{ 
          _id: product._id, 
          product_name: product.product_name, 
          product_price: product.product_price, 
          quantity: 1 
        }], 
        total: product.product_price,
      },
    });
  };
  return (
    <div>
      <Header /> {/* No need to pass cartCount */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Our Products</h1>

        {loading ? (
          <p className="text-center text-gray-500 text-lg">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.length > 0 ? (
              products.map((product) => (
                <div
                  key={product._id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition duration-300 ease-in-out"
                >
                  <img
                    src={product.product_image}
                    alt={product.product_name}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {product.product_name}
                    </h3>
                    <p className="text-gray-500 mb-4">
                      {product.product_description}
                    </p>
                    <p className="text-primary font-bold text-lg">
                      ₹{product.product_price}
                    </p>

                    {product.stock === 0 ? (
                      <p className="text-red-600 font-semibold">Out of Stock</p>
                    ) : (
                      <div className="flex gap-2 mt-4">
                        <button
                          className={`w-1/2 py-2 rounded-md transition ${
                            cartItems.has(product._id)
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-primary text-white hover:bg-primary-dark"
                          }`}
                          onClick={() => handleAddToCart(product._id)}
                          disabled={cartItems.has(product._id)}
                        >
                          {cartItems.has(product._id) ? "Added" : "Add to Cart"}
                        </button>
                        <button
  className="w-1/2 py-2 rounded-md bg-green-500 text-white hover:bg-green-600 transition"
  onClick={() => handleBuyNow(product)}
>
  Buy Now
</button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No products available.</p>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default ProductPage;
