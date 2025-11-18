"use client";
import FormContainer from "../../components/userPage/FormContainer";
import Navbar from "../../components/userPage/NavbarDesktop";
import React, {useState} from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useAuthGuard } from "@/hooks/useAuthGuard";

export default function CreateNotification() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuthGuard();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (user && user.role !== "admin" && user.role !== "teacher") {
    return (
      <>
      <Navbar />
      <div className="flex items-center justify-center h-[60vh]">
        Kamu tidak punya akses untuk membuat notifikasi.
      </div>
      </>
    );
  }
  const handleSubmit = async (valuesOrEvent) => {
    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      let judul = "";
      let body = "";

      //const { judul, body /*tanggal, waktuMulai, waktuselesai, body*/ } = values;

      if (valuesOrEvent?.target && valuesOrEvent.preventDefault) {
        valuesOrEvent.preventDefault();
        const formData = new FormData(valuesOrEvent.target);
        judul = (formData.get("judul") || "").toString().trim();
        body = (formData.get("body") || "").toString().trim();
      } else {
        const v = valuesOrEvent || {};
        judul = (v.judul || "").toString().trim();
        body = (v.body || "").toString().trim();
      }

      if (!judul || !body) {
        setError("Judul dan isi notifikasi wajib diisi.");
        return;
      }

      
    console.log("DEBUG submit payload:", { judul, body });
      // const startDateTime = waktuMulai
      //   ? new Date(`${tanggal}T${waktuMulai}`)
      //   : new Date(`${tanggal}T00:00`);
      // const endDateTime = waktuselesai
      //   ? new Date(`${tanggal}T${waktuselesai}`)
      //   : new Date(`${tanggal}T23:59`);

      await apiFetch("/api/broadcasts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: judul,
          content: body,
          //startsAt: startDateTime.toISOString(),
          //expiresAt: endDateTime.toISOString(),
        }),
      });

      setSuccess("Notifikasi berhasil dibuat.");
      setTimeout(() => {
        if (user?.role === "teacher") {
          router.push("/teacher/notifikasi");
        } else {
          router.push("/admin/notifikasi");
        }
      }, 500);

    } catch (err) {
      console.error("create broadcast error:", err);
      setError(err.message || "Gagal membuat notifikasi, coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <>
        <Navbar />
        <div className="mt-[12vh] text-center">Memeriksa sesi...</div>
      </>
    );
  }
  return (
    <div className="flex flex-col items-center mt-[10vh]">
      

      <FormContainer
        title="Buat Notifikasi"
        fields={[
          { id: "judul", 
            label: "Judul", 
            type: "text", 
            placeholder: "Select" 
        },

        {
        id: "tanggal",
        label: "Tanggal",
        type: "date"
        },

        {
        id: "waktuMulai",
        label: "Waktu Mulai",
        type: "time"
        },
        
        {
        id: "waktuselesai",
        label: "Waktu Selesai",
        type: "time"
        },

          { 
            id: "body", 
            label: "Isi Notifikasi", 
            type: "textarea",
            placeholder: "Maksimal 1000 karakter"
          }
        ]}
        onSubmit={handleSubmit}
        submitting={submitting}
        error={error}
        success={success}
      />
    </div>
  );
}
