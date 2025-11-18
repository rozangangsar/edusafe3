"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { apiFetch } from "@/lib/api";
import { useAuthGuard } from "@/hooks/useAuthGuard";

export default function Tabel() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, loading: authLoading } = useAuthGuard();


      useEffect(() => {
        if (!user) return; 

        async function load() {
          try {
            let result;

            if (user.role === "parent") {
              const childId = user.childIDs?.[0];
              if (!childId) {
                return console.error("Parent tidak punya childID");
              }
              result = await apiFetch(`/api/attendance/child/${childId}`);
            } if (user.role === "teacher") {
              result = await apiFetch("/api/attendance/teacher");
            }  else {
              result = await apiFetch("/api/attendance");
            }

            const finalData = Array.isArray(result)
              ? result
              : result.data || [];

            setAttendance(finalData);

          } catch (err) {
            console.error("Gagal load attendance:", err);
          } finally {
            setLoading(false);
          }
        }

        load();
      }, [user]);


  async function handleUpdate() {
  try {
    await apiFetch(`/api/attendance/${selected._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: selected.status,
        note: selected.note,
      }),
    });

    // update local state tanpa reload
    setAttendance((prev) =>
      prev.map((row) =>
        row._id === selected._id ? { ...row, ...selected } : row
      )
    );

    setIsModalOpen(false);
  } catch (err) {
    console.error("Gagal update:", err);
    alert("Gagal update kehadiran.");
  }
}


  if (loading) {
    return <p className="text-center mt-10 text-gray-600">Memuat data...</p>;
  }

  return (
    <div className="flex flex-col justify-center p-[5vh] w-[90vw]">
      <h1 className="font-bold text-2xl">Data Kehadiran</h1>

      <table className="rounded-lg overflow-hidden mt-4 w-full">
        <thead>
          <tr className="bg-[#0B3869] text-white">
            <th className="px-4 py-3 text-left font-semibold">Name</th>
            <th className="px-4 py-3 text-left font-semibold">Check In</th>
            <th className="px-4 py-3 text-left font-semibold">Check Out</th>
            <th className="px-4 py-3 text-left font-semibold">Status</th>
            <th className="px-4 py-3 text-left font-semibold">Notes</th>
            <th className="px-4 py-3 text-left font-semibold">Actions</th>
          </tr>
        </thead>

        <tbody>
          {attendance.map((item, index) => (
            <tr
              key={item._id}
              className={index % 2 === 0 ? "bg-[#DFE8F2]" : "bg-white"}
            >
              {/* Nama Anak */}
              <td className="px-4 py-3 text-gray-700">
                {item.childID?.name || "-"}
              </td>

              {/* Check In */}
              <td className="px-4 py-3 text-gray-700">
                {item.checkIn
                  ? new Date(item.checkIn).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "-"}
              </td>

              {/* Check Out */}
              <td className="px-4 py-3 text-gray-700">
                {item.checkOut
                  ? new Date(item.checkOut).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "-"}
              </td>

              {/* Status */}
              <td className="px-4 py-3">
                <span
                  className={`px-3 py-1 rounded-full text-white text-sm ${
                    item.status === "hadir"
                      ? "bg-green-500"
                      : item.status === "sakit"
                      ? "bg-yellow-500"
                      : item.status === "izin"
                      ? "bg-blue-500"
                      : "bg-red-500"
                  }`}
                >
                  {item.status}
                </span>
              </td>

              {/* Note */}
              <td className="px-4 py-3 text-gray-700">{item.note || "-"}</td>

              {/* Action */}
              <td className="px-4 py-3">
                  {user.role !== "parent" && (
                    <motion.button
                      initial={{ backgroundColor: "#0D58AB" }}
                      whileHover={{ scale: 1.1, backgroundColor: "#0B3869" }}
                      whileTap={{ scale: 0.9, backgroundColor: "#608FC2" }}
                      className="rounded-lg p-[1vh] w-[80%] hover:underline text-white"
                      onClick={() => {
                        setSelected(item);
                        setIsModalOpen(true);
                      }}
                    >
                      Edit
                    </motion.button>
)}


              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white p-6 w-[400px] rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-4">Edit Kehadiran</h2>

      {/* STATUS */}
      <label className="block text-sm mb-1">Status</label>
      <select
        value={selected?.status || ""}
        onChange={(e) =>
          setSelected((prev) => ({ ...prev, status: e.target.value }))
        }
        className="w-full p-2 border rounded-lg mb-4"
      >
        <option value="hadir">Hadir</option>
        <option value="sakit">Sakit</option>
        <option value="izin">Izin</option>
        <option value="alfa">Alfa</option>
      </select>

      {/* NOTE */}
      <label className="block text-sm mb-1">Catatan</label>
      <textarea
        value={selected?.note || ""}
        onChange={(e) =>
          setSelected((prev) => ({ ...prev, note: e.target.value }))
        }
        className="w-full p-2 border rounded-lg mb-4"
      />

      {/* BUTTONS */}
      <div className="flex justify-end gap-2 mt-4">
        <button
          className="px-4 py-2 rounded-lg bg-gray-300"
          onClick={() => setIsModalOpen(false)}
        >
          Batal
        </button>

        <button
          className="px-4 py-2 rounded-lg bg-[#0B3869] text-white"
          onClick={() => handleUpdate()}
        >
          Simpan
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}
