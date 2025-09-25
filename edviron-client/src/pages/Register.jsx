import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../style/register.css";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user", // default role for UI, but we will always send 'admin'
    school_id: "",
  });
  const [error, setError] = useState("");

  // Optional: fetch schools from backend
  /*
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const res = await axios.get("https://edviron-server.onrender.com/schools");
        setSchools(res.data);
      } catch (err) {
        console.error("Failed to fetch schools", err);
      }
    };
    fetchSchools();
  }, []);
  */

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.school_id) {
      setError("Please enter your school ID");
      return;
    }

    if (!isValidObjectId(formData.school_id)) {
      setError("School ID must be a valid 24-character ObjectId");
      return;
    }

    try {
      // Override role to always send 'admin'
      const payload = { ...formData, role: "admin" };

      const res = await axios.post(
        "https://edviron-server.onrender.com/auth/register",
        payload
      );
      console.log("User registered:", res.data);
      navigate("/login");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <main className="container">
      <div className="register-container">
        <h2>Register</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <label>
            Full Name
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Email
            <input
              type="email"
              name="email"
              placeholder="example@school.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </label>

          {/* If you want manual input */}
          <label>
            School ID
            <input
              type="text"
              name="school_id"
              placeholder="Enter 24-character School ID"
              value={formData.school_id}
              onChange={handleChange}
              required
            />
          </label>

          {/* Optional: dropdown selection for schools */}
          {/*
          <label>
            School
            <select name="school_id" value={formData.school_id} onChange={handleChange} required>
              <option value="">Select a school</option>
              {schools.map((school) => (
                <option key={school._id} value={school._id}>
                  {school.name}
                </option>
              ))}
            </select>
          </label>
          */}

          <label>
            Role
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </label>

          <button type="submit">Create Account</button>

          <h5 className="login-link">
  Have an account?{" "}
  <span 
    onClick={() => navigate("/login")} 
    style={{ cursor: "pointer", color: "#007bff" }} // optional color for link feel
  >
    Login
  </span>
</h5>
        </form>
      </div>
    </main>
  );
}
