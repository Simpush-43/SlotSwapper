import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import { CalendarDays, ArrowLeftRight, Bell,LogOut } from "lucide-react";
import { useContext } from "react";
export default function Navbar() {
  const { state, logout } = useContext(AuthContext);
  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-gray-900 shadow-lg rounded-b-2xl p-4 flex justify-between items-center"
    >
      <Link to="/" className="text-xl font-bold text-blue-400">SlotSwapper</Link>
      <div className="flex space-x-6 text-gray-300">
        <Link to="/" className="flex items-center gap-1 hover:text-blue-400 transition">
          <CalendarDays size={18}/> Dashboard
        </Link>
        <Link to="/marketplace" className="flex items-center gap-1 hover:text-blue-400 transition">
          <ArrowLeftRight size={18}/> Marketplace
        </Link>
        <Link to="/requests" className="flex items-center gap-1 hover:text-blue-400 transition">
          <Bell size={18}/> Requests
        </Link>
              {state.token && (
        <button
          onClick={logout}
          className="flex items-center gap-1 text-red-400 hover:text-red-300 transition"
        >
          <LogOut size={18} /> Logout
        </button>
      )}
      </div>
    </motion.nav>
  );
}
