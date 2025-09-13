import { useAuth } from "./context/authContext";
import { Navigate } from "react-router-dom";
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
console.log("ProtectedRoute - isAuthenticated:", isAuthenticated, "loading:", loading);

  if (loading) {
    return <div>Loading...</div>; 
  }

  return isAuthenticated ? children : <Navigate to="/auth" />;
}
