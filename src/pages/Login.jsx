import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import "tailwindcss/tailwind.css"; // Ensure Tailwind is properly set up

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState(""); // Dynamic toast message
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("https://ecommerce-server-v2.onrender.com/api/login", formData);
      setLoading(false);

      if (response.data.status === "fail") {
        setError(response.data.Message || "Invalid email or password.");
      } else {
        const { user_id, user_name, user_email, user_mobile, user_gender, user_role } = response.data.data;

        localStorage.setItem("userId", user_id);
        localStorage.setItem("name", user_name);
        localStorage.setItem("email", user_email);
        localStorage.setItem("phone", user_mobile);
        localStorage.setItem("gender", user_gender);
        localStorage.setItem("token", response.data.token);
        if (!localStorage.getItem("user_role")) {
          localStorage.setItem("user_role", user_role);
        }

        // 🎉 Updated success toast message with role
        setToastMessage(`✅ Welcome, ${user_name}! Redirecting to ${user_role === "admin" ? "Admin Panel" : "Our Home Page"}...`);
        setShowToast(true);
        
        // Redirect after 3 seconds
        setTimeout(() => {
          navigate(user_role === "admin" ? "/admin" : "/");
        }, 3000);
      }
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      {/* 🛎️ Animated Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed top-6 right-6 bg-green-600 text-white p-4 rounded-lg shadow-lg flex items-center"
          >
            <span className="mr-2">🎉</span> {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-md w-full space-y-8 bg-white p-6 rounded-lg shadow-xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{" "}
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-800">
              create a new account
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="input-field border-gray-300 p-3 w-full rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Email address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={loading}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="input-field border-gray-300 p-3 w-full rounded-md focus:ring-2 focus:ring-blue-500"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                disabled={loading}
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <div className="text-sm text-right">
            <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-800">
              Forgot your password?
            </Link>
          </div>

          <div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition-all duration-300"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Sign in"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
