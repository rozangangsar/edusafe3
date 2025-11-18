'use client';

import { motion } from 'framer-motion';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import LoadingOverlay from "../../components/LoadingOverlay";


export default function AdminDashboard() {
  const { user, loading } = useAuthGuard('admin');

  if (loading) {
    return <LoadingOverlay />;
  }

  return (

    <div className="min-h-screen bg-gray-50">
      {/* Header */}
 

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-gray-800 mb-12"
        >
          Dashboard Admin
        </motion.h2>

        <div className="flex justify-center mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-2">Manajemen User</h3>
              <p className="text-gray-600 text-sm mb-4">
                Kelola data admin, guru, dan orang tua
              </p>
              <a
                href="/admin/users"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Lihat →
              </a>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-2">Manajemen Kelas</h3>
              <p className="text-gray-600 text-sm mb-4">
                Kelola data kelas dan wali kelas
              </p>
              <a
                href="/admin/daftarkelas"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Lihat →
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

