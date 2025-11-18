'use client';

import { motion } from 'framer-motion';
import { useAuthGuard } from '@/hooks/useAuthGuard';

export default function TeacherDashboard() {
  const { user, loading } = useAuthGuard('teacher');
  return (
    <div className="min-h-screen bg-gray-50">


      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-gray-800 mb-6"
        >
          Dashboard Guru
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">Presensi Siswa</h3>
            <p className="text-gray-600 text-sm mb-4">Input dan kelola presensi siswa</p>
            <a href="/teacher/kehadiran" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Lihat →
            </a>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-2">Catatan Aktivitas</h3>
            <p className="text-gray-600 text-sm mb-4">Buat catatan aktivitas harian siswa</p>
            <a href="/teacher/aktivitas" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              Lihat →
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

