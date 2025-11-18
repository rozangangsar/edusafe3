"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";


export default function InformasiKelasContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const router = useRouter();

  const [students, setStudents] = useState([]);
  const [classInfo, setClassInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const searchParams = useSearchParams();
  const classId = searchParams.get("classId");
  useEffect(() => {
    async function load() {
      if (!classId) {
        setError("classId tidak ditemukan di URL");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const classReq = apiFetch(`/api/classes/${classId}`).catch(() => null);
        const childrenReq = apiFetch(`/api/children?classId=${classId}`);
        const [classRes, childRes] = await Promise.all([classReq, childrenReq]);

        if (classRes) setClassInfo(classRes);
        const mapped = (childRes.data || []).map((ch) => ({
          id: ch._id,
          name: ch.name,
          birthDate: ch.birthDate ? ch.birthDate.slice(0, 10) : "-",
          parent: ch.parentID?.name || "-",
          lastActivity: "Belum ada data",
          attendance: "0%",
          status: "Active",
        }));

        setStudents(mapped);
      } catch (err) {
        console.error(err);
        setError(err.message || "Gagal memuat data siswa");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [classId]);
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.parent.toLowerCase().includes(searchQuery.toLowerCase())
  );

async function handleRemoveFromClass(id) {
  if (!confirm("Keluarkan siswa dari kelas?")) return;

  try {
    await apiFetch(`/api/children/${id}/remove`, {
      method: "PATCH",
    });

    setStudents(prev => prev.filter(s => s.id !== id));
  } catch (err) {
    alert(err.message || "Gagal mengeluarkan siswa dari kelas");
  }
}



  return (
    <div className="min-h-screen bg-[#F5F7FA] py-8 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
        >
          <div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#0B3869]">
            Informasi Kelas{classInfo ? ` ${classInfo.name} (Kelas ${classInfo.grade})` : ""}
          </h1>
          <p className="text-gray-600 mt-1">
            Kelola data siswa dan informasi kelas
            {classInfo?.schoolYear ? ` - Tahun ajaran ${classInfo.schoolYear}` : ""}
          </p>

          {error && (
          <p className="text-red-600 text-sm mt-2">
            {error}
          </p>
          )}
          {loading && (
          <p className="text-gray-500 text-sm mt-2">
            Memuat data siswa...
          </p>
         )}

          </div>
            <Link href={`/admin/daftarkelas/informasikelas/inputsiswa?classId=${classId}`}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-[#0D58AB] to-[#1B77D2] text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
              >
                + Tambah Siswa
              </motion.button>
            </Link>

        </motion.div>

        {/* Search & Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6"
        >
          {/* Search Bar */}
          <div className="md:col-span-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari nama siswa atau orang tua..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-12 rounded-xl border-2 border-gray-200 focus:border-[#0D58AB] focus:outline-none focus:ring-2 focus:ring-[#0D58AB]/20 transition-all"
              />
              <svg
                className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Stats Cards */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl p-4 shadow-md border border-[#DFE8F2]"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#0D58AB] to-[#1B77D2] rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Siswa</p>
                <p className="text-2xl font-bold text-[#0B3869]">{students.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl p-4 shadow-md border border-[#DFE8F2]"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600">Hadir Hari Ini</p>
                <p className="text-2xl font-bold text-[#0B3869]">{students.filter(s => s.status === 'Active').length}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Table Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg overflow-hidden border border-[#DFE8F2]"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-[#0B3869] to-[#0D58AB]">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Nama Siswa</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Tanggal Lahir</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Orang Tua/Wali</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-white">Aktivitas Terakhir</th>

                  <th className="px-6 py-4 text-center text-sm font-semibold text-white">Aksi</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredStudents.map((student, index) => (
                    <motion.tr
                      key={student.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      className={`border-b border-gray-100 hover:bg-[#DFE8F2]/50 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-[#DFE8F2]/30'
                      }`}
                    >
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-800">{student.name}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{student.birthDate}</td>
                      <td className="px-6 py-4 text-gray-700">{student.parent}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          {student.lastActivity}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setSelectedStudent(student)}
                            className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
                            title="Lihat Detail"
                          >
                            <svg className="w-5 h-5 text-[#0D58AB] group-hover:text-[#0B3869]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleRemoveFromClass(student.id)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                            title="Keluarkan dari kelas"
                          >
                            <svg className="w-5 h-5 text-red-500 group-hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </motion.button>


                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {filteredStudents.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-gray-500 font-medium">Tidak ada siswa ditemukan</p>
              <p className="text-sm text-gray-400 mt-1">Coba cari dengan kata kunci lain</p>
            </motion.div>
          )}
        </motion.div>

        {/* Detail Modal */}
        <AnimatePresence>
          {selectedStudent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStudent(null)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#0D58AB] to-[#1B77D2] rounded-full flex items-center justify-center text-white font-bold text-2xl">
                      {selectedStudent.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-[#0B3869]">{selectedStudent.name}</h2>
                      <p className="text-gray-600">Detail Informasi Siswa</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedStudent(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-[#DFE8F2] rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-1">Tanggal Lahir</p>
                    <p className="font-semibold text-[#0B3869]">{selectedStudent.birthDate}</p>
                  </div>
                  <div className="bg-[#DFE8F2] rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-1">Orang Tua/Wali</p>
                    <p className="font-semibold text-[#0B3869]">{selectedStudent.parent}</p>
                  </div>
                  <div className="bg-[#DFE8F2] rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-1">Aktivitas Terakhir</p>
                    <p className="font-semibold text-[#0B3869]">{selectedStudent.lastActivity}</p>
                  </div>

                </div>

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-gradient-to-r from-[#0D58AB] to-[#1B77D2] text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    Edit Informasi
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedStudent(null)}
                    className="px-6 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                  >
                    Tutup
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
