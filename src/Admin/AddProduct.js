import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddProduct = () => {
  const [product, setProduct] = useState({
    product_name: "",
    product_description: "",
    product_price: "",
    product_category: "",
    product_brand: "",
    product_image: null,
  });

  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("https://ecommerce-server-v2.onrender.com/api/categories/getCategory")
      .then((response) => setCategories(response.data.data))
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  const handleChange = (e) => {
    if (e.target.name === "product_image") {
      setProduct({ ...product, product_image: e.target.files[0] });
    } else {
      setProduct({ ...product, [e.target.name]: e.target.value });
    }

    // Validate while typing
    validateField(e.target.name, e.target.value);
  };

  const validateField = (name, value) => {
    let errorMsg = "";
    switch (name) {
      case "product_name":
        errorMsg = value.trim() ? "" : "Product name is required.";
        break;
      case "product_description":
        errorMsg = value.trim() ? "" : "Product description is required.";
        break;
      case "product_price":
        errorMsg =
          !value.trim() || isNaN(value) || value <= 0
            ? "Please enter a valid price."
            : "";
        break;
      case "product_category":
        errorMsg = value ? "" : "Please select a category.";
        break;
      case "product_brand":
        errorMsg = value.trim() ? "" : "Product brand is required.";
        break;
      
      default:
        break;
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMsg }));
  };

  const validateInputs = () => {
    const newErrors = {};
    if (!product.product_name.trim()) newErrors.product_name = "Product name is required.";
    if (!product.product_description.trim()) newErrors.product_description = "Product description is required.";
    if (!product.product_price.trim() || isNaN(product.product_price) || product.product_price <= 0)
      newErrors.product_price = "Please enter a valid price.";
    if (!product.product_category) newErrors.product_category = "Please select a category.";
    if (!product.product_brand.trim()) newErrors.product_brand = "Product brand is required.";
    

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    setLoading(true);
    const formData = new FormData();
    Object.keys(product).forEach((key) => formData.append(key, product[key]));

    axios
      .post("https://ecommerce-server-v2.onrender.com/api/products/addProduct", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(() => {
        setLoading(false);
        setSuccessMessage("Product added successfully!");
        setTimeout(() => navigate("/admin/products"), 2000);
      })
      .catch(() => {
        setLoading(false);
        setErrors({ form: "Error adding product. Please try again later." });
      });
  };

  return (
    <div className="mt-12">
      <h2 className="text-4xl font-semibold text-center text-gray-800 mb-6">Add Product</h2>
      {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}
      {errors.form && <div className="text-red-500 mb-4">{errors.form}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            name="product_name"
            value={product.product_name}
            onChange={handleChange}
            placeholder="Product Name"
            className="w-full px-4 py-2 border rounded"
          />
          {errors.product_name && <p className="text-red-500">{errors.product_name}</p>}
        </div>

        <div>
          <input
            type="text"
            name="product_description"
            value={product.product_description}
            onChange={handleChange}
            placeholder="Product Description"
            className="w-full px-4 py-2 border rounded"
          />
          {errors.product_description && <p className="text-red-500">{errors.product_description}</p>}
        </div>

        <div>
          <input
            type="number"
            name="product_price"
            value={product.product_price}
            onChange={handleChange}
            placeholder="Product Price"
            className="w-full px-4 py-2 border rounded"
          />
          {errors.product_price && <p className="text-red-500">{errors.product_price}</p>}
        </div>

        <div>
          <select
            name="product_category"
            value={product.product_category}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.category_name}>
                {cat.category_name}
              </option>
            ))}
          </select>
          {errors.product_category && <p className="text-red-500">{errors.product_category}</p>}
        </div>

        <div>
          <input
            type="text"
            name="product_brand"
            value={product.product_brand}
            onChange={handleChange}
            placeholder="Product Brand"
            className="w-full px-4 py-2 border rounded"
          />
          {errors.product_brand && <p className="text-red-500">{errors.product_brand}</p>}
        </div>

        <div className="w-full px-4 py-2 border rounded">
          <label htmlFor="product_image" className="cursor-pointer text-gray-500">
            {product.product_image ? product.product_image.name : "Choose Product Image"}
          </label>
          <input
            type="file"
            id="product_image"
            name="product_image"
            onChange={handleChange}
            className="hidden"
          />
          {errors.product_image && <p className="text-red-500">{errors.product_image}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-300"
        >
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
