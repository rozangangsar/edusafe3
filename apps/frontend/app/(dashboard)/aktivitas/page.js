'use client';

import React, { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import ActivityBeranda from "@/app/components/userPage/ActivityBeranda";

export default function ActivityAnakPage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activityList, setActivityList] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔵 FETCH DATA DARI BACKEND
  useEffect(() => {
    async function load() {
      try {
        const res = await apiFetch("/api/activitychild");
        const rows = res.data || [];

        // Format data supaya sesuai komponen kartu
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
            type: "Aktivitas",                     // default → karena semua dari ActivityChild
            name: item.ChildID?.name || "-",
            text: item.Activity,
            date: tanggal,
            time_from: item.TimeStart,
            time_to: item.TimeEnd,
            sender: item.TeacherID?.name || "Guru",
          };
        });

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

  // 🔵 FILTER LIST
  const filteredActivityList = activityList.filter((item) => {
    const matchType = !selectedType || item.type === selectedType;

    const matchDate =
      dateFilter.trim() === "" ||
      item.date.toLowerCase().includes(dateFilter.trim().toLowerCase());

    return matchType && matchDate;
  });

  if (loading)
    return <p className="text-center mt-20 text-slate-600">Memuat aktivitas...</p>;

  return (
    <div className="min-h-screen w-full bg-[#F5F7FA]">
      <main className="max-w-[80vw] mx-auto px-4 md:px-8 py-8">

        {/* JUDUL */}
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Aktivitas Anak</h1>
          <p className="text-sm text-slate-600 mt-1">{formatDate()}</p>
        </header>

        {/* FILTER BAR */}
        <div className="flex flex-wrap items-center gap-2 mb-6">

          {["Aktivitas"].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setSelectedType(type)}
              className={`flex items-center gap-2 text-xs md:text-sm font-semibold px-4 py-1 rounded-full ${
                selectedType === type
                  ? "bg-[#608FC2] text-white"
                  : "border border-slate-300 text-slate-700 bg-transparent"
              }`}
            >
              <span>{type}</span>

              {selectedType === type && (
                <span
                  className="text-[10px] bg-black/20 rounded-full px-2 py-0.5 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedType("");
                  }}
                >
                  X
                </span>
              )}
            </button>
          ))}

          {/* SEARCH TANGGAL */}
          <input
            type="text"
            placeholder="Cari tanggal"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="border border-slate-300 rounded-md px-3 py-1 text-[11px] md:text-sm ml-auto"
          />

          {/* BUTTON BUAT AKTIVITAS */}
          <a
            href="/inputaktivitasanak"
            className="bg-[#608FC2] text-white text-xs md:text-sm font-semibold px-4 py-2 rounded-md hover:opacity-90 transition"
          >
            Buat Aktivitas
          </a>
        </div>

        {/* LIST KARTU */}
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
