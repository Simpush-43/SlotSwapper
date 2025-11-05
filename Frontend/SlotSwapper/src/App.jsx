import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./componets/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Marketplace from "./pages/MarketPlace";
import Requests from "./pages/Request";
import ProtectedRoute from "./componets/ProtectedRoute";
import {Toaster} from "sonner"
import './App.css'
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Toaster richColors closeButton position="top-right" duration={1800} />
        <div className="p-6">

          <Routes>

            {/* ✅ Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* ✅ Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/marketplace"
              element={
                <ProtectedRoute>
                  <Marketplace />
                </ProtectedRoute>
              }
            />

            <Route
              path="/requests"
              element={
                <ProtectedRoute>
                  <Requests />
                </ProtectedRoute>
              }
            />

          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
