'use client';
import React, { useEffect, useState } from "react";
import weatherData from "@/app/components/mockData/data_center";
import ActivityBeranda from "@/app/components/userPage/ActivityBeranda";
import { apiFetch } from "@/lib/api";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import LoadingOverlay from "@/app/components/LoadingOverlay";

export default function ActivityAnakPage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weatherForecast, setWeatherForecast] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [activityList, setActivityList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user, loading: authLoading } = useAuthGuard('admin');

  useEffect(() => {
    setCurrentTime(new Date());
    const forecast = getNext6HoursWeather();
    setWeatherForecast(forecast);
  }, []);

  // Fetch aktivitas dari API
  useEffect(() => {
    if (authLoading) return;

    const fetchActivities = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await apiFetch("/api/activitychild");

        if (response && response.data) {
          // Transform data dari API ke format yang sesuai untuk display
          const transformedData = response.data.map((activity) => ({
            id: activity._id,
            style: "w-full h-full",
            type: "Aktivitas",
            name: activity.ChildID?.name || "[Nama Tidak Diketahui]",
            text: `melakukan ${activity.Activity} untuk hari ini!`,
            date: activity.Date
              ? new Date(activity.Date).toLocaleDateString("id-ID", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })
              : "-",
            time_from: activity.TimeStart || "-",
            time_to: activity.TimeEnd || "-",
            sender: activity.TeacherID?.name || "[Nama Guru]",
          }));
          setActivityList(transformedData);
        } else {
          setActivityList([]);
        }
      } catch (err) {
        console.error("Error fetching activities:", err);
        setError(err.message || "Gagal memuat aktivitas");
        setActivityList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [authLoading]);

  const getNext6HoursWeather = () => {
    const now = new Date();
    const forecast = [];

    for (let i = 0; i < 6; i++) {
      const targetDate = new Date(now.getTime() + i * 60 * 60 * 1000);
      const targetDay = targetDate.toLocaleDateString("en-US", {
        weekday: "long",
      });
      const targetHour = targetDate.getHours();
      const hourString = `${targetHour.toString().padStart(2, "0")}:00`;

      const weatherItem = weatherData.find(
        (item) => item.day === targetDay && item.hour === hourString
      );

      forecast.push({
        hour: hourString,
        weather: weatherItem ? weatherItem.weather : "sunny",
        day: targetDay,
      });
    }

    return forecast;
  };

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

  const filteredActivityList = activityList.filter((item) => {
    const matchType = !selectedType || item.type === selectedType;
    const matchDate =
      dateFilter.trim() === "" ||
      item.date.toLowerCase().includes(dateFilter.trim().toLowerCase());

    return matchType && matchDate;
  });

  if (authLoading) {
    return <LoadingOverlay />;
  }

  return (
    <div className="min-h-screen w-full bg-[#F5F7FA]">
      <main className="max-w-[80vw] mx-auto px-4 md:px-8 py-8">

        {/* JUDUL */}
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Aktivitas Anak</h1>
          <p className="text-sm text-slate-600 mt-1">{formatDate()}</p>
        </header>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* ============================================================
             🔵 BAR FILTER + BUTTON BUAT AKTIVITAS
        ============================================================ */}
        <div className="flex flex-wrap items-center gap-2 mb-6">

          {["Kelas", "Aktivitas", "Pemberitahuan"].map((type) => (
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

          {/* 🔹 SEARCH TANGGAL */}
          <input
            type="text"
            placeholder="Tanggal Kegiatan"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="border border-slate-300 rounded-md px-3 py-1 text-[11px] md:text-sm ml-auto"
          />

          {/* 🔹 TAMBAHAN BARU === BUTTON BUAT AKTIVITAS */}
          <a
            href="/inputaktivitasanak"
            className="bg-[#608FC2] text-white text-xs md:text-sm font-semibold px-4 py-2 rounded-md hover:opacity-90 transition"
          >
            Buat Aktivitas
          </a>
        </div>

        {/* LIST KARTU */}
        <div className="flex flex-col gap-5">
          {loading ? (
            <div className="text-center py-8 text-gray-500">
              Memuat aktivitas...
            </div>
          ) : filteredActivityList.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Tidak ada aktivitas ditemukan
            </div>
          ) : (
            filteredActivityList.map((item, idx) => (
              <ActivityBeranda
                key={item.id || idx}
                style={item.style}
                type={item.type}
                name={item.name}
                text={item.text}
                date={item.date}
                time_from={item.time_from}
                time_to={item.time_to}
                sender={item.sender}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
}
