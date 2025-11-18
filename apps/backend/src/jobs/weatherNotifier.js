import SystemNotification from "../models/SystemNotification.js";
import { getMiddayForecast } from "../services/weather.service.js";

export function startWeatherNotifier({ lat, lon, hour = 9, minute = 0 }) {
  const latNum = typeof lat === "string" ? parseFloat(lat) : lat;
  const lonNum = typeof lon === "string" ? parseFloat(lon) : lon;

  if (!Number.isFinite(latNum) || !Number.isFinite(lonNum)) {
    console.warn("[weatherNotifier] lat/lon missing, notifier disabled.");
    return;
  }
  if (!process.env.WEATHERAPI_KEY) {
    console.warn("[weatherNotifier] WEATHERAPI_KEY not set, notifier disabled.");
    return;
  }

  const run = async () => {
    try {
      const forecast = await getMiddayForecast(latNum, lonNum);
      if (forecast.rainLikely) {
        const key = `weather-${forecast.date}`;
        const from = new Date(`${forecast.date}T02:00:00.000Z`);
        const to   = new Date(`${forecast.date}T15:00:00.000Z`);

        await SystemNotification.create({
          title: "Himbauan Hujan Siang Ini",
          body: "Perkiraan hujan antara pukul 11.00–13.00. Mohon siapkan jas hujan/payung saat penjemputan.",
          audience: "parents",
          tags: ["weather","rain"],
          validFrom: from,
          validTo: to,
          dedupeKey: key
        }).catch(err => {
          if (err?.code === 11000) return;
          throw err;
        });
      }
    } catch (e) {
      console.error("[weatherNotifier] error:", e.message);
    }
  };

  const scheduleNext = () => {
    const now = new Date();
    const next = new Date(now);
    next.setHours(hour, minute, 0, 0);
    if (next <= now) next.setDate(next.getDate() + 1);
    const wait = next.getTime() - now.getTime();
    setTimeout(() => {
      run();
      setInterval(run, 24 * 60 * 60 * 1000);
    }, wait);
  };

  scheduleNext();
}
