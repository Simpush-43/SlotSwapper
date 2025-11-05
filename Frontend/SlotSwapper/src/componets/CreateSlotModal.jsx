import { useState } from "react";
import { motion } from "framer-motion";
import { apiFetch } from "../api/fetcher";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

export default function CreateSlotModal({ onClose, refresh }) {
  const { state } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [Description,setDescription]=useState("");
  const createSlot = async (e) => {
    e.preventDefault();
    await apiFetch("/api/slots", {
      method: "POST",
      token: state.token,
      body: { title,Description, startTime, endTime },
    });
    refresh();
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/70 flex justify-center items-center z-50"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-gray-900 p-6 rounded-2xl w-full max-w-md border border-gray-700 shadow-xl"
      >
        <h2 className="text-xl font-semibold text-blue-400 mb-4">Create Slot</h2>

        <form onSubmit={createSlot} className="space-y-3">
          <input
            type="text"
            placeholder="Title"
            className="w-full p-3 text-amber-100 bg-gray-800 border border-gray-700 rounded-lg focus:border-blue-500 outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Description"
            className="w-full p-3 text-amber-100 bg-gray-800 border border-gray-700 rounded-lg focus:border-blue-500 outline-none"
            value={Description}
            onChange={(e) => setDescription(e.target.value)}
            
          />
          <label className="text-sm text-gray-400">Start Time</label>
          <input
            type="datetime-local"
            className="w-full p-3 text-amber-100 bg-gray-800 border border-gray-700 rounded-lg focus:border-blue-500 outline-none"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />

          <label className="text-sm text-gray-400">End Time</label>
          <input
            type="datetime-local"
            className="w-full p-3 text-amber-100 bg-gray-800 border border-gray-700 rounded-lg focus:border-blue-500 outline-none"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />

          <button
            className="w-full bg-blue-600 hover:bg-blue-500 py-2 rounded-lg transition"
            type="submit"
          >
            Save
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full mt-2 bg-red-600 hover:bg-red-500 py-2 rounded-lg transition"
          >
            Cancel
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}
