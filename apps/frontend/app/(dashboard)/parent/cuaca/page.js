"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Sun,
  Cloud,
  CloudDrizzle,
  CloudLightning
} from "lucide-react";

export default function CuacaPage() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  const [weekly, setWeekly] = useState([]);
  const [loadingWeekly, setLoadingWeekly] = useState(true);

  
  useEffect(() => {
    async function fetchWeather() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/weather/midday?lat=-0.002122&lon=109.369550`,
          { cache: "no-store" }
        );
        const json = await res.json();
        setWeather(json);
      } catch (err) {
        console.error("Failed to fetch weather:", err);
      }
      setLoading(false);
    }

    fetchWeather();
  }, []);


  useEffect(() => {
    async function fetchWeekly() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/weather/weekly?lat=-0.002122&lon=109.369550`,
          { cache: "no-store" }
        );
        const json = await res.json();
        setWeekly(json.days);
      } catch (e) {
        console.error("Failed to fetch weekly weather", e);
      }
      setLoadingWeekly(false);
    }

    fetchWeekly();
  }, []);

  if (loading) return <div className="p-10 text-xl">Memuat data cuaca...</div>;
  if (!weather || !weather.hours || weather.hours.length === 0)
    return <div className="p-10 text-xl">Cuaca tidak tersedia</div>;


  function mapWeather(text) {
    if (/storm|thunder/i.test(text)) return CloudLightning;
    if (/rain|shower|hujan/i.test(text)) return CloudDrizzle;
    if (/cloud|overcast|mendung/i.test(text)) return Cloud;
    return Sun;
  }

  const current = weather.hours[0];
  const IconNow = mapWeather(current.weather);

  return (
    <section className="relative min-h-screen bg-gradient-to-b from-[#DDEFFD] via-white to-[#FDF0B5] py-12">

      {/* BACKGROUND */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 -right-16 h-64 w-64 rounded-full bg-[#FFED24]/20 blur-3xl" />
        <div className="absolute top-40 -left-24 h-72 w-72 rounded-full bg-[#24C1DC]/20 blur-3xl" />
        <div className="absolute inset-x-0 bottom-24 mx-auto h-40 w-11/12 rounded-[40px] bg-white/40 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-[1400px] px-4 sm:px-10 lg:px-14 xl:px-16 flex flex-col gap-10">

        {/* ===== HEADER ===== */}
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-[#0B1F36] lg:text-5xl"
          >
            Prediksi Cuaca di Area Sekolah
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3 rounded-full bg-white/80 px-5 py-2 shadow-lg"
          >
            <div className="rounded-full bg-[#FFED24] p-2 text-[#0B3869]">
              <Sun className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#0B3869]/70">Terakhir diperbarui</p>
              <p className="text-sm font-bold text-[#0B3869]">{current.timeLocal} WIB</p>
            </div>
          </motion.div>
        </div>

        {/* ===== CARD UTAMA ===== */}
        <div className="rounded-[32px] bg-white/55 p-6 shadow-2xl ring-1 ring-white/60 backdrop-blur">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] xl:gap-12">

            {/* ========== LEFT COLUMN (Hourly Forecast) ========== */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-[20px] border-[6px] border-[#608FC2] bg-white shadow-xl overflow-hidden"
              >
                {/* Header */}
                <div className="bg-[#FFED24] px-6 py-4 border-b border-[#608FC2]/30">
                  <p className="text-lg font-bold text-[#0B1F36]">{weather.date}</p>
                  <p className="text-sm font-semibold text-[#0B1F36]/70">
                    {weather.rainLikely ? "Waspada kemungkinan hujan" : "Jadwal kegiatan sekolah aman"}
                  </p>
                </div>

                {/* Current Weather */}
                <div className="bg-gradient-to-br from-[#A9E6F1] to-white px-6 py-8">
                  <div className="grid gap-6 lg:grid-cols-[1fr_auto]">

                    <div>
                      <p className="text-4xl font-bold text-[#0B1F36]">{current.timeLocal}</p>
                      <p className="mt-2 text-6xl font-black text-[#0B1F36]">{current.temp}°</p>
                      <p className="text-lg font-semibold text-[#0B3869]">{current.weather}</p>

                      <p className="mt-4 rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-[#0B3869]">
                        Area Sekolah
                      </p>
                    </div>

                    <div className="flex flex-col items-center justify-center text-[#0B3869]">
                      <IconNow className="h-32 w-32 text-[#FFD84D]" />
                      <p className="mt-2 text-xl font-semibold">{current.weather}</p>
                    </div>

                  </div>
                </div>

                {/* Hour list */}
                <div className="divide-y divide-[#608FC2]/20">
                  {weather.hours.map((h, i) => {
                    const Icon = mapWeather(h.weather);
                    return (
                      <div key={i} className="flex items-center justify-between px-6 py-4 bg-white text-[#0B1F36]">
                        <div className="flex items-center gap-4">
                          <div className="rounded-full bg-white/60 p-2">
                            <Icon className="h-8 w-8" />
                          </div>

                          <div>
                            <p className="text-base font-semibold">{h.weather}</p>
                            <p className="text-xs text-[#0B3869]/70">
                              Potensi hujan {(h.pop * 100).toFixed(0)}%
                            </p>
                          </div>
                        </div>

                        <p className="text-2xl font-bold">{h.timeLocal}</p>
                      </div>
                    );
                  })}
                </div>

              </motion.div>
            </div>

            {/* ========== RIGHT COLUMN (Weekly Forecast) ========== */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-[24px] border-[6px] border-[#608FC2] bg-white shadow-xl p-4 h-fit"
              >

                <p className="text-2xl font-bold text-[#0B1F36] mb-4">Cuaca 3 Hari ke Depan</p>

                {loadingWeekly && <p>Memuat cuaca...</p>}

                {!loadingWeekly && weekly.length === 0 && (
                  <p className="text-sm text-gray-500">Data cuaca tidak tersedia.</p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {weekly.map((d, i) => (
                    <div
                      key={i}
                      className="flex flex-col items-center bg-white rounded-xl shadow p-4 border border-[#d0ddee]"
                    >
                      <img src={`https:${d.icon}`} className="h-10 mb-2" />

                      <p className="font-bold text-[#0B1F36]">{d.date}</p>

                      <p className="text-sm text-gray-600">{d.day}</p>

                      <p className="text-xl font-bold mt-2">{d.maxTemp}°C</p>

                      <p className="text-xs text-[#0B3869]/70">Hujan: {d.rainChance}%</p>
                    </div>
                  ))}
                </div>
              </motion.div>


          </div>
        </div>
      </div>
    </section>
  );
}
