import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const RegisterPage = () => {

  const districts = [
    "Kasargod",
    "Kannur",
    "Wayanad",
    "Kozhikode",
    "Malappuram",
    "Palakkad",
    "Thrissur",
    "Ernakulam",
    "Idukki",
    "Kottayam",
    "Alappuzha",
    "Pathanamthitta",
    "Kollam",
    "Thiruvananthapuram"
  ];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "farmer",
    district: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    const { confirmPassword, ...registerData } = formData;

    const result = await register(registerData);

    if (result.success) {

      navigate("/login");

    } else {

      setError(result.error || "Registration failed");

    }

    setLoading(false);
  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-gray-100 px-4">

      <div className="w-full max-w-md">

        {/* HEADER */}

        <div className="text-center mb-6">

          <h1 className="text-3xl font-bold text-green-600">
            🌱 AgroVision
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            Smart Agriculture Support System
          </p>

        </div>

        {/* REGISTER CARD */}

        <div className="bg-white shadow-lg rounded-xl p-6">

          <h2 className="text-xl font-semibold text-gray-800 text-center mb-4">
            Create your account
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* NAME */}

            <div>

              <label className="text-sm text-gray-600">
                Full Name
              </label>

              <input
                name="name"
                type="text"
                required
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              />

            </div>

            {/* EMAIL */}

            <div>

              <label className="text-sm text-gray-600">
                Email
              </label>

              <input
                name="email"
                type="email"
                required
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              />

            </div>

            {/* ROLE */}

            <div>

              <label className="text-sm text-gray-600">
                Role
              </label>

              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              >

                <option value="farmer">Farmer</option>
                <option value="officer">Agricultural Officer</option>

              </select>

            </div>

            {/* DISTRICT */}

            <div>

              <label className="text-sm text-gray-600">
                District
              </label>

              <select
                name="district"
                required
                value={formData.district}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              >

                <option value="">Select District</option>

                {districts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}

              </select>

            </div>

            {/* PASSWORD */}

            <div>

              <label className="text-sm text-gray-600">
                Password
              </label>

              <input
                name="password"
                type="password"
                required
                placeholder="Create password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              />

            </div>

            {/* CONFIRM PASSWORD */}

            <div>

              <label className="text-sm text-gray-600">
                Confirm Password
              </label>

              <input
                name="confirmPassword"
                type="password"
                required
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              />

            </div>

            {/* SUBMIT BUTTON */}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded-md text-sm font-medium hover:bg-green-700 transition disabled:opacity-60"
            >

              {loading ? (

                <span className="flex justify-center items-center gap-2">

                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>

                  Creating account...

                </span>

              ) : (

                "Create Account"

              )}

            </button>

          </form>

          {/* LOGIN LINK */}

          <p className="text-sm text-gray-500 text-center mt-4">

            Already have an account?

            <Link
              to="/login"
              className="text-green-600 font-medium hover:underline ml-1"
            >
              Sign in
            </Link>

          </p>

        </div>

      </div>

    </div>

  );
};

export default RegisterPage;