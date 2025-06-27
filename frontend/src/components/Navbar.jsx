// src/components/Navbar.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-blue-600">
        <Link to={user?.role === "manager" ? "/manager-dashboard" : "/employee-dashboard"}>
          Feedback System
        </Link>
      </h1>

      {user && (
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Role: {user.role}</span>

          {/* Links only for employee */}
          {user.role === "employee" && (
            <>
              <Link
                to="/employee-dashboard"
                className="text-blue-600 hover:underline text-sm"
              >
                Dashboard
              </Link>
              <Link
                to="/request-feedback"
                className="text-blue-600 hover:underline text-sm"
              >
                Request Feedback
              </Link>
              <Link
                to="/anonymous-feedback"
                className="text-blue-600 hover:underline text-sm"
              >
                Anonymous Feedback
              </Link>
            </>
          )}

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 text-sm"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
