import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UpdateCategory = ({ categoryId, closeModal }) => {
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [error, setError] = useState(null);

  // Fetch the category details to populate the form
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(`https://ecommerce-server-v2.onrender.com/api/categories/singleCategory/${categoryId}`);
        setCategoryName(response.data.data.category_name);
        setCategoryDescription(response.data.data.category_description);
      } catch (err) {
        setError('Error fetching category');
      }
    };

    fetchCategory();
  }, [categoryId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedCategory = {
      category_name: categoryName,
      category_description: categoryDescription,
    };

    try {
      await axios.put(`https://ecommerce-server-v2.onrender.com/api/categories/updateCategory/${categoryId}`, updatedCategory);
      alert('Category updated successfully!');
      closeModal();  // Close the modal after successful update
    } catch (err) {
      setError('Error updating category');
    }
  };

  return (
    <div className="modal">
      <h2>Update Category</h2>
      {error && <div className="text-red-500">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Category Name</label>
          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Category Description</label>
          <textarea
            value={categoryDescription}
            onChange={(e) => setCategoryDescription(e.target.value)}
            required
          />
        </div>
        <button type="submit">Update Category</button>
      </form>
      <button onClick={closeModal}>Close</button>
    </div>
  );
};

export default UpdateCategory;
