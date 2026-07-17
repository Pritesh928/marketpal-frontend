import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import ProtectedRoute from "./components/ProtectedRoute";

import UnderDevelopment from "./pages/UnderDevelopment"; 

// this all pages are under development will be available soon.

import Register from "./pages/Register";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
// import HomePage from "./pages/HomePage";
// import VerifyEmailPage from "./pages/VerifyEmailPage";
// import SellPage from "./pages/SellPage";
// import MyProductsPage from "./pages/MyProductsPage";
// import ProductDetailPage from "./pages/ProductDetailPage";

function App() {
  return (
    <Router>
      <Navbar/>
      <AppRoutes />
    </Router>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={< UnderDevelopment />} />
      {/* <Route path="/home" element={<HomePage />} /> */}
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      {/* <Route path="/verify-email" element={<VerifyEmailPage />} /> */}
      {/* <Route path="/product/:id" element={<ProductDetailPage />} /> */}
      {/* <Route path="/sell" element={<ProtectedRoute><SellPage /></ProtectedRoute>} /> */}
      {/* <Route path="/products" element={<ProtectedRoute><MyProductsPage /></ProtectedRoute>} /> */}

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;