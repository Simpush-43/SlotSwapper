import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { apiFetch } from "../api/fetcher";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Login() {
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginUser = async (e) => {
    e.preventDefault();
    try {
      const data = await apiFetch("/api/auth/login", {
        method: "POST",
        body: { email, password },
      });
      dispatch({ type: "LOGIN", token: data.token, user: data.user });
      navigate("/");
    } catch (err) {
      alert(err.error || "Login failed");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-900/60 backdrop-blur-xl border border-gray-700 p-8 rounded-2xl w-full max-w-md shadow-lg"
      >
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-400">
          Welcome Back 👋
        </h1>
        <form onSubmit={loginUser} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-blue-500 outline-none"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-blue-500 outline-none"
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <motion.button
            whileTap={{ scale: 0.95 }}
            className="w-full bg-blue-600 hover:bg-blue-500 px-4 py-3 rounded-lg font-semibold transition"
          >
            Login
          </motion.button>
        </form>

        <p className="text-center mt-4 text-gray-400">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-400 hover:underline">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
