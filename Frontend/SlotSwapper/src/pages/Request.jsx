import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { apiFetch } from "../api/fetcher";
import { motion, AnimatePresence } from "framer-motion";

export default function Requests() {
  const { state } = useContext(AuthContext);
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [tab, setTab] = useState("incoming");

  const fetchData = async () => {
    const inc = await apiFetch("/api/requests/incoming", { token: state.token });
    const out = await apiFetch("/api/requests/outgoing", { token: state.token });
    setIncoming(inc);
    setOutgoing(out);
  };

  useEffect(() => {
    if (state.token) fetchData();
  }, [state.token]);

  const respond = async (id, accept) => {
    await apiFetch(`/api/swap-response/${id}`, {
      method: "POST",
      token: state.token,
      body: { accept }
    });
    // Remove smoothly with animation
    setIncoming(prev => prev.filter(req => req._id !== id));
    fetchData();
  };

  return (
    <div className="max-w-5xl mx-auto mt-8">
      <h1 className="text-3xl font-semibold text-blue-400 mb-6">Swap Requests</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setTab("incoming")}
          className={`px-6 py-2 rounded-xl transition ${
            tab === "incoming" ? "bg-blue-600" : "bg-gray-800 hover:bg-gray-700"
          }`}
        >
          Incoming
        </button>

        <button
          onClick={() => setTab("outgoing")}
          className={`px-6 py-2 rounded-xl transition ${
            tab === "outgoing" ? "bg-blue-600" : "bg-gray-800 hover:bg-gray-700"
          }`}
        >
          Outgoing
        </button>
      </div>

      {/* Incoming Requests */}
      {tab === "incoming" && (
        <AnimatePresence>
          {incoming.length === 0 ? (
            <p className="text-gray-400">No incoming requests.</p>
          ) : incoming.map((req, i) => (
            <motion.div
              key={req._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.05 }}
              className="bg-gray-800 p-5 rounded-xl mb-4 border border-gray-700 shadow"
            >
              <h3 className="text-lg font-semibold mb-2">
                {req.requester.name} wants to swap:
              </h3>

              <div className="text-gray-300 text-sm mb-1">
                <span className="text-blue-400 font-semibold">{req.theirSlot.title}</span> ↔ <span className="text-green-400 font-semibold">{req.mySlot.title}</span>
              </div>

              <div className="flex gap-3 mt-3">
                <motion.button
                  whileTap={{ scale: 0.93 }}
                  onClick={() => respond(req._id, true)}
                  className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg"
                >
                  Accept
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.93 }}
                  onClick={() => respond(req._id, false)}
                  className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg"
                >
                  Reject
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      )}

      {/* Outgoing Requests */}
      {tab === "outgoing" && (
        <AnimatePresence>
          {outgoing.length === 0 ? (
            <p className="text-gray-400">No outgoing requests.</p>
          ) : outgoing.map((req, i) => (
            <motion.div
              key={req._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-gray-800 p-5 rounded-xl mb-4 border border-gray-700 shadow"
            >
              <div className="text-gray-300 text-sm mb-2">
                You offered your <span className="text-green-400 font-semibold">{req.mySlot.title}</span> for{" "}
                <span className="text-blue-400 font-semibold">{req.theirSlot.title}</span>
              </div>

              <span
                className={`px-3 py-1 text-xs rounded-full ${
                  req.status === "PENDING"
                    ? "bg-yellow-400/20 text-yellow-300"
                    : req.status === "ACCEPTED"
                    ? "bg-green-400/20 text-green-300"
                    : "bg-red-400/20 text-red-300"
                }`}
              >
                {req.status}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </div>
  );
}
