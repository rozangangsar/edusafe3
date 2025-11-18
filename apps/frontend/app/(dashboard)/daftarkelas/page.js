"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import NotificationSaranPage from "@/app/components/userPage/NotificationSaranPage";
import { apiFetch } from "@/lib/api";
import { useRouter } from "next/navigation";

// const notifications = [
//   {
//     id: 1,
//     headline: "kelas1",
//     body: "You can now switch to the sleek new dark mode theme in your settings. Give your eyes a break!",
//   },
//   {
//     id: 2,
//     headline: "kelas2",
//     body: "Check out your personalized financial summary for October. Great progress on your savings goals!",
//   },
//   {
//     id: 3,
//     headline: "kelas3",
//     body: "For security reasons, we recommend updating your password. This ensures the continued protection of your account.",
//   },
//   {
//     id: 4,
//     headline: "kelas4",
//     body: "We are performing scheduled maintenance to improve performance. The site may be unavailable for a brief period.",
//   },
//   {
//     id: 5,
//     headline: "kelas5",
//     body: "Congratulations! You've unlocked the 'Early Bird' badge for completing a task before 9 AM.",
//   },
// ];

export default function DaftarKelasPage() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  async function loadClasses() {
    try {
      setLoading(true);
      setError("");
      const res = await apiFetch("/api/classes");
      setClasses(res.data || []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Gagal memuat data kelas");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Yakin ingin menghapus kelas ini?")) return;
    try {
      await apiFetch(`/api/classes/${id}`, { method: "DELETE" });
      await loadClasses();
    } catch (err) {
      alert(err.message || "Gagal menghapus kelas");
    }
  }

  useEffect(() => {
    loadClasses();
  }, []);

  return (
    <div className="flex flex-col items-center gap-y-[2vh] py-[5vh]">
      <div className="flex justify-between w-[90vw]"> <h1 className="font-bold text-3xl">Daftar Kelas</h1>
      <Link href="/admin/daftarkelas/inputkelasbaru">
       <motion.button 
                      initial = {{ backgroundColor: "#0D58AB"}}
                      whileHover={{ scale: 1.1 , backgroundColor: "#0B3869"}}
                      whileTap={{ scale: 0.9, backgroundColor: "#608FC2" }}
                      className=" rounded-lg py-[1vh] px-[3vh] w-fit hover:underline text-white"
                    >
                      Buat Kelas
                    </motion.button>
                    </Link>
                    </div>

                    {error && <p className="text-red-600 text-sm">{error}</p>}
                    {loading && <p className="text-gray-500 text-sm">Memuat data kelas...</p>}

                    {!loading && classes.length === 0 && !error && (
                    <p className="text-gray-500 text-sm">Belum ada data kelas.</p>
                    )}
                     <div className="flex flex-col gap-4">
        {classes.map((cls) => (
          <div
          key={cls._id}
          onClick={() => router.push(`/informasikelas?classId=${cls._id}`)}
          className="cursor-pointer"
        >
          <NotificationSaranPage
            headline={`${cls.name} (Kelas ${cls.grade})`}
            text={
              `Tahun ajaran: ${cls.schoolYear}\n` +
              `Wali kelas: ${
                (cls.homeroomTeacherIDs || [])
                  .map((t) => t.name)
                  .join(", ") || "Belum diatur"
              }`
            }
            // onDelete tetap bisa dipakai seperti sebelumnya
            onDelete={() => handleDelete(cls._id)}
          />
        </div>
        ))}
      </div>
      
      {/* {notifications.map((notification) => (
        <NotificationSaranPage
          key={notification.id}
          headline={notification.headline}
          text={notification.body}
          button="Cek Kelas"
        />
      ))} */}
    </div>
  );
}
