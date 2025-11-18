"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";


export default function LandingPage() {
  return (
    <div className="relative  min-h-screen overflow-hidden">

      {/* Background Image */}
      <motion.div className=" fixed inset-0 -z-10 w-screen h-screen overflow-hidden"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.65 , ease: "easeOut" }}>
        <Image
          src="/assets/images/kindergarten.png"
          alt="Children in a classroom setting"
          height={1920}
          width={1080}

          
          
          className=" w-full h-full absolute object-cover object-[center top] "
        />
        <div className="absolute inset-0 bg-black/30"></div>
      </motion.div>


      {/* = NAVBAR = */}
      <nav className="top-0 left-0 w-full h-[139px] flex items-center justify-between px-[41px] z-20">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
        >
       
        {/* LOGO */}
        <Image
          src="/assets/svg/logo.svg"
          alt="EduSafe Logo"
          width={77}
          height={87}
          className="w-[77px] h-[87px]"
        />
         </motion.div>

        {/* NAV LINKS */}
        <motion.div 
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.65, ease: "easeOut" }}
        className="flex items-center gap-10 font-nunito text-white font-bold text-[21px]">
          <Link href="#cta" className="hover:text-[#50B0E5] transition">About Us</Link>
        </motion.div>
      </nav>

      {/* = HERO CONTENT = */}
      <section className="relative z-10 flex items-center justify-center pb-[20vh] min-h-screen">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[1vh] max-w-7xl w-full px-[41px] ">

          {/* LEFT — HERO TITLE */}
          <div className="flex flex-col md:items-start items-center overflow-hidden"> 
            <motion.h1
              className="text-white text-[60px] lg:text-[88px] lg:text-left text-center font-bold "
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.65, ease: "easeOut" }}
            >
              Welcome to<br />EduSafe.
            </motion.h1>

            <Link href="/login" className="no-underline">
            <motion.button
              className="mt-8 w-[260px] h-[66px] rounded-[60px] border border-white/25 
                         bg-[#333] text-white text-[24px] font-semibold
                        "
              initial={{ opacity: 1, scale: 0.9 }}
              whileHover={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2}}
            >
              Get started
            </motion.button>
            </Link>
          </div>

          {/* RIGHT — HERO TEXT */}
          <motion.div className="text-white font-nunito font-bold text-[25px] leading-[37.5px] text-justify max-w-[699px]"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.65, ease: "easeOut" }}
          >
            <p>
              Edusafe hadir untuk mendekatkan guru dan orang tua dalam mendampingi tumbuh kembang anak di sekolah.
              Melalui pencatatan aktivitas harian, kehadiran, dan komunikasi yang terpusat, setiap momen kecil anak
              menjadi lebih terlihat dan bermakna.
            </p>

            <p className="mt-6">
              Dengan informasi yang cepat, jelas, dan aman, Edusafe membantu orang tua merasa tenang,
              dan guru merasa lebih didukung dalam perannya.
            </p>
          </motion.div>
        </div>
      </section>

      {/*  = WHY US =  */}
      <section id="whyus" className="bg-white py-24 sm:py-32 font-jakartasans">
        <div className="max-w-7xl mx-auto px-[41px]">

          <motion.h2 
           initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.65, ease: "easeOut" }}
          className="text-center font-semibold text-6xl lg:text-7xl text-brand-blue-dark tracking-tight">
            Why Us?
          </motion.h2>

          <div className="mt-20 grid md:grid-cols-3 gap-12">
            {[
              {
                img: "/assets/images/safetrusted.png",
                title: "Safe & Trusted",
                desc: "Platform kami menjamin keamanan data dan kenyamanan bagi orang tua dan guru."
              },
              {
                img: "/assets/images/realtimemonitoring.png",
                title: "Real-time Monitoring",
                desc: "Pantau aktivitas anak secara langsung kapan saja dan dari mana saja."
              },
              {
                img: "/assets/images/easytouse.png",
                title: "Easy to Use",
                desc: "Aplikasi didesain agar mudah digunakan oleh siapa pun tanpa pelatihan."
              },
            ].map((item, i) => (
              <motion.div key={i} className="text-center"
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.65, ease: "easeOut" }}
              >
                <Image
                  src={item.img}
                  alt={item.title}
                  width={600}
                  height={400}
                  className="w-full h-[40vh] object-cover rounded-xl shadow-lg"
                />

                <h3 className="mt-8 font-bold text-4xl text-brand-blue-dark">
                  {item.title}
                </h3>
                <p className="mt-4 text-2xl text-brand-blue-dark max-w-sm mx-auto">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* = CTA SECTION = */}
      <section id="cta" className="bg-white py-28 font-jakartasans">
        <motion.div
         initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.65, ease: "easeOut" }}
        className="max-w-7xl mx-auto px-[41px] grid lg:grid-cols-2 gap-16 items-center">

          <Image
            src="/assets/images/selamatdatang.png"
            width={1920}
            height={1080}
            alt="Teacher reading to children"
            className="object-contain"
          />

          <motion.div
          initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.65, delay: 0.1, ease: "easeOut" }}
          className="space-y-6">
            <h2 className="font-bold text-5xl text-brand-blue-dark">Selamat Datang di Sekolah Kami</h2>

            <p className="text-2xl text-brand-blue-dark leading-relaxed">
              Kami menyediakan lingkungan belajar yang aman dan menyenangkan untuk anak-anak.
              Guru berpengalaman kami selalu siap mendampingi siswa dalam proses pembelajaran
              dan pengembangan diri.
            </p>

            <Link href="/login" className="no-underline">
            <motion.button
            initial={{ backgroundColor: "#ffffff" }}
              whileHover={{ backgroundColor: "#FFC0CB"}}
              transition={{ duration: 10 }}
            className="px-12 py-3 border-2 border-brand-blue-dark rounded-full text-brand-blue-dark 
                               hover:bg-brand-blue-dark hover:text-white transition-colors text-xl">
              <motion.div
              
              className="w-full h-full ">
              Login
             </motion.div>
            </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

    </div>
  );
}
