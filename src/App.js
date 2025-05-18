import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Categories from "./pages/Categories";
// import Cart from "./pages/Cart"; // User Cart Page
import Profile from "./pages/Profile";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyOrders from "./pages/MyOrders"; 

import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import Checkout from './pages/Checkout';


import AdminLayout from "./Admin/AdminLayout"; // Updated path
import ProductManagement from "./Admin/ProductManagement";
import Orders from "./Admin/Orders";
import Payments from "./Admin/Payments";
import Users from "./Admin/Users";
import Dashboard from "./Admin/Dashboard"; // Import the Dashboard component
import AddProduct from './Admin/AddProduct';
import EditProduct from './Admin/EditProduct';
import OrderDetails from "./Admin/OrderDetails"; // Add OrderDetails import
import CategoryManagement from "./Admin/CategoryManagement";
import AddCategory from './Admin/AddCategory';
import EditCategory from "./Admin/EditCategory";
function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Routes>
          {/* Public Pages */}
          <Route
            path="/"
            element={
              <>
                <Header />
                <main className="flex-grow">
                  <Home />
                </main>
                <Footer />
              </>
            }
          />
          <Route
            path="/categories"
            element={
              <>
                <Header />
                <main className="flex-grow">
                  <Categories />
                </main>
                <Footer />
              </>
            }
          />
          <Route
            path="/cart"
            element={
              <>
                <Header />
                <main className="flex-grow">
                  <CartPage/>
                </main>
                <Footer />
              </>
            }
          />
          <Route
            path="/profile"
            element={
              <>
                <Header />
                <main className="flex-grow">
                  <Profile />
                </main>
                <Footer />
              </>
            }
          />
          <Route
            path="/about"
            element={
              <>
                <Header />
                <main className="flex-grow">
                  <About />
                </main>
                <Footer />
              </>
            }
          />
          <Route
            path="/contact"
            element={
              <>
                <Header />
                <main className="flex-grow">
                  <Contact />
                </main>
                <Footer />
              </>
            }
            
          />
          <Route
  path="/my-orders"
  element={
    <>
      <Header />
      <main className="flex-grow">
        <MyOrders />
      </main>
      <Footer />
    </>
  }
/>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/checkout" element={<Checkout />} />
          
          <Route path="/products" element={<ProductPage/>} />
          {/* <Route path="/cart" element={<CartPage />} /> */}

          <Route path="/admin" element={<AdminLayout />}>
  <Route index element={<Dashboard />} />  {/* 👈 This makes Dashboard the default page */}
  <Route path="dashboard" element={<Dashboard />} />
  <Route path="products" element={<ProductManagement />} />
  <Route path="orders" element={<Orders />} />
  <Route path="payments" element={<Payments />} />
  <Route path="users" element={<Users />} />
  <Route path="add-product" element={<AddProduct />} />
  <Route path="edit-product/:id" element={<EditProduct />} />
  <Route path="order/:orderId" element={<OrderDetails />} />
  <Route path="CategoryManagement" element={<CategoryManagement />} />
  <Route path="addCategory" element={<AddCategory />} />
  <Route path="editCategory/:categoryId" element={<EditCategory />} />
</Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
