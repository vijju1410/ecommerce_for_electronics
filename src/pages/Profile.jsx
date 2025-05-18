import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaUser, FaEnvelope, FaPhone, FaVenusMars } from "react-icons/fa";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editing, setEditing] = useState(false);
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        phone: '',
        gender: ''
    });

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!userId || !token) {
            setError("User ID or Token is missing!");
            setLoading(false);
            return;
        }

        const fetchUserData = async () => {
            try {
                const response = await axios.get(`https://ecommerce-server-v2.onrender.com/api/singleUser/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUser(response.data.data);
                setUserData({
                    name: response.data.data.user_name,
                    email: response.data.data.user_email,
                    phone: response.data.data.user_mobile,
                    gender: response.data.data.user_gender
                });
            } catch (error) {
                setError("Failed to load user data. Please try again.");
            }
        };

        fetchUserData().finally(() => setLoading(false));
    }, [userId, token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData((prevData) => ({ ...prevData, [name]: value }));
    };

    const validateFields = () => {
        const { name, email, phone } = userData;

        // Name validation: Ensure it's not empty and doesn't contain only digits
        if (!name.trim()) {
            Swal.fire("Error", "Name is required", "error");
            return false;
        }
        if (/^\d+$/.test(name)) {
            Swal.fire("Error", "Name cannot contain only digits", "error");
            return false;
        }

        // Phone validation: Ensure it's in the correct format (e.g., +91 followed by 10 digits)
        const phonePattern = /^\+91\d{10}$/;
        if (!phonePattern.test(phone)) {
            Swal.fire("Error", "Phone number should be in the format +91XXXXXXXXXX", "error");
            return false;
        }

        // Email validation: Ensure it's in a valid format
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            Swal.fire("Error", "Please enter a valid email address", "error");
            return false;
        }

        return true;
    };

    const handleSave = async () => {
        if (!validateFields()) return;

        try {
            const response = await axios.put(
                `https://ecommerce-server-v2.onrender.com/api/updateUser/${userId}`,
                userData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            // Update user state immediately with the new data
            setUser({
                ...user,
                user_name: userData.name,
                user_email: userData.email,
                user_mobile: userData.phone,
                user_gender: userData.gender
            });

            // Optionally, update the userData state as well
            setUserData({
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
                gender: userData.gender
            });

            setEditing(false);
            Swal.fire("Success", "Profile updated successfully", "success");
        } catch (error) {
            Swal.fire("Error", "Failed to update profile. Please try again.", "error");
        }
    };

    if (loading) {
        return <p className="text-center text-gray-600 mt-10 text-lg animate-pulse">Loading...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500 mt-10 text-lg">{error}</p>;
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white border border-gray-300 shadow-lg rounded-lg p-6 w-full max-w-2xl">
                <div className="text-center mb-6">
                    <div className="inline-block bg-blue-500 p-3 rounded-full text-white shadow-md">
                        <FaUser size={40} />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-800 mt-2">User Profile</h2>
                </div>

                <div className="space-y-4 text-gray-700">
                    <div className="flex items-center">
                        <FaUser className="mr-2 text-blue-500" />
                        <strong className="mr-1">Name:</strong>
                        {editing ? (
                            <input
                                type="text"
                                name="name"
                                value={userData.name}
                                onChange={handleChange}
                                className="ml-2 p-2 border border-gray-300 rounded"
                            />
                        ) : (
                            <span>{user?.user_name}</span>
                        )}
                    </div>
                    <div className="flex items-center">
                        <FaEnvelope className="mr-2 text-indigo-500" />
                        <strong className="mr-1">Email:</strong>
                        {editing ? (
                            <input
                                type="email"
                                name="email"
                                value={userData.email}
                                onChange={handleChange}
                                className="ml-2 p-2 border border-gray-300 rounded"
                            />
                        ) : (
                            <span>{user?.user_email}</span>
                        )}
                    </div>
                    <div className="flex items-center">
                        <FaPhone className="mr-2 text-green-500" />
                        <strong className="mr-1">Phone:</strong>
                        {editing ? (
                            <input
                                type="text"
                                name="phone"
                                value={userData.phone}
                                onChange={handleChange}
                                className="ml-2 p-2 border border-gray-300 rounded"
                            />
                        ) : (
                            <span>{user?.user_mobile}</span>
                        )}
                    </div>
                    <div className="flex items-center">
                        <FaVenusMars className="mr-2 text-pink-500" />
                        <strong className="mr-1">Gender:</strong>
                        {editing ? (
                            <select
                                name="gender"
                                value={userData.gender}
                                onChange={handleChange}
                                className="ml-2 p-2 border border-gray-300 rounded"
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        ) : (
                            <span>{user?.user_gender}</span>
                        )}
                    </div>
                </div>

                <div className="mt-6 flex justify-between">
                    {editing ? (
                        <button
                            onClick={handleSave}
                            className="bg-blue-500 text-white p-2 rounded"
                        >
                            Save Changes
                        </button>
                    ) : (
                        <button
                            onClick={() => setEditing(true)}
                            className="bg-yellow-500 text-white p-2 rounded"
                        >
                            Edit Profile
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
