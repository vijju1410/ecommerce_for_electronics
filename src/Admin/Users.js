import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import Swal from 'sweetalert2';


Modal.setAppElement("#root"); // Prevents accessibility warnings

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  // Delete Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);

  // Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editUserData, setEditUserData] = useState({
    _id: "",
    user_name: "",
    user_email: "",
    user_mobile: "",
    user_gender: "",
  });

  // Fetch Users
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("https://ecommerce-server-v2.onrender.com/api/getUser", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data.data);
    } catch (err) {
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  // Pagination Logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const nextPage = () => {
    if (currentPage < Math.ceil(users.length / usersPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
  // Open Edit Modal
  const openEditModal = (user) => {
    setEditUserData(user);
    setShowEditModal(true);
    document.body.style.overflow = "hidden"; // Prevent background scroll
  };

  // Close Edit Modal
  const closeEditModal = () => {
    setShowEditModal(false);
    document.body.style.overflow = "auto";
  };

  // Handle Edit Input Change with Validation
  const handleEditChange = (e) => {
    const { name, value } = e.target;

    if (name === "user_name" && !/^[A-Za-z\s]*$/.test(value)) return;
    if (name === "user_mobile" && !/^\d{0,10}$/.test(value)) return;

    setEditUserData({ ...editUserData, [name]: value });
  };

  // Update User
  const updateUser = async () => {
    // Validation: No blank fields allowed
    if (!editUserData.user_name.trim() || !editUserData.user_mobile.trim() || !editUserData.user_gender) {
      alert("All fields are required!");
      return;
    }

    // Validate Mobile Number (10 digits)
    if (!/^\d{10}$/.test(editUserData.user_mobile)) {
      alert("Mobile number must be exactly 10 digits.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://ecommerce-server-v2.onrender.com/api/updateUser/${editUserData._id}`,
        editUserData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUsers(users.map((user) => (user._id === editUserData._id ? editUserData : user)));
      closeEditModal();
      setSuccessMessage("User updated successfully!");

      // Remove success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      alert("Failed to update user");
    }
  };

  // Open Delete Confirmation Modal
  const confirmDeleteUser = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUser(id); // Call deleteUser if confirmed
      }
    });
  };
  
  // Delete User with SweetAlert2
  const deleteUser = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://ecommerce-server-v2.onrender.com/api/deleteUser/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      setUsers(users.filter((user) => user._id !== id)); // Update users list
      Swal.fire('Deleted!', 'User has been deleted.', 'success'); // Success alert
    } catch (err) {
      Swal.fire('Error!', 'Failed to delete user.', 'error'); // Error alert
    }
  };
  return (
    <div className="container mx-auto p-6">
      {/* Success Alert */}
      {successMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white py-2 px-6 rounded-lg shadow-md">
          {successMessage}
        </div>
      )}

      <h2 className="text-4xl font-semibold text-center text-gray-800 mb-6">User List</h2>

      <table className="min-w-full table-auto border-collapse rounded-lg shadow-lg bg-white">
        <thead className="bg-gradient-to-r from-blue-500 to-blue-700 text-white">
          <tr>
            <th className="px-6 py-3 text-left">Name</th>
            <th className="px-6 py-3 text-left">Email</th>
            <th className="px-6 py-3 text-left">Phone</th>
            <th className="px-6 py-3 text-left">Gender</th>
            <th className="px-6 py-3 text-center">Actions</th>
          </tr>
        </thead>
       <tbody>
  {currentUsers.map((user) => (
    <tr key={user._id} className="border-b hover:bg-gray-100">
      <td className="px-6 py-4">{user.user_name}</td>
      <td className="px-6 py-4">{user.user_email}</td>
      <td className="px-6 py-4">{user.user_mobile}</td>
      <td className="px-6 py-4">{user.user_gender}</td>
      <td className="px-6 py-4 text-center">
        <button
          onClick={() => openEditModal(user)}
          className="px-4 py-2 bg-yellow-500 text-white rounded-lg mr-2"
        >
          Edit
        </button>
        <button
          onClick={() => confirmDeleteUser(user._id)}
          className="px-4 py-2 bg-red-500 text-white rounded-lg"
        >
          Delete
        </button>
      </td>
    </tr>
  ))}
</tbody>
      </table>{/* Pagination Controls */}
      <div className="flex justify-center items-center mt-4">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 mx-2 rounded-lg ${currentPage === 1 ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 text-white"}`}
        >
          Previous
        </button>
        <span className="text-gray-700 mx-4">Page {currentPage} of {Math.ceil(users.length / usersPerPage)}</span>
        <button
          onClick={nextPage}
          disabled={currentPage >= Math.ceil(users.length / usersPerPage)}
          className={`px-4 py-2 mx-2 rounded-lg ${currentPage >= Math.ceil(users.length / usersPerPage) ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 text-white"}`}
        >
          Next
        </button>
      </div>

      {/* Edit Modal */}
<Modal isOpen={showEditModal} onRequestClose={closeEditModal} className="fixed top-1/4 left-1/2 transform -translate-x-1/2 w-96 bg-white p-6 rounded-lg shadow-xl">
  <h3 className="text-lg font-semibold text-center mb-4">Edit User</h3>

  <label className="block text-gray-700">Name:</label>
  <input 
    type="text" 
    name="user_name" 
    value={editUserData.user_name} 
    onChange={handleEditChange} 
    placeholder="Enter Name" 
    className="w-full p-2 border rounded my-2" 
    required 
  />

  <label className="block text-gray-700">Email:</label>
  <input 
    type="email" 
    name="user_email" 
    value={editUserData.user_email} 
    onChange={handleEditChange} 
    placeholder="Enter Email" 
    className="w-full p-2 border rounded my-2" 
    disabled // Prevent editing email
  />

  <label className="block text-gray-700">Phone:</label>
  <input 
    type="text" 
    name="user_mobile" 
    value={editUserData.user_mobile} 
    onChange={handleEditChange} 
    placeholder="Enter Phone" 
    className="w-full p-2 border rounded my-2" 
    required 
  />

  <label className="block text-gray-700">Gender:</label>
  <select 
    name="user_gender" 
    value={editUserData.user_gender} 
    onChange={handleEditChange} 
    className="w-full p-2 border rounded my-2" 
    required
  >
    <option value="">Select Gender</option>
    <option value="Male">Male</option>
    <option value="Female">Female</option>
    <option value="Other">Other</option>
  </select>

  <div className="flex justify-end mt-4">
    <button onClick={closeEditModal} className="px-4 py-2 bg-gray-500 text-white rounded-lg mr-2">Cancel</button>
    <button onClick={updateUser} className="px-4 py-2 bg-blue-500 text-white rounded-lg">Save Changes</button>
  </div>
</Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteModal} className="fixed top-10 left-1/2 transform -translate-x-1/2 w-64 bg-white p-4 rounded-lg shadow-lg text-center">
        <p className="text-lg font-semibold mb-3">Are you sure?</p>
        <button onClick={deleteUser} className="px-4 py-2 bg-red-500 text-white rounded-lg mr-2">Yes</button>
        <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 bg-gray-500 text-white rounded-lg">Cancel</button>
      </Modal>
    </div>
  );
}

export default Users;
