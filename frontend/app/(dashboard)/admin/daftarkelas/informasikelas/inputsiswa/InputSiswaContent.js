"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import Link from "next/link";
import FormContainer from "@/app/components/userPage/FormContainer";



export default function InputSiswaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const classId = searchParams.get("classId");

  const [children, setChildren] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // LOAD daftar anak DARI SEMUA KELAS (atau dari kelas tertentu)
  useEffect(() => {
    async function loadAllChildren() {
      try {
        const res = await apiFetch(`/api/children`);

        setChildren(
          res.data.map((ch) => ({
            label: `${ch.name} — orang tua: ${ch.parentID?.name || "-"}`,
            value: ch._id,
          }))
        );
      } catch (err) {
        console.error(err);
        setError("Gagal memuat daftar anak");
      }
    }

    loadAllChildren();
  }, []);

  const fields = [
    {
      id: "childID",
      label: "Pilih Anak Terdaftar",
      type: "select",
      options:
        children.length > 0
          ? children
          : [{ label: "Memuat daftar anak...", value: "" }],
    },
  ];

  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;

    const childID = form.childID.value;

    if (!childID) {
      setError("Pilih salah satu anak.");
      return;
    }

    try {
      await apiFetch(`/api/children/${childID}/transfer`, {
        method: "PATCH",
        body: JSON.stringify({ classId }),
      });

      setSuccess("Anak berhasil dimasukkan ke kelas!");

      setTimeout(() => {
        router.push(`/admin/daftarkelas/informasikelas?classId=${classId}`);
      }, 1000);
    } catch (err) {
      console.error(err);
      setError(err.message || "Gagal memindahkan anak");
    }
  }

  return (
    <div className="flex flex-col items-center mt-[10vh]">
      <FormContainer
        title="Tambah Siswa ke Kelas"
        fields={fields}
        error={error}
        success={success}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
