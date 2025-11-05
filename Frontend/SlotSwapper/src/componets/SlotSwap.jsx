import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import { apiFetch } from "../api/fetcher";

export default function SwapModal({ slot, onClose }) {
  const { state } = useContext(AuthContext);
  const [mySlots, setMySlots] = useState([]);

  useEffect(() => {
    (async () => {
      const s = await apiFetch("/api/slots/me", { token: state.token });
      setMySlots(s.filter((x) => x.status === "SWAPPABLE"));
    })();
  }, []);

  const handleSwap = async (mySlotId) => {
    await apiFetch("/api/swap-request", {
      method: "POST",
      token: state.token,
      body: { mySlotId, theirSlotId: slot._id },
    });
    alert("Swap request sent!");
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 flex justify-center items-center z-50"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-900 p-6 rounded-2xl shadow-2xl max-w-md w-full"
      >
        <h2 className="text-xl font-bold mb-4 text-blue-400">
          Offer a Slot to Swap
        </h2>
        {mySlots.length === 0 ? (
          <p className="text-gray-400">You have no swappable slots.</p>
        ) : (
          mySlots.map((s) => (
            <button
              key={s._id}
              onClick={() => handleSwap(s._id)}
              className="w-full text-left bg-gray-800 hover:bg-gray-700 p-3 rounded-lg mb-2 transition"
            >
              <div className="font-semibold">{s.title}</div>
              <div className="text-sm text-gray-400">
                {new Date(s.startTime).toLocaleString()}
              </div>
            </button>
          ))
        )}
        <button
          onClick={onClose}
          className="mt-4 w-full bg-red-600 hover:bg-red-500 py-2 rounded-xl transition"
        >
          Cancel
        </button>
      </motion.div>
    </motion.div>
  );
}
