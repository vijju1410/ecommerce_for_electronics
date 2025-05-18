import { useState } from 'react'; 
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    gender: '',
    mobile: '+91',  // Default country code
  });

  const [errors, setErrors] = useState({});
  const [serverMessage, setServerMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false); 
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required.';
    } else if (/\d/.test(formData.name)) {
      newErrors.name = 'Name cannot contain numbers.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (
      !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(formData.email)
    ) {
      newErrors.email = 'Enter a valid email address.';
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required.';
    } else if (!/^\+91\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = 'Mobile number must be in the format +911234567890.';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const response = await axios.post('https://ecommerce-server-v2.onrender.com/api/addUser', {
          user_name: formData.name,
          user_email: formData.email,
          password: formData.password,
          user_gender: formData.gender,
          user_mobile: formData.mobile,
        });

        console.log("API Response:", response.data); // Debugging

        if (response.data.status === 1) {
          setServerMessage('🎉 Registration successful! Redirecting...');
          setIsSuccess(true);

          setTimeout(() => {
            navigate('/login');
          }, 3000);
        } else {
          setServerMessage(response.data.message || "❌ Error registering user.");
          setIsSuccess(false);
        }
      } catch (error) {
        console.error('Error registering user:', error);
        setServerMessage('❌ An error occurred during registration.');
        setIsSuccess(false);
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (name === "mobile") {
      if (!value.startsWith("+91")) {
        return;
      }
    }
  
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary hover:text-secondary">
              Sign in
            </Link>
          </p>
        </div>

        {serverMessage && (
          <p className={`text-center text-sm mt-4 p-2 rounded-md ${isSuccess ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {serverMessage}
          </p>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="input-field placeholder-gray-500"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            <div>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="input-field placeholder-gray-500"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
            <div>
              <input
                id="mobile"
                name="mobile"
                type="text"
                required
                className="input-field placeholder-gray-500"
                placeholder="Enter your mobile number"
                value={formData.mobile}
                onChange={handleChange}
              />
              {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
            </div>
            <div>
              <select
                id="gender"
                name="gender"
                required
                className="input-field text-gray-500"
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="" disabled hidden>
                  Select Gender
                </option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="input-field placeholder-gray-500"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>
          </div>

          <div>
            <button type="submit" className="btn-primary w-full">
              Create account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
