"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Saran from "@/app/components/userPage/Saran";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { motion } from "framer-motion";


const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuthGuard(); 
  const [isSaranOpen, setIsSaranOpen] = useState(false);

  
  const baseRoute = pathname.startsWith("/parent")
    ? "/parent"
    : pathname.startsWith("/teacher")
    ? "/teacher"
    : pathname.startsWith("/admin")
    ? "/admin"
    : "";

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
    }
    router.push("/");
  };
  return (
    <>
    <div className="bg-[#0B3869] lg:flex justify-between items-center pl-[2vw] h-[10vh] w-full fixed top-0 z-50 shadow-md hidden">
      {/* Logo */}
      <Link href={`${baseRoute || "/"}`} className="inline-block relative">
        <Image
          src="/assets/svg/logo.svg"
          width={50}
          height={50}
          alt="Navbar Logo"
        />
      </Link>

      {/* Navbar */}
      <ul className="flex h-full">
        <motion.li 
        initial={{  backgroundPositionX: '80%' }}
        whileHover={{  backgroundColor: "#24C1DC" , backgroundPositionX: '100%'}}
        className="cursor-pointer rounded-lg font-code bg-[#0B3869]  hover:text-black text-white flex items-center justify-center h-full w-[10vw]">
          <Link href={baseRoute || "/"}  className="block w-full h-full text-center leading-[5vw]">
            Beranda
          </Link>
        </motion.li>

        <motion.li
          className="cursor-pointer rounded-lg font-code bg-[#0B3869] hover:text-black text-white flex items-center justify-center h-full w-[13vw]"
          initial={{  backgroundPositionX: '80%' }}
          whileHover={{  backgroundColor: "#24C1DC" , backgroundPositionX: '100%'}}
        >
          <Link href={`${baseRoute}/aktivitas`} className="block w-full h-full text-center leading-[5vw]">
            Aktivitas
          </Link>
        </motion.li>

        <motion.li
          className="cursor-pointer rounded-lg font-code bg-[#0B3869]  hover:text-black text-white flex items-center justify-center h-full w-[13.5vw]"
          initial={{  backgroundPositionX: '80%' }}
          whileHover={{  backgroundColor: "#FFED24" , backgroundPositionX: '100%'}}
        >
          <Link href={`${baseRoute}/kehadiran`} className="block w-full h-full text-center leading-[5vw]">
            Kehadiran
          </Link>
        </motion.li>

        <motion.li
          className="cursor-pointer rounded-lg font-code bg-[#0B3869]  hover:text-black text-white flex items-center justify-center h-full w-[9vw]"
          initial={{  backgroundPositionX: '80%' }}
          whileHover={{  backgroundColor: "#FFED24" , backgroundPositionX: '100%'}}
        >
          <Link href={`${baseRoute}/cuaca`} className="block w-full h-full text-center leading-[5vw]">
            Cuaca
          </Link>
        </motion.li>
        <motion.li
          className="cursor-pointer rounded-lg font-code bg-[#0B3869]  hover:text-black text-white flex items-center justify-center h-full w-[9vw]"
          initial={{  backgroundPositionX: '80%' }}
          whileHover={{  backgroundColor: "#FF3B8F" , backgroundPositionX: '100%'}}
        >
          <Link href={`${baseRoute}/notifikasi`} className="block w-full h-full text-center leading-[5vw]">
            Notifikasi
          </Link>
        </motion.li>

        <motion.li
           initial={{  backgroundPositionX: '80%' }}
          whileHover={{  backgroundColor: "#FF3B8F" , backgroundPositionX: '100%'}}
          className="cursor-pointer rounded-lg font-code  hover:text-black flex items-center justify-center h-full w-[10vw] bg-[#0B3869] text-white"
          onClick={() => {
            if (!user) return; // safety

            if (user.role === "admin") {
              router.push("/admin/saran");
            } else if (user.role === "parent") {
              setIsSaranOpen(true);
            } else if (user.role === "teacher") {
              router.push("/teacher/saran");
            } else {
              alert("Role tidak dikenali.");
            }
          }}
        >
          <span className="block w-full h-full text-center leading-[5vw]">
            Kritik & Saran
          </span>
        </motion.li>

        <motion.li
          className="cursor-pointer rounded-lg font-code bg-[#0B3869]  hover:text-black text-white flex items-center justify-center h-full w-[9vw]"
           initial={{  backgroundPositionX: '80%' }}
          whileHover={{  backgroundColor: "#FF3B8F" , backgroundPositionX: '100%'}}
          onClick={handleLogout}
        >
          <Link href="#" className="block w-full h-full text-center leading-[5vw]">
            Logout
          </Link>
        </motion.li>
      </ul>
    </div>
    <Saran open={isSaranOpen} onClose={() => setIsSaranOpen(false)} />
    </>
  );
};

export default Navbar;
