import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { apiFetch } from "../api/fetcher";
import { motion } from "framer-motion";
import { Calendar, Clock, Repeat } from "lucide-react";
import CreateSlotModal from "../componets/CreateSlotModal";
import SlotCard from "../componets/SlotCard";
export default function Dashboard() {
  const { state } = useContext(AuthContext);
  const [slots, setSlots] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
 const fetchSlots = async () => {
    const s = await apiFetch("/api/slots/me", { token: state.token });
    setSlots(s);
  };

  useEffect(() => {
    if (state.token) fetchSlots();
  }, [state.token]);

  const toggleSwappable = async (slot) => {
    const newStatus = slot.status === "SWAPPABLE" ? "BUSY" : "SWAPPABLE";
    await apiFetch(`/api/slots/${slot._id}`, {
      method: "PUT",
      token: state.token,
      body: { status: newStatus },
    });

    fetchSlots(); // ✅ Refresh list
  };

  return (
    <div className="max-w-5xl mx-auto mt-6">
      <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
        <Calendar className="text-blue-400" /> Your Calendar Slots
      </h1>
      <button
          onClick={() => setShowCreate(true)}
          className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-white"
        >
          + Add Slot
        </button>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {slots.map((slot, i) => (
          <SlotCard
            key={slot._id}
            slot={slot}
            index={i}
            onToggle={toggleSwappable}
          />
        ))}
      </div>

      {showCreate && (
        <CreateSlotModal onClose={() => setShowCreate(false)} refresh={fetchSlots} />
      )}
    </div>
  );
}
