"use client";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { motion } from "framer-motion";

export default function AdminKritikDanSaran() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all | read | unread

  // Load data dari backend
  useEffect(() => {
    async function load() {
      try {
        const result = await apiFetch("/api/feedbacks");// GET semua feedback
        setFeedbacks(Array.isArray(result) ? result : result.data || []);
      } catch (err) {
        console.error("Gagal load feedback:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const deleteFeedback = async (id) => {
    if (!confirm("Hapus feedback ini?")) return;

    try {
      await apiFetch(`/api/feedbacks/${id}`, { method: "DELETE" });
      setFeedbacks((prev) => prev.filter((f) => f._id !== id));
    } catch (err) {
      console.error("Gagal hapus:", err);
    }
  };

  // Hitung jumlah unread (jika mau pakai fitur read)
  const unreadCount = feedbacks.length;

  const filtered = feedbacks;

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">Memuat data...</div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F7FA] py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-[#0B3869]">Kritik & Saran</h1>
            <p className="text-gray-600">
              Dashboard Admin — masukan dari orang tua & guru
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-gray-700">
              {unreadCount} Data Masuk
            </span>
          </div>
        </div>

        {/* Feedback List */}
        <div className="space-y-4 relative">
          {filtered.length === 0 ? (
            <div className="bg-white p-10 rounded-2xl shadow text-center">
              <p className="text-gray-500">Belum ada feedback</p>
            </div>
          ) : (
            filtered.map((fb, i) => (
              <motion.div
                key={fb._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition border border-gray-100"
              >
                {/* Header card */}
                <div className="flex justify-between items-start mb-3">
                  {/* Nama */}
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#0D58AB] to-[#1B77D2] rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {fb.parentID?.name?.split(" ")[0][0] || "?"}
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {fb.parentID?.name || "Pengguna"}
                      </h3>

                      <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                        Orang Tua
                      </span>
                    </div>
                  </div>
                </div>

                {/* pesan */}
                <p className="text-gray-700 mb-3">{fb.message}</p>

                {/* date */}
                <p className="text-xs text-gray-500">
                  {new Date(fb.createdAt).toLocaleDateString("id-ID")} •{" "}
                  {new Date(fb.createdAt).toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </motion.div>
            ))
          )}

          {/* Decorative circles (optional aesthetic) */}
          <div className="absolute top-20 left-5 w-24 h-24 bg-blue-200/40 rounded-full blur-2xl -z-10" />
          <div className="absolute bottom-20 right-5 w-32 h-32 bg-indigo-200/40 rounded-full blur-2xl -z-10" />
        </div>
      </motion.div>
    </div>
  );
}
