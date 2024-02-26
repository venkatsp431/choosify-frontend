// AdminLogin.js

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [adminmail, setadminmail] = useState("");
  const [adminPassword, setadminPassword] = useState("");
  const [error, setError] = useState(null); // State to handle errors
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch(
        "https://choosify-backend.onrender.com/api/admin/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ adminmail, adminPassword }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("adminToken", data.token);
        navigate("/admindashboard");
      } else {
        // Handle login failure
        setError(data.message);
      }
    } catch (error) {
      console.error("Error during login:", error.message);
      setError("Internal Server Error"); // Generic error message
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="border p-4 rounded shadow-sm">
        <h2 className="text-center">Admin Login</h2>
        <form>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username:
            </label>
            <input
              type="text"
              className="form-control"
              id="username"
              value={adminmail}
              onChange={(e) => setadminmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password:
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              value={adminPassword}
              onChange={(e) => setadminPassword(e.target.value)}
            />
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleLogin}
          >
            Login
          </button>
        </form>
        {error && <p className="text-danger mt-3">{error}</p>}{" "}
        {/* Display error message */}
      </div>
    </div>
  );
};

export default AdminLogin;
