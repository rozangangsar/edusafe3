'use client';
import { useEffect, useState } from "react";
import ActivityBeranda from '@/app/components/userPage/ActivityBeranda';
import NotifBeranda from '@/app/components/userPage/NotifBeranda';
import { motion } from 'framer-motion';
import TabelBeranda from '@/app/components/userPage/TabelBeranda';
import CuacaBeranda from '@/app/components/userPage/CuacaBeranda';
import LoadingOverlay from '@/app/components/LoadingOverlay';
import { apiFetch } from "@/lib/api";
import { useAuthGuard } from "@/hooks/useAuthGuard";

export default function ParentDashboard() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user, loading: authLoading } = useAuthGuard('parent');

  useEffect(() => {
    if (authLoading) return;

    const fetchActivities = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await apiFetch("/api/activitychild/mine");

        if (response && response.data) {
          setActivities(response.data);
        } else {
          setActivities([]);
        }
      } catch (err) {
        console.error("Error fetching activities:", err);
        setError(err.message || "Gagal memuat aktivitas");
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [authLoading]);

  if (authLoading) {
    return <LoadingOverlay />;
  }

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

          {/* Middle Column - Activity List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-6"
          >
            <div className="w-full">
              {error && (
                <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg mb-4">
                  {error}
                </div>
              )}

              {loading ? (
                <div className="text-center py-8 text-gray-500">
                  Memuat aktivitas...
                </div>
              ) : activities.length > 0 ? (
                <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto">
                  {activities.map((activity, idx) => (
                    <ActivityBeranda
                      key={activity._id || idx}
                      name={activity.ChildID?.name || "[Nama Anak]"}
                      type="Aktivitas"
                      text={`melakukan ${activity.Activity}`}
                      date={activity.Date
                        ? new Date(activity.Date).toLocaleDateString("id-ID", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric"
                          })
                        : "-"}
                      time_from={activity.TimeStart || "-"}
                      time_to={activity.TimeEnd || "-"}
                      sender={activity.TeacherID?.name || "[Nama Guru]"}
                      style="w-full h-auto"
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 border-2 border-gray-300 rounded-lg">
                  Belum ada aktivitas untuk anak Anda
                </div>
              )}
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

