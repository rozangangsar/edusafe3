"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { apiFetch } from "@/lib/api";

const Saran = ({ open, onClose }) => {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  useEffect(() => {
    if (!open) return;

    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = originalOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      setError("Pesan tidak boleh kosong.");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await apiFetch("/api/feedbacks", {
        method: "POST",
        body: JSON.stringify({ message }),
      });
      setSuccess("Terima kasih, saran berhasil dikirim!");
      setMessage("");
      setTimeout(() => {
        setSuccess("");
        onClose();
      }, 800);
    } catch (err) {
      setError(err.message || "Gagal mengirim saran. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div
        className="relative z-10 w-[80%] h-[80%] md:h-[60%] bg-white rounded-lg shadow-lg md:p-[5vh] p-[5vw]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-[3vh]">
          <h2 className="text-xl font-bold">Kritik dan Saran</h2>
          <motion.button
            onClick={onClose}
            initial={{ scale: 1 , backgroundColor: "#FFFFFF" }}
              whileHover={{ scale: 1.02 , backgroundColor: "#FFB8B8" }}
              whileTap={{ scale: 0.95 }}
            className="text-gray-600 hover:bg-amber-200 rounded-full h-[3vh] px-[1vh] pb-[1vh]"
          >
            ✕ Kembali
          </motion.button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-y-[3vh]">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kirim Kritik & Saran Anda untuk Admin
            </label>
            <textarea
              name="message"
              rows={4}
              className="w-full rounded-md border p-2 resize-none md:h-[30vh] h-[60vh] focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ketik Saran Anda di sini..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          <div className=" justify-between">
            <motion.button
              type="submit"
              initial={{ scale: 1 , backgroundColor: "#608FC2" }}
              whileHover={{ scale: 1.02 , backgroundColor: "#4a7ba7" }}
              whileTap={{ scale: 0.95 }}
              className="w-full h-auto py-[2vh] rounded-md  text-white transition-color"
            >
              Kirim
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Saran;
