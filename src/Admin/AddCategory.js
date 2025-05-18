import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 🚀 Import useNavigate for redirection

function AddCategory() {
  const navigate = useNavigate(); // 🚀 Initialize useNavigate

  const [categoryData, setCategoryData] = useState({
    category_name: '',
    category_description: '',
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategoryData((prevData) => ({ ...prevData, [name]: value }));
    validateField(name, value);
  };

  // Validation function
  const validateField = (name, value) => {
    let errorMsg = '';
    if (name === 'category_name') {
      if (!value.trim()) {
        errorMsg = 'Category name is required';
      } else if (value.length < 3) {
        errorMsg = 'Category name must be at least 3 characters';
      }
    }
    if (name === 'category_description') {
      if (!value.trim()) {
        errorMsg = 'Category description is required';
      } else if (value.length < 10) {
        errorMsg = 'Description must be at least 10 characters';
      }
    }
    setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMsg }));
  };

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    setSuccessMessage('');

    let isValid = true;
    const newErrors = {};

    Object.keys(categoryData).forEach((field) => {
      validateField(field, categoryData[field]);
      if (!categoryData[field].trim()) {
        isValid = false;
        newErrors[field] = `${field.replace('_', ' ')} is required`;
      }
    });

    setErrors(newErrors);
    if (!isValid) return;

    try {
      const response = await fetch('https://ecommerce-server-v2.onrender.com/api/categories/addCategory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      setSuccessMessage('✅ Category added successfully!');
      setCategoryData({ category_name: '', category_description: '' });
      setErrors({});

      // 🚀 Redirect back to CategoryManagement after 2 seconds
      setTimeout(() => {
        navigate('/admin/CategoryManagement'); // Update with the correct route
      }, 2000);
    } catch (error) {
      setApiError(error.message);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-center">Add New Category</h2>

      {/* Display API Error */}
      {apiError && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded text-center">❌ {apiError}</div>}

      {/* Stylish Success Message */}
      {successMessage && (
        <div className="bg-green-100 text-green-700 p-3 mb-4 rounded text-center">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-lg">Category Name</label>
          <input
            type="text"
            name="category_name"
            value={categoryData.category_name}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${errors.category_name ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter category name"
          />
          {errors.category_name && <p className="text-red-500 text-sm">{errors.category_name}</p>}
        </div>

        <div>
          <label className="block text-lg">Category Description</label>
          <textarea
            name="category_description"
            value={categoryData.category_description}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${errors.category_description ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter category description"
          />
          {errors.category_description && <p className="text-red-500 text-sm">{errors.category_description}</p>}
        </div>

        <div className="text-center">
          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300">
            Add Category
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddCategory;
