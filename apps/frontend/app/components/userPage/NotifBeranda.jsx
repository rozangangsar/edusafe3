"use client";
import { motion} from 'framer-motion';
import Link from 'next/link';
import { apiFetch } from "@/lib/api";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useEffect, useState } from 'react';



const NotifBeranda = () => {  
   const {user, loading: authLoading} = useAuthGuard();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
      if (authLoading) return;
      let cancelled = false;
  
      async function load(){
        try {
          const data = await apiFetch("/api/broadcasts");
          //const data = await apiFetch("/api/broadcasts/all");
          console.log("Fetched notifications:", data);
          if (!cancelled) {
            const arr = Array.isArray(data) ? data : 
            data.broadcasts || data.items || data.data ||[];
            setNotifications(arr);
          }
      } catch (err) {
          if (!cancelled) {
            setError(err.message || "Gagal memuat notifikasi.");
          }
      } finally {
          if (!cancelled) {
            setLoading(false);
          }
      }
    }
      load();
  
      return () => {
        cancelled = true;
      };
    }, [authLoading]);
  
    if (authLoading || loading) {
      return (
         <div className="flex justify-center items-center h-[60vh]">
          Memuat notifikasi...</div>
      );
    }
    const list = notifications;
    return (
        <div className="backdrop-blur-md  drop-shadow-xl h-auto xl:w-[25vw] rounded-lg border ">
            <div className=" filter-none ">
              <h1 className="font-bold text-2xl text-white bg-[#0D58AB] rounded-t-md p-[2vh]">Berita Terbaru</h1>
              <hr className=" bg-yellow-500"></hr>
            </div>
            <div className=" "
            >
              {notifications.map((notification) => {
                return (
                  <motion.div 
                  initial={{backgroundColor: "#FFFFFF"}}
            whileHover={{  backgroundColor: "#DFE8F2" }}
                  className=" p-[2vh] " key={notification.id}>
                    <div  className=" font-bold  decoration-kuning decoration-2">
                      {notification.title}
                    </div>
                    <div className="text-slate-500 text-sm ml-[1vw]">
                      {notification.content}
                    </div>
                  </motion.div>
                );
              })}<Link href="/parent/notifikasi">
              <motion.div className='p-[2vh] border-t text-slate-500 rounded-b-md'
                initial={{ backgroundColor: "#FFFFFF"}}
                whileHover={{ backgroundColor: "#DFE8F2" }}
                >Lihat Semua</motion.div>
                </Link>
            </div>
          </div>
    );
}
export default NotifBeranda;