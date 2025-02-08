import React, { useState } from 'react';
import './Signup.css';

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: '', // Updated from fullName to name
    email: '',
    password: '',
    department: '',
    role: '', // Added role field
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      formData.name && // Updated from fullName to name
      formData.email &&
      formData.password &&
      formData.department &&
      formData.role // Added role validation
    ) {
      try {
<<<<<<< HEAD
        const response = await fetch("http://localhost:3001/api/auth/signup", {
=======
        const response = await fetch("http://34.145.27.91:3001/api/auth/signup", {
>>>>>>> b51ad8d915adff84d8a5ef1ce2b3fbfe0407bc3f
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error("Failed to create account.");
        }

        const data = await response.json();
        alert("Account created successfully!");
        console.log("Server response:", data);
      } catch (error) {
        console.error("Error during signup:", error.message);
        alert("Something went wrong. Please try again.");
      }
    } else {
      alert('Please fill in all fields.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="signup-page">
      <div className="illustration-side">
        <img
          src="/illustration.jpg" // Correct path for files in the public folder
          alt="Illustration"
          className="illustration"
        />
      </div>
      <div className="form-side">
        <div className="form-container">
          <h1>Sign up</h1>
          <p className="welcome-text">
            Welcome to the Course Recommendation platform.
            <br />
            Register as a member to experience.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label> {/* Updated htmlFor */}
              <input
                type="text"
                id="name" // Updated from fullName to name
                name="name" // Updated from fullName to name
                value={formData.name} // Updated from fullName to name
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••••"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="department">Department</label>
              <input
                type="text"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="Enter your department"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="role">Role</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select your role
                </option>
                <option value="Instructor">Instructor</option>
                <option value="Admin">Admin</option>
                <option value="Student">Student</option>
              </select>
            </div>

            <button type="submit" className="create-account-btn">
              Create Account
            </button>
          </form>

          <p className="signin-link">
            Already a member?{' '}
            <a href="/signin" className="signin-text">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
