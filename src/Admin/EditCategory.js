import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import styles

function EditCategory() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    fetch(`https://ecommerce-server-v2.onrender.com/api/categories/singleCategory/${categoryId}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.data) {
          setCategoryName(data.data.category_name);
          setCategoryDescription(data.data.category_description);
        } else {
          setError('Category not found');
        }
      })
      .catch(() => setError('Error fetching category details'));
  }, [categoryId]);

  const validateInputs = () => {
    const errors = {};

    if (!categoryName.trim()) {
      errors.categoryName = 'Category name is required';
    } else if (categoryName.length < 3) {
      errors.categoryName = 'Category name must be at least 3 characters';
    } else if (categoryName.length > 50) {
      errors.categoryName = 'Category name cannot exceed 50 characters';
    }

    if (!categoryDescription.trim()) {
      errors.categoryDescription = 'Category description is required';
    } else if (categoryDescription.length < 5) {
      errors.categoryDescription = 'Description must be at least 5 characters';
    } else if (categoryDescription.length > 200) {
      errors.categoryDescription = 'Description cannot exceed 200 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!validateInputs()) return;

    const updatedCategory = {
      category_name: categoryName.trim(),
      category_description: categoryDescription.trim(),
    };

    try {
      const response = await fetch(`https://ecommerce-server-v2.onrender.com/api/categories/updateCategory/${categoryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCategory),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('🎉 Category updated successfully!', {
          position: 'top-right',
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'colored',
        });

        setTimeout(() => {
          navigate('/admin/CategoryManagement');
        }, 2000);
      } else {
        toast.error(data.message || 'Error updating category');
      }
    } catch (err) {
      toast.error('Something went wrong');
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Edit Category</h2>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <form onSubmit={handleUpdate} noValidate>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Category Name:</label>
          <input
            type="text"
            className="border p-2 w-full rounded-md focus:outline-none focus:ring focus:border-blue-400"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
          {validationErrors.categoryName && <p className="text-red-500 text-sm">{validationErrors.categoryName}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium">Category Description:</label>
          <textarea
            className="border p-2 w-full rounded-md focus:outline-none focus:ring focus:border-blue-400"
            value={categoryDescription}
            onChange={(e) => setCategoryDescription(e.target.value)}
          />
          {validationErrors.categoryDescription && (
            <p className="text-red-500 text-sm">{validationErrors.categoryDescription}</p>
          )}
        </div>

        <button
          type="submit"
          className={`w-full py-2 px-4 rounded-md text-white font-semibold ${
            Object.keys(validationErrors).length ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'
          }`}
          disabled={Object.keys(validationErrors).length > 0}
        >
          Update Category
        </button>
      </form>

      {/* Toast Container for showing alerts */}
      <ToastContainer />
    </div>
  );
}

export default EditCategory;
