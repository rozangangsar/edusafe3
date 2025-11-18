"use client";
import React, { useEffect, useState } from "react";
import { motion }  from 'framer-motion';
import weatherData from "../mockData/data_center";
import Link from "next/link";


const CuacaBeranda = ( {weather} ) => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [weatherForecast, setWeatherForecast] = useState([]);
    useEffect(() => {
        // Update current time
        setCurrentTime(new Date());
        
        // Get weather forecast for next 6 hours
        const forecast = getNext6HoursWeather();
        setWeatherForecast(forecast);
    }, []);
      const getNext6HoursWeather = () => {
        const now = new Date();
        const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
        const currentHour = now.getHours();
        
        const forecast = [];
        
        for (let i = 0; i < 6; i++) {
            const targetDate = new Date(now.getTime() + i * 60 * 60 * 1000);
            const targetDay = targetDate.toLocaleDateString('en-US', { weekday: 'long' });
            const targetHour = targetDate.getHours();
            const hourString = `${targetHour.toString().padStart(2, '0')}:00`;
            
            const weatherItem = weatherData.find(
                item => item.day === targetDay && item.hour === hourString
            );
            
            forecast.push({
                hour: hourString,
                weather: weatherItem ? weatherItem.weather : 'sunny',
                day: targetDay
            });
        }
        
        return forecast;
    };
       const formatDate = () => {
        const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                       'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        
        const dayName = days[currentTime.getDay()];
        const date = currentTime.getDate();
        const month = months[currentTime.getMonth()];
        const year = currentTime.getFullYear();
        
        return `${dayName}, ${date} ${month} ${year}`;
    };
   
    return(
        <div className="rounded-t-lg bg-[#FFED24] flex flex-col">
            <div className="lg:flex justify-between px-6 py-4 items-center">
                <div>
                    <div className="font-bold text-2xl text-[#0B3869]"> Cuaca Hari Ini</div>
                    <div className="text-sm mt-1"> {formatDate()}</div>
                </div>
                <div className="mt-3 lg:mt-0"> 
                <Link href="/parent/cuaca">
                    <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-[#0B3869] rounded-lg px-4 py-2 text-white text-sm font-medium shadow-md hover:shadow-lg transition-shadow"
                    >
                    Lebih Lanjut
                    </motion.button>
                </Link>
                </div>
            </div>
            <div className="grid grid-cols-3 lg:grid-cols-6 font-bold text-center">
                  {weatherForecast.map((item, index) => (
                    <div key={index} className={`flex flex-col items-center justify-center py-4 px-2 ${index % 2 === 0 ? 'bg-yellow-200' : 'bg-white'}`}>
                        <div className="text-sm mb-1">{item.hour}</div>
                        <div className="text-2xl my-2">☁️</div>
                        <div className="capitalize text-xs">{item.weather}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}
export default CuacaBeranda;
    