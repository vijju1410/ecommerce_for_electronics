import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Swal from 'sweetalert2'; // Import SweetAlert2

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const recordsPerPage = 5;

  useEffect(() => {
    // Fetch all products
    axios
      .get("https://ecommerce-server-v2.onrender.com/api/products/getProduct")
      .then((response) => {
        if (response.data && response.data.data) {
          setProducts(response.data.data);
        } else {
          console.error("Unexpected response structure", response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching products", error);
      });
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return; // Avoid invalid page numbers
    setPage(newPage);
  };

  const confirmDelete = (productId) => {
    // SweetAlert2 confirmation dialog
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this product!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        // Proceed with the deletion
        axios
          .delete(`https://ecommerce-server-v2.onrender.com/api/products/deleteProduct/${productId}`)
          .then(() => {
            setProducts(products.filter((product) => product._id !== productId));
            Swal.fire('Deleted!', 'Your product has been deleted.', 'success');
          })
          .catch((error) => {
            console.error("Error deleting product", error);
            Swal.fire('Error!', 'There was an issue deleting the product.', 'error');
          });
      }
    });
  };

  // Pagination logic
  const totalPages = Math.ceil(products.length / recordsPerPage);
  const currentProducts = products.slice((page - 1) * recordsPerPage, page * recordsPerPage);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Product Management</h1>

      <div className="flex justify-center items-center py-4">
        <Link
          to="/admin/add-product"
          className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Add Product
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse rounded-lg shadow-lg bg-white">
          <thead className="bg-gradient-to-r from-blue-500 to-blue-700 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Description</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Price</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Category</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Brand</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Image</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.length > 0 ? (
              currentProducts.map((product) => (
                <tr key={product._id} className="border-b hover:bg-gray-100">
                  <td className="px-6 py-4 text-sm text-gray-800">{product.product_name}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{product.product_description}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{product.product_price}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">
                    {product.category_info ? product.category_info.category_name : 'No Category'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">{product.product_brand}</td>
                  <td className="px-6 py-4 text-sm">
                    <img
                      src={product.product_image}
                      alt={product.product_name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm space-x-4">
                    <Link
                      to={`/admin/edit-product/${product._id}`}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-300"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => confirmDelete(product._id)} // Directly call confirmDelete with product ID
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-800">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className="px-4 py-2 mx-1 text-sm font-semibold bg-gray-200 hover:bg-gray-300 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`px-4 py-2 mx-1 text-sm font-semibold rounded-lg transition duration-300 ${
              index + 1 === page
                ? "bg-blue-500 text-white cursor-not-allowed"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
          className="px-4 py-2 mx-1 text-sm font-semibold bg-gray-200 hover:bg-gray-300 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductManagement;
