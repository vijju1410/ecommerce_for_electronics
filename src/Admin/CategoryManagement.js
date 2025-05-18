import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔹 Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  useEffect(() => {
    fetch('https://ecommerce-server-v2.onrender.com/api/categories/getCategory')
      .then((response) => response.json())
      .then((data) => {
        setCategories(data.data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch categories');
        setLoading(false);
      });
  }, []);

  const handleDelete = (categoryId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this category!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`https://ecommerce-server-v2.onrender.com/api/categories/deleteCategory/${categoryId}`, {
          method: 'DELETE',
        })
          .then((response) => response.json())
          .then(() => {
            setCategories(categories.filter(category => category._id !== categoryId));
            Swal.fire('Deleted!', 'Category has been deleted.', 'success');
          })
          .catch(() => {
            Swal.fire('Error!', 'Failed to delete category.', 'error');
          });
      }
    });
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  // 🔹 Pagination Logic
  const totalPages = Math.ceil(categories.length / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const currentCategories = categories.slice(startIndex, endIndex);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-4xl font-semibold text-center text-gray-800 mb-6">Category List</h2>

      <div className="flex justify-center mb-6">
        <Link to="/admin/addCategory" className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 transform hover:scale-105">
          Add Category
        </Link>
      </div>

      {/* Table Styling */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse rounded-lg shadow-lg bg-white">
          <thead className="bg-gradient-to-r from-blue-500 to-blue-700 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Category Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Category Description</th>
              <th className="px-6 py-3 text-center text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentCategories.map((category) => (
              <tr key={category._id} className="border-b hover:bg-gray-100">
                <td className="px-6 py-4 text-sm text-gray-800">{category.category_name}</td>
                <td className="px-6 py-4 text-sm text-gray-800">{category.category_description}</td>
                <td className="px-6 py-4 text-center text-sm space-x-4">
                  <Link
                    to={`/admin/EditCategory/${category._id}`}
                    className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-300 transform hover:scale-105"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(category._id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 transform hover:scale-105"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🔹 Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md ${currentPage === 1 ? 'bg-gray-300' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
          >
            ◀ Prev
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-4 py-2 rounded-md ${
                currentPage === index + 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 hover:bg-gray-400'
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-md ${currentPage === totalPages ? 'bg-gray-300' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
          >
            Next ▶
          </button>
        </div>
      )}
    </div>
  );
}

export default CategoryManagement;
