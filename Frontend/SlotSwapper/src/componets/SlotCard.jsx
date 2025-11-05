import React from "react";
import { motion } from "framer-motion";
import { Clock, Repeat } from "lucide-react";

export default function SlotCard({ slot, index, onToggle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="p-5 bg-gray-800 rounded-2xl shadow-lg border border-gray-700"
    >
      <h2 className="text-lg font-semibold mb-2">{slot.title}</h2>

      <div className="text-sm text-gray-400 flex items-center gap-2 mb-1">
        <Clock size={15} />
        {new Date(slot.startTime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}{" "}
        -{" "}
        {new Date(slot.endTime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>

      <p className="text-sm text-gray-400 mb-3">
        {new Date(slot.startTime).toLocaleDateString()}
      </p>

      <div className="flex justify-between items-center">
        <span
          className={`text-xs px-3 py-1 rounded-full ${
            slot.status === "SWAPPABLE"
              ? "bg-green-500/20 text-green-400"
              : slot.status === "SWAP_PENDING"
              ? "bg-yellow-500/20 text-yellow-400"
              : "bg-gray-600/30 text-gray-300"
          }`}
        >
          {slot.status}
        </span>

        <button
          onClick={() => onToggle(slot)}
          className="flex items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded-lg text-sm transition"
        >
          <Repeat size={15} />
          {slot.status === "SWAPPABLE" ? "Unset" : "Make Swappable"}
        </button>
      </div>
    </motion.div>
  );
}
