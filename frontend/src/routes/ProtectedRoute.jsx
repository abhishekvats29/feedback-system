// src/routes/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth();

  // Not logged in → redirect to login page
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Logged in but doesn't have required role → redirect to unauthorized page
  if (role && user.role !== role) {
    return <Navigate to="/unauthorized" replace />;
  }

  // User is allowed
  return children;
};

export default ProtectedRoute;
