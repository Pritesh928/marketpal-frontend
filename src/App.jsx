import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import ProtectedRoute from "./components/ProtectedRoute";

import UnderDevelopment from "./pages/UnderDevelopment"; 

// this all pages are under development will be available soon.

import Register from "./pages/Register";
import ThemeToggle from "./components/ThemeToggle";
// import HomePage from "./pages/HomePage";
// import LoginPage from "./pages/LoginPage";
// import VerifyEmailPage from "./pages/VerifyEmailPage";
// import SellPage from "./pages/SellPage";
// import MyProductsPage from "./pages/MyProductsPage";
// import ProductDetailPage from "./pages/ProductDetailPage";

function App() {
  return (
    <Router>
      <ThemeToggle/>
      <AppRoutes />
    </Router>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* public routes */}
      <Route path="/" element={< UnderDevelopment />} />
      {/* <Route path="/home" element={<HomePage />} /> */}
      {/* <Route path="/login" element={<LoginPage />} /> */}
      <Route path="/register" element={<Register />} />
      {/* <Route path="/verify-email" element={<VerifyEmailPage />} /> */}
      {/* <Route path="/product/:id" element={<ProductDetailPage />} /> */}
      {/* <Route path="/sell" element={<ProtectedRoute><SellPage /></ProtectedRoute>} /> */}
      {/* <Route path="/products" element={<ProtectedRoute><MyProductsPage /></ProtectedRoute>} /> */}

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;