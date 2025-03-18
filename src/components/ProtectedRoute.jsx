import { Navigate } from "react-router-dom";
import {  isAuthenticated } from "../features/auth/authService";


const ProtectedRoute = ({ children }) => {

  if (!isAuthenticated()) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
