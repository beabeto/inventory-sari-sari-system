import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../api/auth";
import React from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>; // wrap in fragment for safety
}