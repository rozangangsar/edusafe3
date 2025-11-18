"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { List, X } from "lucide-react";
import Link from "next/link";
import Saran from "@/app/components/userPage/Saran";
import { useAuthGuard } from "@/hooks/useAuthGuard";

export default function NavbarMob() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaranOpen, setIsSaranOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuthGuard();

  const toggleMenu = () => setIsOpen((s) => !s);

  const baseRoute = pathname?.startsWith("/parent")
    ? "/parent"
    : pathname?.startsWith("/teacher")
    ? "/teacher"
    : pathname?.startsWith("/admin")
    ? "/admin"
    : "";

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
    }
    setIsOpen(false);
    router.push("/");
  };

  const openSaranOrNavigate = () => {
    // If user not loaded yet, just close menu and do nothing
    if (!user) return;

    if (user.role === "admin") {
      setIsOpen(false);
      router.push("/admin/saran");
    } else if (user.role === "parent") {
      setIsOpen(false);
      setIsSaranOpen(true);
    } else if (user.role === "teacher") {
      setIsOpen(false);
      router.push("/teacher/saran");
    } else {
      setIsOpen(false);
      alert("Role tidak dikenali.");
    }
  };

  // helper for link clicks to close menu after navigation
  const pushAndClose = (href) => {
    setIsOpen(false);
    router.push(href);
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-[#0B3869] text-white shadow-md lg:hidden overflow-hidden block z-50">
        <div className="flex items-center justify-between px-4 py-3 md:px-6">
          <Link href={`${baseRoute || "/"}`} className="group relative inline-block" onClick={() => setIsOpen(false)}>
            <div className="relative z-10">
              <Image
                src={'/assets/svg/logo.svg'}
                alt="Logo Edusafe"
                width={1000}
                height={1000}
                className="w-[10vw] md:w-[5vw] h-auto"
              />
            </div>
            <div className="absolute inset-0 z-0 rounded-md blur-md opacity-0 group-hover:opacity-40 transition duration-300 bg-blue-light"></div>
          </Link>

          <h1 className="font-mechsuit text-sm bg-clip-text text-transparent from-red-primary to-blue-primary">Edusafe</h1>

          <button
            className="text-blue-primary w-[10vw] md:w-[5vw]"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={50} /> : <List size={50} />}
          </button>
        </div>

        <nav
          className={` transition-all duration-300 ${
            isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          } overflow-hidden bg-[#0B3869]`}
        >
          <ul className="flex flex-col space-y-2 px-4 py-3 items-center">
            {/* Beranda */}
            <li className="w-full text-center">
              <button
                onClick={() => pushAndClose(baseRoute || "/")}
                className="block w-full text-white font-code py-2"
              >
                Beranda
              </button>
            </li>

            {/* Aktivitas */}
            <li className="w-full text-center">
              <button
                onClick={() => pushAndClose(`${baseRoute}/aktivitas`)}
                className="block w-full text-white font-code py-2"
              >
                Aktivitas
              </button>
            </li>

            {/* Kehadiran */}
            <li className="w-full text-center">
              <button
                onClick={() => pushAndClose(`${baseRoute}/kehadiran`)}
                className="block w-full text-white font-code py-2"
              >
                Kehadiran
              </button>
            </li>

            {/* Cuaca */}
            <li className="w-full text-center">
              <button
                onClick={() => pushAndClose(`${baseRoute}/cuaca`)}
                className="block w-full text-white font-code py-2"
              >
                Cuaca
              </button>
            </li>

            {/* Notifikasi */}
            <li className="w-full text-center">
              <button
                onClick={() => pushAndClose(`${baseRoute}/notifikasi`)}
                className="block w-full text-white font-code py-2"
              >
                Notifikasi
              </button>
            </li>

            {/* Kritik & Saran (role-dependent) */}
            <li className="w-full text-center">
              <button
                onClick={openSaranOrNavigate}
                className="block w-full text-white font-code py-2"
              >
                Kritik & Saran
              </button>
            </li>

            {/* Logout */}
            <li className="w-full text-center">
              <button
                onClick={handleLogout}
                className="block w-full text-white font-code py-2"
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </header>

      <Saran open={isSaranOpen} onClose={() => setIsSaranOpen(false)} />
    </>
  );
}
