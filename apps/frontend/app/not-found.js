"use client";


import Image from "next/image";
import Link from "next/link";

export default function NotFoundPage(){
    return(
        <>
        

        <div className="pt-[12vh] min-h-screen flex flex-col justify-center items-center bg-white px-6 pb-16 text-center">
        <Image
          src="/assets/images/404_webpage.png"
          alt="404 Illustration"
          width={765}
          height={550}
          className="w-full max-w-xs sm:max-w-md md:max-w-lg"
        />

        <h1 className="text-[#0B3869] font-extrabold text-4xl sm:text-6xl md:text-7xl tracking-wide mt-8">
          404-error
        </h1>

        <h2 className="text-[#0B3869] font-semibold text-xl sm:text-2xl tracking-wide mt-2">
          PAGE NOT FOUND
        </h2>

        <p className="text-gray-500 text-base sm:text-lg max-w-sm mt-4">
          Ups! Halaman ini belum tersedia di EduSafe.
        </p>

       
        <Link
          href="/"
          className="mt-6 bg-[#0B3869] text-white px-6 py-3 rounded-lg hover:bg-[#0a2c53] transition"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </>
  );
}