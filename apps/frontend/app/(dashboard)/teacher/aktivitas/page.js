'use client';

import React, { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import ActivityBeranda from "@/app/components/userPage/ActivityBeranda";

export default function ActivityAnakPage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activityList, setActivityList] = useState([]);
  const [dateFilter, setDateFilter] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔵 FETCH DATA DARI BACKEND
 useEffect(() => {
  async function load() {
    try {
      const res = await apiFetch("/api/activitychild");
      const rows = res.data || [];

      const mapped = rows.map((item) => {
        const dateObj = new Date(item.Date);
        const tanggal = dateObj.toLocaleDateString("id-ID", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        return {
          style: "w-full h-full",
          type: item.ChildID?.name || "Aktivitas",
          name: item.ChildID?.name ?? "(tanpa nama)",
          text: item.Activity,
          date: tanggal,
          time_from: item.TimeStart,
          time_to: item.TimeEnd,
          sender: item.TeacherID?.name || "Guru",
        };
      }); // ← KURUNG TUTUP MAP DI SINI

      setActivityList(mapped);

    } catch (err) {
      console.error("Gagal ambil aktivitas:", err);

    } finally {
      setLoading(false);
    }
  }

  load();
  setCurrentTime(new Date());
}, []);

  // 🔵 Format tanggal header
  const formatDate = () => {
    const days = [
      "Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu",
    ];
    const months = [
      "Januari","Februari","Maret","April","Mei","Juni",
      "Juli","Agustus","September","Oktober","November","Desember",
    ];

    return `${days[currentTime.getDay()]}, ${currentTime.getDate()} ${months[currentTime.getMonth()]} ${currentTime.getFullYear()}`;
  };

  // 🔵 FILTER BERDASARKAN TANGGAL
  const filteredActivityList = activityList.filter((item) => {
    return (
      dateFilter.trim() === "" ||
      item.date.toLowerCase().includes(dateFilter.trim().toLowerCase())
    );
  });

  if (loading)
    return <p className="text-center mt-20 text-slate-600">Memuat aktivitas...</p>;

  return (
    <div className="min-h-screen w-full bg-[#F5F7FA]">
      <main className="max-w-[80vw] mx-auto px-4 md:px-8 py-8">

        <header className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Aktivitas Anak</h1>
          <p className="text-sm text-slate-600 mt-1">{formatDate()}</p>
        </header>

        {/* FILTER BAR */}
        <div className="flex flex-wrap items-center gap-2 mb-6">

          {/* Tidak ada tombol filter lagi */}

          <input
            type="text"
            placeholder="Cari tanggal"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="border border-slate-300 rounded-md px-3 py-1 text-[11px] md:text-sm ml-auto"
          />

          <a
            href="/inputaktivitasanak"
            className="bg-[#608FC2] text-white text-xs md:text-sm font-semibold px-4 py-2 rounded-md hover:opacity-90 transition"
          >
            Buat Aktivitas
          </a>
        </div>

        <div className="flex flex-col gap-5">
          {filteredActivityList.map((item, idx) => (
            <ActivityBeranda
              key={idx}
              style={item.style}
              type={item.type}
              name={item.name}
              text={item.text}
              date={item.date}
              time_from={item.time_from}
              time_to={item.time_to}
              sender={item.sender}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
