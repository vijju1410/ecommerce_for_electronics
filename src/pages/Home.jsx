import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function Home() {
  const [products, setProducts] = useState([]);
  const [userId, setUserId] = useState(null);
  const [cartItems, setCartItems] = useState(new Set());
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

        sessionStorage.setItem("cartCount", cartProducts.length);
        window.dispatchEvent(new Event("storage"));
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

      Swal.fire({
        icon: "success",
        title: "Added to Cart",
        text: "The product has been added to your cart successfully!",
        showConfirmButton: false,
        timer: 2200,
      });

      const cartResponse = await axios.get(
        `https://ecommerce-server-v2.onrender.com/api/cart/getCart/${userId}`
      );
      const updatedCartProducts = cartResponse.data.cart.products.map(
        (p) => p.productId._id
      );

      setCartItems(new Set(updatedCartProducts));

      sessionStorage.setItem("cartCount", updatedCartProducts.length);
      window.dispatchEvent(new Event("storage"));
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to add product to cart!",
      });
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-primary text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Welcome to ElectroHub
            </h1>
            <p className="text-xl mb-8">
              Discover the latest in electronics and new products.
            </p>
            <Link
              to="/products"
              className="bg-white text-primary px-8 py-3 rounded-md font-semibold hover:bg-gray-100"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Featured Products</h2>

          {loading ? (
            <p className="text-center text-gray-500 text-lg">Loading...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {products.length > 0 ? (
                products.map((product) => (
                  <div
                    key={product._id}
                    className="bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-105 transition duration-300 ease-in-out"
                  >
                    <img
                      src={product.product_image}
                      alt={product.product_name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <span className="text-sm text-gray-500">
                        {product.category}
                      </span>
                      <h3 className="text-xl font-semibold mb-2">
                        {product.product_name}
                      </h3>
                      <p className="text-primary font-bold">
                        ₹{product.product_price}
                      </p>

                      <button
                        className={`w-full mt-4 py-2 rounded-md transition ${
                          cartItems.has(product._id)
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-primary text-white hover:bg-primary-dark"
                        }`}
                        onClick={() => handleAddToCart(product._id)}
                        disabled={cartItems.has(product._id)}
                      >
                        {cartItems.has(product._id) ? "Added" : "Add to Cart"}
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">
                  No products available.
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["Smartphones", "Laptops", "Audio", "TVs"].map((category) => (
              <Link
                key={category}
                to="/categories"
                className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-semibold">{category}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="mb-8">
            Subscribe to our newsletter for the latest products and deals
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="input-field flex-grow"
            />
            <button className="btn-primary whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
