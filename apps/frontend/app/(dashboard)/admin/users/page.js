"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {useRouter} from 'next/navigation';
import { useAuthGuard } from "@/hooks/useAuthGuard";
import LoadingOverlay from "../../../components/LoadingOverlay";

export default function Tabel() {
  const [accounts, setAccounts] = useState([]);
    const { user, loading } = useAuthGuard('admin');
    const router = useRouter();

        useEffect(() => {
        fetch("http://localhost:4000/api/users/accounts", {
            method: "GET",
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => {
            console.log("DATA DARI API:", data);
            setAccounts(data);
            });
        }, []);

        if (loading) {
          return <LoadingOverlay />;
        }

  return (
    <div className="flex flex-col justify-center p-[5vh] w-[90vw]">
      <div className="flex justify-between w-full p-[2vh]">
        <h1 className="font-bold text-3xl">Informasi Akun</h1>

        <motion.button
          initial={{ backgroundColor: "#0D58AB" }}
          whileHover={{ scale: 1.1, backgroundColor: "#0B3869" }}
          whileTap={{ scale: 0.9, backgroundColor: "#608FC2" }}
          className="rounded-lg py-[1vh] px-[3vh] w-fit hover:underline text-white"
          onClick={() => router.push("/admin/users/buatakun")}
        >
          Tambah Akun
        </motion.button>
      </div>

      <table className="rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-[#0B3869] text-white">
            <th className="px-4 py-3 text-left font-semibold">Name</th>
            <th className="px-4 py-3 text-left font-semibold">Nama Anak</th>
            <th className="px-4 py-3 text-left font-semibold">Email</th>
            <th className="px-4 py-3 text-left font-semibold">Role</th>
         
            <th className="px-4 py-3 text-left font-semibold">Edit</th>
          </tr>
        </thead>

     <tbody>
  {Array.isArray(accounts) &&
    accounts.map((acc, index) => (
      <tr
        key={acc.id}
        className={index % 2 === 0 ? "bg-[#DFE8F2]" : "bg-white"}
      >
        <td className="px-4 py-3 text-gray-700">{acc.name}</td>

        {/* Nama Anak */}
        <td className="px-4 py-3 text-gray-700">
          {acc.role === "parent"
            ? acc.children?.map((c) => (
                <div key={c.name}>{c.name}</div>
              ))
            : "–"}
        </td>

        <td className="px-4 py-3 text-gray-700">{acc.email}</td>
        <td className="px-4 py-3 text-gray-700">{acc.role}</td>

        

        <td className="px-4 py-3 text-gray-700">
          <motion.button
            initial={{ backgroundColor: "#0D58AB" }}
            whileHover={{ scale: 1.1, backgroundColor: "#0B3869" }}
            whileTap={{ scale: 0.9, backgroundColor: "#608FC2" }}
            className="rounded-lg p-[1vh] w-[80%] hover:underline text-white"
            onClick={() => {
              if (acc.role === "parent") {
                router.push(`/editparent?id=${acc.id}`);
              } else if (acc.role === "teacher") {
                router.push(`/editteacher?id=${acc.id}`);
              } else {
                alert("Tidak bisa edit admin!");
              }
            }}
          >
            Edit
          </motion.button>
        </td>
      </tr>
    ))}
</tbody>
      </table>
    </div>
  );
}
