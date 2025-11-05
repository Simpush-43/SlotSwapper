import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { apiFetch } from "../api/fetcher";
import SwapModal from "../componets/SlotSwap";
import { motion } from "framer-motion";

export default function Marketplace() {
  const { state } = useContext(AuthContext);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    if (!state.token) return;
    (async () => {
      const s = await apiFetch("/api/swappable-slots", { token: state.token });
      setSlots(s);
    })();
  }, [state.token]);

  return (
    <div className="max-w-5xl mx-auto mt-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-400">Swappable Slots</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {slots.map((slot, i) => (
          <motion.div
            key={slot._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-5 bg-gray-800 rounded-2xl shadow-lg border border-gray-700"
          >
            <h2 className="text-lg font-semibold mb-2">{slot.title}</h2>
            <p className="text-gray-400 text-sm">
              {new Date(slot.startTime).toLocaleString()}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Posted by: <span className="text-blue-400">{slot.owner.name}</span>
            </p>
            <button
              onClick={() => setSelectedSlot(slot)}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-500 py-2 rounded-xl transition"
            >
              Request Swap
            </button>
          </motion.div>
        ))}
      </div>

      {selectedSlot && (
        <SwapModal slot={selectedSlot} onClose={() => setSelectedSlot(null)} />
      )}
    </div>
  );
}
