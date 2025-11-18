"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { apiFetch } from "@/lib/api";
import { useAuthGuard } from "@/hooks/useAuthGuard";

export default function Tabel() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noChildrenError, setNoChildrenError] = useState(false);
  const [selected, setSelected] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [selectedCheckout, setSelectedCheckout] = useState(null);
  const [checkoutTime, setCheckoutTime] = useState("");
  const [isWeeklyModalOpen, setIsWeeklyModalOpen] = useState(false);
  const [selectedChildWeekly, setSelectedChildWeekly] = useState(null);
  const [weeklyData, setWeeklyData] = useState([]);
  const [loadingWeekly, setLoadingWeekly] = useState(false);
  const [children, setChildren] = useState([]);
  const [creating, setCreating] = useState(false);
  const initialFormState = { childID: "", status: "hadir", note: "", checkIn: "", date: "" };
  const [newAttendance, setNewAttendance] = useState(initialFormState);
  const { user, loading: authLoading } = useAuthGuard();


      useEffect(() => {
        if (!user) return; 
        let ignore = false;
        setLoading(true);

        async function load() {
          try {
            let result;

            if (user.role === "parent") {
              // Untuk parent, ambil children dulu dari endpoint /api/children/my
              try {
                console.log("[Parent] User info:", user);
                console.log("[Parent] User ID:", user.id || user._id || user.sub);
                console.log("[Parent] Fetching children...");
                const childrenData = await apiFetch("/api/children/my");
                console.log("[Parent] Children data:", childrenData);
                
                const childrenList = Array.isArray(childrenData) ? childrenData : childrenData.data || [];
                console.log("[Parent] Children list:", childrenList);
                console.log("[Parent] Children count:", childrenList.length);
                
                if (childrenList.length === 0) {
                  console.warn("⚠️ Parent tidak punya children di database!");
                  console.warn("Parent ID:", user.id || user._id || user.sub);
                  console.warn("Silakan hubungi admin untuk menambahkan children ke akun parent ini.");
                  if (!ignore) {
                    setAttendance([]);
                    setNoChildrenError(true);
                    setLoading(false);
                  }
                  return;
                }
                
                // Reset error jika ada children
                if (!ignore) {
                  setNoChildrenError(false);
                }
                
                // Fetch attendance untuk SEMUA children parent
                console.log("[Parent] Fetching attendance for ALL children...");
                const allAttendance = [];
                
                for (const child of childrenList) {
                  const childId = child._id || child.id;
                  if (!childId) continue;
                  
                  try {
                    console.log(`[Parent] Fetching attendance for child: ${child.name} (${childId})`);
                    const childAttendance = await apiFetch(`/api/attendance/child/${childId}`);
                    const attendanceArray = Array.isArray(childAttendance) ? childAttendance : childAttendance.data || [];
                    allAttendance.push(...attendanceArray);
                    console.log(`[Parent] Found ${attendanceArray.length} attendance records for ${child.name}`);
                  } catch (err) {
                    console.error(`[Parent] Error fetching attendance for child ${child.name}:`, err);
                  }
                }
                
                // Sort berdasarkan tanggal terbaru
                result = allAttendance.sort((a, b) => new Date(b.date) - new Date(a.date));
                console.log("[Parent] Total attendance records:", allAttendance.length);
              } catch (err) {
                console.error("Gagal load attendance untuk parent:", err);
                console.error("Error details:", err.message, err.response);
                if (!ignore) {
                  setAttendance([]);
                }
                throw err; // Re-throw untuk ditangani di catch block
              }
            } else if (user.role === "teacher") {
              result = await apiFetch("/api/attendance/teacher");
            }  else {
              result = await apiFetch("/api/attendance");
            }

            const finalData = Array.isArray(result)
              ? result
              : result.data || [];

            console.log("[Parent] Final data length:", finalData.length);
            console.log("[Parent] Final data sample:", finalData[0]);

            // Untuk parent, data sudah ter-populate dari backend, langsung set
            // Untuk admin/teacher, perlu load children list untuk normalisasi
            let childList = [];
            if ((user.role === "admin" || user.role === "teacher") && !ignore) {
              try {
                const childRes = await apiFetch("/api/children?limit=200");
                childList = Array.isArray(childRes?.data)
                  ? childRes.data
                  : Array.isArray(childRes)
                  ? childRes
                  : [];
                setChildren(childList);
              } catch (childErr) {
                console.error("Gagal load daftar anak:", childErr);
              }
            }

            // Normalisasi data hanya untuk admin/teacher
            let normalizedData = finalData;
            if ((user.role === "admin" || user.role === "teacher") && childList.length > 0) {
              normalizedData = finalData.map(item => {
                // Jika childID adalah objek tapi tidak ada _id, coba dapatkan dari children list
                if (item.childID && typeof item.childID === 'object' && !item.childID._id) {
                  const childName = item.childID.name;
                  if (childName) {
                    const foundChild = childList.find(c => c.name === childName);
                    if (foundChild) {
                      return {
                        ...item,
                        childID: {
                          ...item.childID,
                          _id: foundChild._id
                        }
                      };
                    }
                  }
                }
                return item;
              });
            }

            if (!ignore) {
              console.log("[Parent] Setting attendance with", normalizedData.length, "items");
              setAttendance(normalizedData);
            }

          } catch (err) {
            console.error("Gagal load attendance:", err);
          } finally {
            if (!ignore) {
              setLoading(false);
            }
          }
        }

        load();
        return () => {
          ignore = true;
        };
      }, [user]);


  async function handleUpdate() {
  if (!selected) return;
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

  async function handleCheckout() {
    if (!selectedCheckout || !checkoutTime) {
      return alert("Pilih waktu checkout terlebih dahulu.");
    }

    // Validasi checkout harus setelah check-in
    const checkInTime = new Date(selectedCheckout.checkIn);
    const checkOutTime = new Date(checkoutTime);
    
    if (checkOutTime <= checkInTime) {
      return alert("Waktu checkout harus setelah waktu check-in!");
    }

    try {
      const updated = await apiFetch(`/api/attendance/${selectedCheckout._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          checkOut: checkOutTime.toISOString(),
        }),
      });

      setAttendance((prev) =>
        prev.map((row) =>
          row._id === selectedCheckout._id ? { ...row, checkOut: updated.checkOut } : row
        )
      );

      setIsCheckoutModalOpen(false);
      setSelectedCheckout(null);
      setCheckoutTime("");
    } catch (err) {
      console.error("Gagal checkout:", err);
      alert(err.message || "Gagal checkout.");
    }
  }

  async function handleCreate() {
    if (!newAttendance.childID) {
      return alert("Pilih anak terlebih dahulu.");
    }

    if (!newAttendance.date) {
      return alert("Pilih tanggal kehadiran.");
    }

    setCreating(true);
    try {
      const payload = {
        childID: newAttendance.childID,
        status: newAttendance.status,
        date: new Date(newAttendance.date).toISOString(),
      };

      if (newAttendance.status === "hadir" && newAttendance.checkIn) {
        payload.checkIn = new Date(newAttendance.checkIn).toISOString();
      }

      const created = await apiFetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (newAttendance.note) {
        try {
          await apiFetch(`/api/attendance/${created._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ note: newAttendance.note }),
          });
          created.note = newAttendance.note;
        } catch (noteErr) {
          console.error("Gagal simpan catatan awal:", noteErr);
        }
      }

      const childInfo = children.find((child) => child._id === payload.childID);
      const hydrated = {
        ...created,
        childID: childInfo ? { _id: childInfo._id, name: childInfo.name } : created.childID,
      };

      setAttendance((prev) => [hydrated, ...prev]);
      setIsCreateModalOpen(false);
      setNewAttendance(initialFormState);
    } catch (err) {
      console.error("Gagal input attendance:", err);
      alert(err.message || "Gagal input absen.");
    } finally {
      setCreating(false);
    }
  }

  async function handleShowWeekly(childId, childName, clickedDate = null) {
    // Untuk parent, jika childId tidak ada, ambil dari children list
    let targetChildId = childId;
    
    if (!targetChildId && user?.role === "parent") {
      try {
        const childrenData = await apiFetch("/api/children/my");
        const childrenList = Array.isArray(childrenData) ? childrenData : childrenData.data || [];
        if (childrenList.length > 0) {
          targetChildId = childrenList[0]._id || childrenList[0].id;
        }
      } catch (err) {
        console.error("Gagal load children untuk weekly:", err);
      }
    }
    
    if (!targetChildId) {
      alert("Data anak tidak valid.");
      return;
    }

    setSelectedChildWeekly({ id: targetChildId, name: childName || "Anak Saya" });
    setIsWeeklyModalOpen(true);
    setWeeklyData([]);
    setLoadingWeekly(true);
    
    try {
      const result = await apiFetch(`/api/attendance/child/${targetChildId}`);
      const childAttendance = Array.isArray(result) ? result : result.data || [];
      
      // Jika ada data attendance, ambil data TERBARU untuk menentukan minggu
      // Atau gunakan tanggal yang diklik
      let referenceDate = clickedDate ? new Date(clickedDate) : new Date();
      
      // Jika tidak ada clickedDate, gunakan tanggal attendance terbaru
      if (!clickedDate && childAttendance.length > 0) {
        // Sort dan ambil yang terbaru
        const sortedAttendance = [...childAttendance].sort((a, b) => 
          new Date(b.date) - new Date(a.date)
        );
        referenceDate = new Date(sortedAttendance[0].date);
      }
      
      // Get week's Monday-Friday based on reference date
      const currentDay = referenceDate.getDay();
      const diff = currentDay === 0 ? -6 : 1 - currentDay;
      const monday = new Date(referenceDate);
      monday.setDate(referenceDate.getDate() + diff);
      
      const weekDays = [];
      for (let i = 0; i < 5; i++) {
        const day = new Date(monday);
        day.setDate(monday.getDate() + i);
        weekDays.push(day);
      }
      
      const weeklyDataMap = weekDays.map(day => {
        const dateStr = day.toISOString().split('T')[0];
        const found = childAttendance.find(att => {
          const attDate = new Date(att.date).toISOString().split('T')[0];
          return attDate === dateStr;
        });
        
        return {
          date: day,
          dayName: day.toLocaleDateString('id-ID', { weekday: 'long' }),
          status: found ? found.status : null,
          data: found
        };
      });
      
      setWeeklyData(weeklyDataMap);
    } catch (err) {
      console.error("Gagal load weekly data:", err);
      setIsWeeklyModalOpen(false);
      setSelectedChildWeekly(null);
      setWeeklyData([]);
      alert("Gagal memuat data mingguan. " + (err.message || ""));
    } finally {
      setLoadingWeekly(false);
    }
  }


  if (authLoading) {
    return <p className="text-center mt-10 text-gray-600">Memeriksa sesi...</p>;
  }

  if (loading) {
    return <p className="text-center mt-10 text-gray-600">Memuat data...</p>;
  }

  const canManage = user?.role !== "parent";

  return (
    <div className="flex flex-col justify-center p-[5vh] w-[90vw]">
      <h1 className="font-bold text-2xl">Data Kehadiran</h1>
      
      {noChildrenError && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 font-semibold mb-2">⚠️ Tidak Ada Data Anak</p>
          <p className="text-yellow-700 text-sm">
            Akun parent Anda belum memiliki data anak yang terdaftar. 
            Silakan hubungi admin untuk menambahkan data anak ke akun Anda.
          </p>
          <p className="text-yellow-600 text-xs mt-2">
            Parent ID: {user?.id || user?._id || user?.sub || "Tidak diketahui"}
          </p>
        </div>
      )}

      {canManage && (
        <div className="flex justify-end mt-4">
          <motion.button
            initial={{ backgroundColor: "#0D58AB" }}
            whileHover={{ scale: 1.05, backgroundColor: "#0B3869" }}
            whileTap={{ scale: 0.95 }}
            className="rounded-lg px-6 py-2 text-white"
            onClick={() => setIsCreateModalOpen(true)}
          >
            Input Absen
          </motion.button>
        </div>
      )}

      <div className="overflow-x-auto mt-4">
        <table className="rounded-lg overflow-hidden w-full min-w-max">
          <thead>
            <tr className="bg-[#0B3869] text-white">
              <th className="px-3 py-3 text-left font-semibold text-sm whitespace-nowrap">Name</th>
              <th className="px-3 py-3 text-left font-semibold text-sm whitespace-nowrap">Date</th>
              <th className="px-3 py-3 text-left font-semibold text-sm whitespace-nowrap">Check In</th>
              <th className="px-3 py-3 text-left font-semibold text-sm whitespace-nowrap">Check Out</th>
              <th className="px-3 py-3 text-left font-semibold text-sm whitespace-nowrap">Status</th>
              <th className="px-3 py-3 text-left font-semibold text-sm whitespace-nowrap max-w-[200px]">Notes</th>
              <th className="px-3 py-3 text-left font-semibold text-sm whitespace-nowrap">Weekly</th>
              {user?.role !== "parent" && (
                <th className="px-3 py-3 text-left font-semibold text-sm whitespace-nowrap">Actions</th>
              )}
            </tr>
          </thead>

        <tbody>
          {attendance.length === 0 ? (
            <tr>
              <td 
                colSpan={user?.role === "parent" ? 7 : 8} 
                className="px-4 py-8 text-center text-gray-500"
              >
                Belum ada data kehadiran
              </td>
            </tr>
          ) : (
            attendance.map((item, index) => (
            <tr
              key={item._id}
              className={index % 2 === 0 ? "bg-[#DFE8F2]" : "bg-white"}
            >
              {/* Nama Anak */}
              <td className="px-3 py-3 text-gray-700 text-sm whitespace-nowrap">
                {item.childID?.name || "-"}
              </td>

              {/* Date */}
              <td className="px-3 py-3 text-gray-700 text-sm whitespace-nowrap">
                {item.date
                  ? new Date(item.date).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })
                  : "-"}
              </td>

              {/* Check In */}
              <td className="px-3 py-3 text-gray-700 text-sm whitespace-nowrap">
                {item.checkIn
                  ? new Date(item.checkIn).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "-"}
              </td>

              {/* Check Out */}
              <td className="px-3 py-3 text-gray-700 text-sm whitespace-nowrap">
                {item.checkOut
                  ? new Date(item.checkOut).toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "-"}
              </td>

              {/* Status */}
              <td className="px-3 py-3">
                <span
                  className={`px-2 py-1 rounded-full text-white text-xs font-medium ${
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

              {/* Note - dengan tooltip untuk text panjang */}
              <td className="px-3 py-3 text-gray-700 text-sm max-w-[200px]">
                <div 
                  className="truncate" 
                  title={item.note || "-"}
                >
                  {item.note || "-"}
                </div>
              </td>

              {/* Weekly */}
              <td className="px-3 py-3">
                <motion.button
                  initial={{ backgroundColor: "#0D58AB" }}
                  whileHover={{ scale: 1.05, backgroundColor: "#0B3869" }}
                  whileTap={{ scale: 0.95 }}
                  className="rounded-lg px-3 py-1.5 text-xs text-white whitespace-nowrap font-medium"
                  onClick={() => {
                    // Pass tanggal attendance agar weekly view menampilkan minggu dari tanggal tersebut
                    const childId = item.childID?._id || item.childID;
                    const childName = item.childID?.name || "Anak Saya";
                    handleShowWeekly(childId, childName, item.date);
                  }}
                >
                  Lihat
                </motion.button>
              </td>

              {/* Action - Hanya untuk admin/teacher */}
              <td className="px-3 py-3">
                {user.role !== "parent" && (
                  <div className="flex gap-1.5">
                    <motion.button
                      initial={{ backgroundColor: "#0D58AB" }}
                      whileHover={{ scale: 1.05, backgroundColor: "#0B3869" }}
                      whileTap={{ scale: 0.95, backgroundColor: "#608FC2" }}
                      className="rounded-lg px-3 py-1.5 text-xs text-white font-medium"
                      onClick={() => {
                        setSelected(item);
                        setIsModalOpen(true);
                      }}
                    >
                      Edit
                    </motion.button>
                    
                    {item.checkIn && !item.checkOut && (
                      <motion.button
                        initial={{ backgroundColor: "#10B981" }}
                        whileHover={{ scale: 1.05, backgroundColor: "#059669" }}
                        whileTap={{ scale: 0.95 }}
                        className="rounded-lg px-2.5 py-1.5 text-xs text-white font-medium whitespace-nowrap"
                        onClick={() => {
                          setSelectedCheckout(item);
                          const checkInDate = new Date(item.checkIn);
                          checkInDate.setHours(15, 0, 0, 0);
                          setCheckoutTime(checkInDate.toISOString().slice(0, 16));
                          setIsCheckoutModalOpen(true);
                        }}
                      >
                        Checkout
                      </motion.button>
                    )}
                  </div>
                )}
                {user.role === "parent" && <span className="text-gray-400 text-sm">-</span>}
              </td>
            </tr>
            ))
          )}
        </tbody>
      </table>
      </div>

      {/* Modal Edit - Hanya untuk admin/teacher */}
      {isModalOpen && user?.role !== "parent" && (
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

      {/* Modal Checkout - Hanya untuk admin/teacher */}
      {isCheckoutModalOpen && user?.role !== "parent" && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 w-[420px] rounded-xl shadow-lg">
            <h2 className="text-xl font-bold mb-4">Set Waktu Checkout</h2>

            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Anak:</p>
              <p className="font-semibold">{selectedCheckout?.childID?.name}</p>
            </div>

            <label className="block text-sm mb-1">Waktu Checkout</label>
            <input
              type="datetime-local"
              value={checkoutTime}
              onChange={(e) => setCheckoutTime(e.target.value)}
              className="w-full p-2 border rounded-lg mb-4"
            />

            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 rounded-lg bg-gray-300"
                onClick={() => {
                  setIsCheckoutModalOpen(false);
                  setSelectedCheckout(null);
                  setCheckoutTime("");
                }}
              >
                Batal
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-[#0B3869] text-white"
                onClick={handleCheckout}
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {isWeeklyModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 w-[600px] rounded-xl shadow-lg">
            <h2 className="text-xl font-bold mb-1">Kehadiran Mingguan</h2>
            <p className="text-gray-700 font-medium mb-1">{selectedChildWeekly?.name}</p>
            {weeklyData.length > 0 && (
              <p className="text-sm text-gray-500 mb-4">
                {weeklyData[0].date.toLocaleDateString("id-ID", { day: "numeric", month: "long" })} - {weeklyData[4].date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            )}

            {loadingWeekly ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Memuat data...</p>
              </div>
            ) : (
              <div className="grid grid-cols-5 gap-3">
                {weeklyData.map((day, index) => {
                    const bgColor = !day.status 
                      ? "bg-gray-200" 
                      : day.status === "hadir" 
                      ? "bg-green-500" 
                      : day.status === "alfa" 
                      ? "bg-red-500" 
                      : day.status === "sakit" 
                      ? "bg-yellow-500" 
                      : "bg-blue-500";
                    
                    const textColor = !day.status ? "text-gray-700" : "text-white";
                    
                    return (
                      <div key={index} className={`${bgColor} ${textColor} rounded-lg p-4 text-center`}>
                        <div className="font-semibold text-sm mb-1">{day.dayName}</div>
                        <div className="text-xs mb-2">
                          {day.date.toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit" })}
                        </div>
                        <div className="text-lg font-bold">
                          {!day.status ? "-" : day.status.toUpperCase()}
                        </div>
                      </div>
                    );
                  })}
                </div>
            )}

            <div className="mt-6 flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span>Hadir</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span>Alfa</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span>Sakit</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span>Izin</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-200 rounded"></div>
                <span>Belum Ada Data</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button
                className="px-4 py-2 rounded-lg bg-gray-300"
                onClick={() => {
                  setIsWeeklyModalOpen(false);
                  setSelectedChildWeekly(null);
                  setWeeklyData([]);
                  setLoadingWeekly(false);
                }}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Create - Hanya untuk admin/teacher */}
      {isCreateModalOpen && user?.role !== "parent" && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 w-[420px] rounded-xl shadow-lg">
            <h2 className="text-xl font-bold mb-4">Input Kehadiran</h2>

            <label className="block text-sm mb-1">Nama Anak</label>
            <select
              value={newAttendance.childID}
              onChange={(e) =>
                setNewAttendance((prev) => ({ ...prev, childID: e.target.value }))
              }
              className="w-full p-2 border rounded-lg mb-4"
            >
              <option value="">Pilih Anak</option>
              {children.map((child) => (
                <option key={child._id} value={child._id}>
                  {child.name}
                </option>
              ))}
            </select>

            <label className="block text-sm mb-1">Tanggal Kehadiran</label>
            <input
              type="date"
              value={newAttendance.date}
              onChange={(e) =>
                setNewAttendance((prev) => ({ ...prev, date: e.target.value }))
              }
              className="w-full p-2 border rounded-lg mb-4"
              required
            />

            <label className="block text-sm mb-1">Status</label>
            <select
              value={newAttendance.status}
              onChange={(e) => {
                const nextStatus = e.target.value;
                setNewAttendance((prev) => ({
                  ...prev,
                  status: nextStatus,
                  checkIn: nextStatus === "hadir" ? prev.checkIn : "",
                }));
              }}
              className="w-full p-2 border rounded-lg mb-4"
            >
              <option value="hadir">Hadir</option>
              <option value="sakit">Sakit</option>
              <option value="izin">Izin</option>
              <option value="alfa">Alfa</option>
            </select>

            <label className="block text-sm mb-1">Waktu Check In (opsional)</label>
            {newAttendance.status === "hadir" ? (
              <input
                type="datetime-local"
                value={newAttendance.checkIn}
                onChange={(e) =>
                  setNewAttendance((prev) => ({ ...prev, checkIn: e.target.value }))
                }
                className="w-full p-2 border rounded-lg mb-4"
              />
            ) : (
              <p className="w-full p-3 border rounded-lg mb-4 text-sm text-gray-600 bg-gray-50">
                Anak sedang {newAttendance.status}. Check-in tidak diperlukan.
              </p>
            )}

            <label className="block text-sm mb-1">Catatan (opsional)</label>
            <textarea
              value={newAttendance.note}
              onChange={(e) =>
                setNewAttendance((prev) => ({ ...prev, note: e.target.value }))
              }
              className="w-full p-2 border rounded-lg mb-4"
            />

            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 rounded-lg bg-gray-300"
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setNewAttendance(initialFormState);
                }}
              >
                Batal
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-[#0B3869] text-white disabled:opacity-60"
                onClick={handleCreate}
                disabled={creating}
              >
                {creating ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
