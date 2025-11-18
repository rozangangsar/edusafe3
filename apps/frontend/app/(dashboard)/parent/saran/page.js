"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { apiFetch } from "@/lib/api";

export default function KritikDanSaran() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      setError("Pesan tidak boleh kosong.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await apiFetch("/api/feedbacks", {
        method: "POST",
        body: JSON.stringify({ message }),
      });
      setSuccess(true);
      setMessage("");
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || "Gagal mengirim saran. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="inline-block mb-4"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-[#0D58AB] to-[#1B77D2] rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </div>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#0B3869] mb-3">
            Kritik & Saran
          </h1>
          <p className="text-lg text-gray-600">
            Suara Anda sangat berarti untuk kami! 
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-white rounded-3xl shadow-lg p-8 md:p-12 border border-[#DFE8F2]"
        >
          {/* Success Message */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-xl"
            >
              <div className="flex items-center">
                <svg
                  className="w-6 h-6 text-green-500 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-green-800 font-semibold">
                  Terima kasih! Saran Anda berhasil terkirim 🎉
                </p>
              </div>
            </motion.div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 rounded-xl"
            >
              <div className="flex items-center">
                <svg
                  className="w-6 h-6 text-red-500 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-red-800 font-semibold">{error}</p>
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Textarea */}
            <div>
              <label
                htmlFor="message"
                className="block text-lg font-semibold text-gray-800 mb-3"
              >
                Sampaikan Kritik & Saran Anda untuk Admin
              </label>
              <motion.textarea
                whileFocus={{ scale: 1.01 }}
                id="message"
                name="message"
                rows={8}
                className="w-full rounded-2xl border-2 border-gray-200 p-4 text-gray-800 placeholder-gray-400 resize-none focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-[#0D58AB] transition-all duration-300 shadow-sm hover:shadow-md"
                placeholder="Ketik kritik atau saran Anda di sini... Kami mendengarkan dengan serius! 💬"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <p className="mt-2 text-sm text-gray-500">
                Minimal 10 karakter • {message.length} karakter
              </p>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading || message.length < 10}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className={`w-full py-4 rounded-2xl font-bold text-lg shadow-lg transition-all duration-300 ${
                loading || message.length < 10
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
                  : "bg-gradient-to-r from-[#0D58AB] to-[#1B77D2] text-white hover:shadow-xl hover:shadow-blue-500/40 hover:from-[#0B437F] hover:to-[#155EA9]"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="inline-block w-5 h-5 border-3 border-white border-t-transparent rounded-full"
                  />
                  Mengirim...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                  Kirim Saran
                </span>
              )}
            </motion.button>
          </form>

          {/* Info Card */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-8 p-6 bg-[#DFE8F2] rounded-2xl border border-[#0B3869]/10"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">
                  Kenapa kritik & saran penting?
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Setiap masukan dari Anda membantu kami meningkatkan kualitas
                  layanan EduSafe. Tim kami akan membaca dan mempertimbangkan
                  setiap saran dengan serius untuk menciptakan pengalaman yang
                  lebih baik.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200/30 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-indigo-200/30 rounded-full blur-3xl -z-10" />
      </motion.div>
    </div>
  );
}
