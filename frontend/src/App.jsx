// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ManagerDashboard from "./pages/ManagerDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import Layout from "./components/Layout";
import ProtectedRoute from "./routes/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Unauthorized from "./pages/Unauthorized";

// Placeholder pages (will add later)
const FeedbackRequest = () => <div>Feedback Request Page</div>;
const AnonymousFeedback = () => <div>Anonymous Feedback Page</div>;

function App() {
  return (
    <Router>
      {/* Toast notifications container */}
      <ToastContainer position="top-right" autoClose={3000} />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Protected Layout with Navbar */}
        <Route element={<Layout />}>
          <Route
            path="/manager-dashboard"
            element={
              <ProtectedRoute role="manager">
                <ManagerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employee-dashboard"
            element={
              <ProtectedRoute role="employee">
                <EmployeeDashboard />
              </ProtectedRoute>
            }
          />
          {/* Bonus Features */}
          <Route
            path="/request-feedback"
            element={
              <ProtectedRoute role="employee">
                <FeedbackRequest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/anonymous-feedback"
            element={
              <ProtectedRoute role="employee">
                <AnonymousFeedback />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
