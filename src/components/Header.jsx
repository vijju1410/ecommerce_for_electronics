import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCartIcon, UserIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    if (token) {
      fetchCartCount();
    }

    // Listen for cart updates and re-render
    const updateCartCount = () => {
      const storedCartCount = sessionStorage.getItem("cartCount");
      setCartCount(storedCartCount ? parseInt(storedCartCount, 10) : 0);
    };

    window.addEventListener("storage", updateCartCount);
    return () => window.removeEventListener("storage", updateCartCount);
  }, []);

  const fetchCartCount = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      const response = await fetch(`https://ecommerce-server-v2.onrender.com/api/cart/getCart/${userId}`);
      const data = await response.json();

      if (response.ok) {
        setCartCount(data.cart.products.length);
        sessionStorage.setItem("cartCount", data.cart.products.length);
        
        // 🔹 Ensure real-time update
        window.dispatchEvent(new Event("storage"));
      } else {
        console.error("Failed to fetch cart:", data.message);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.removeItem("cartCount");
    setIsLoggedIn(false);
    setCartCount(0);
    navigate("/");

    // 🔹 Ensure cart updates immediately after logout
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <header className="bg-white shadow-md">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-primary">ElectroHub</Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-primary">Home</Link>
            <Link to="/products" className="hover:text-primary">Products</Link>
            <Link to="/categories" className="hover:text-primary">Categories</Link>
            <Link to="/about" className="hover:text-primary">About</Link>
            <Link to="/contact" className="hover:text-primary">Contact</Link>
            {isLoggedIn && <Link to="/my-orders" className="hover:text-primary">My Orders</Link>}
          </div>

          {/* Icons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/cart" className="relative hover:text-primary">
              <ShoppingCartIcon className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
            <Link to="/profile" className="hover:text-primary">
              <UserIcon className="h-6 w-6" />
            </Link>

            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
              >
                Logout
              </button>
            ) : (
              <Link to="/login" className="btn-primary">Login</Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 space-y-4">
            <Link to="/" className="block hover:text-primary">Home</Link>
            <Link to="/products" className="block hover:text-primary">Products</Link>
            <Link to="/categories" className="block hover:text-primary">Categories</Link>
            <Link to="/about" className="block hover:text-primary">About</Link>
            <Link to="/contact" className="block hover:text-primary">Contact</Link>
            {isLoggedIn && <Link to="/my-orders" className="block hover:text-primary">My Orders</Link>}
            <Link to="/cart" className="block hover:text-primary">Cart</Link>
            <Link to="/profile" className="block hover:text-primary">Profile</Link>

            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white w-full px-4 py-2 rounded-md hover:bg-red-600 transition"
              >
                Logout
              </button>
            ) : (
              <Link to="/login" className="block btn-primary text-center">Login</Link>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header;
