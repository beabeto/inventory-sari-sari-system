import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../api/auth";

export default function ProtectedRoute({ children }: any) {

  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  return children;
}