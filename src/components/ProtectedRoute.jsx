import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {

  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      fontSize: '16px',
      color: '#666'
    }}>Loading...</div>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
  
}