import React from "react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className = "bg-[#0B3869]">
    
      <div className=" grid md:grid-cols-2 md:py-[5vh] p-[10vh] gap-x-[10vw] gap-y-[5vh] ">
        <div className="text-white grid gap-y-[2vh]">
            <div className=" flex items-center gap-[2vw] ">
            <div  style={{ position: 'relative', width: '10vw', height: '10vw', maxWidth: '100px', maxHeight: '100px' }}>
              <Image src="/assets/svg/logo.svg" alt="EduSafe Logo" fill style={{ objectFit: 'contain' }} />
             
            </div>
            <h1 className="text-4xl font-bold ">EduSafe</h1>
            </div>
          <h1 className="text-2xl font-bold ">Contact</h1>

          <div className=" gap-y-[2vh] grid translate-x-[2vw]">
            <div className="flex items-center gap-x-[3vw]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '6vw', height: '6vw', maxWidth: '40px', maxHeight: '40px' }} aria-hidden>
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <span>(021) 1234-5678</span>
            </div>

            <div className="flex items-center gap-x-[3vw]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '6vw', height: '6vw', maxWidth: '40px', maxHeight: '40px' }} aria-hidden>
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <span>Jl. Pendidikan No. 123, Kota Edukasi, Indonesia</span>
            </div>

            <div className="flex items-center gap-x-[3vw]">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '6vw', height: '6vw', maxWidth: '40px', maxHeight: '40px' }} aria-hidden>
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <a href="mailto:info@namasekolah.sch.id">info@[namasekolah].sch.id</a>
            </div>
          </div>
        </div>
        
        <div className="">
          <div>
            
            <h1 className="text-2xl font-bold text-white">About us</h1>
          </div>

          <p className="text-white ">
            Sekolah kami merupakan lembaga pendidikan yang berkomitmen untuk membentuk generasi muda yang cerdas, berkarakter, dan berdaya saing tinggi. Berdiri sejak tahun [tahun berdiri], kami terus berkembang menjadi sekolah yang unggul dalam bidang akademik maupun non-akademik.
          </p>
        </div>

        
      </div>
    </footer>
  );
}
