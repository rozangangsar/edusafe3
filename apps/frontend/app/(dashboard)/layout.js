import React from "react";
import Navbar from "@/app/components/userPage/NavbarDesktop";
import NavbarMob from "@/app/components/userPage/NavbarMobile";

export default function DashboardLayout({ children }) {
  return (
    <>
      <Navbar />
      <NavbarMob />

      <div className=" pt-[10vh]"
        // className={`bg-[url('/background.png')] ${mechsuit.className} ${code.className}`}
      >
        {children}
      {/* <Footer /> */}
      </div>
    </>
  );
}