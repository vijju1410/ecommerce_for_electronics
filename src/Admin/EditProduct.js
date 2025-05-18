import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // For animations
import Swal from "sweetalert2"; // Import SweetAlert2

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    product_name: "",
    product_description: "",
    product_price: "",
    product_category: "",
    product_brand: "",
  });

  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    axios
      .get(`https://ecommerce-server-v2.onrender.com/api/products/getProductById/${id}`)
      .then((response) => {
        setProduct(response.data);
        setPreviewImage(response.data.product_image);
      })
      .catch((error) => console.error("Error fetching product:", error));
  }, [id]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  // Custom validation function
  const validateInputs = () => {
    if (!product.product_name.trim()) {
      setErrorMessage("Product name is required.");
      return false;
    }
    if (!product.product_description.trim()) {
      setErrorMessage("Product description is required.");
      return false;
    }
    // Convert product_price to a string and trim
    if (!product.product_price.toString().trim() || isNaN(product.product_price) || product.product_price <= 0) {
      setErrorMessage("Please enter a valid price.");
      return false;
    }
    if (!product.product_category) {
      setErrorMessage("Please select a category.");
      return false;
    }
    if (!product.product_brand.trim()) {
      setErrorMessage("Product brand is required.");
      return false;
    }
    setErrorMessage("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateInputs()) return;

    const formData = new FormData();
    formData.append("product_name", product.product_name);
    formData.append("product_description", product.product_description);
    formData.append("product_price", product.product_price);
    formData.append("product_category", product.product_category);
    formData.append("product_brand", product.product_brand);

    if (image) {
      formData.append("product_image", image);
    }

    try {
      await axios.put(`https://ecommerce-server-v2.onrender.com/api/products/editProduct/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Success Alert with SweetAlert2
      Swal.fire({
        title: "Success!",
        text: "Product updated successfully!",
        icon: "success",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "px-6 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition duration-300",
        },
      });

      navigate("/admin/products");
    } catch (error) {
      console.error("Error updating product:", error);

      // Error Alert with SweetAlert2
      Swal.fire({
        title: "Error!",
        text: "Failed to update product. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
        customClass: {
          confirmButton: "px-6 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 transition duration-300",
        },
      });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto p-6"
    >
      <h2 className="text-4xl font-semibold text-center text-gray-800 mb-6">Edit Product</h2>

      {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="product_name"
          value={product.product_name}
          onChange={handleChange}
          placeholder="Product Name"
          className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="number"
          name="product_price"
          value={product.product_price}
          onChange={handleChange}
          placeholder="Product Price"
          className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-400"
        />
        <textarea
          name="product_description"
          value={product.product_description}
          onChange={handleChange}
          placeholder="Product Description"
          className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="text"
          name="product_category"
          value={product.product_category}
          onChange={handleChange}
          placeholder="Product Category"
          className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="text"
          name="product_brand"
          value={product.product_brand}
          onChange={handleChange}
          placeholder="Product Brand"
          className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-400"
        />

        {/* Custom file input */}
        <div className="w-full px-4 py-2">
          <label htmlFor="product_image" className="cursor-pointer text-gray-500">
            {image ? image.name : "Choose Product Image"}
          </label>
          <input
            type="file"
            id="product_image"
            name="product_image"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        {previewImage && (
          <img
            src={previewImage}
            alt="Preview"
            className="mt-3 w-32 h-32 object-cover rounded-lg shadow-lg"
          />
        )}

        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="px-6 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition duration-300"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-6 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Update Product
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default EditProduct;
