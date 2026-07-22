import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import UnderDevelopment from "./pages/UnderDevelopment"; 
import Register from "./pages/Register";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Sell from "./pages/Sell";
import ProtectedRoute from "./components/ProtectedRoute";
import MyProducts from "./pages/MyProducts";
import ProductDetail from "./pages/ProductDetail";
import EditProduct from "./pages/EditProduct";

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
      <Route path="/home" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/sell" element={
      <ProtectedRoute> <Sell /> </ProtectedRoute>
      } />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/my-products" element={
        <ProtectedRoute> <MyProducts /> </ProtectedRoute>
      } />
      <Route path="/edit-product/:id" element={
        <ProtectedRoute> <EditProduct /> </ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;