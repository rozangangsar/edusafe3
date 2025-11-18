'use client';
import { useEffect, useState } from "react";
import ActivityBeranda from '@/app/components/userPage/ActivityBeranda';
import NotifBeranda from '@/app/components/userPage/NotifBeranda';
import { motion } from 'framer-motion';
import TabelBeranda from '@/app/components/userPage/TabelBeranda';
import CuacaBeranda from '@/app/components/userPage/CuacaBeranda';4
import { apiFetch } from "@/lib/api";
import { useAuthGuard } from "@/hooks/useAuthGuard";

export default function ParentDashboard()
 {
   
  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <main className="px-6 sm:px-8 lg:px-12 py-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#0B3869]">
            Dashboard Orang Tua
          </h2>
          <p className="text-gray-600 mt-2">
            Selamat datang kembali! Pantau aktivitas dan perkembangan anak Anda.
          </p>
        </motion.div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Notifications */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-3"
          >
            <NotifBeranda />
          </motion.div>

          {/* Middle Column - Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-6 flex justify-center"
          >
            <div className="w-full max-w-2xl">
              <ActivityBeranda 
                name="MULAT ADI"
                type="Kelas"
                text="Melakukan Kelas Matematika"
                date="Rabu, 26 Oktober 2025"
                time_from="07.00"
                time_to="08.30"
                sender="Ir. Lorem Ipsum S.Pd.Fil"
                style="w-full h-auto xl:ml-[4vh]"
              />
            </div>
          </motion.div>

          {/* Right Column - Weather & Attendance */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-3"
          >
            <div className="rounded-lg shadow-xl overflow-hidden h-full flex flex-col">
              <CuacaBeranda />
              <TabelBeranda />
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

