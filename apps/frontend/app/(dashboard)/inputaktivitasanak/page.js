"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import FormContainer from "../../components/userPage/FormContainer";
import { useRouter } from "next/navigation";
import { useAuthGuard } from "@/hooks/useAuthGuard";

export default function InputAktivitasAnak() {
  // HOOK SELALU DI ATAS
  const { user, loading: authLoading } = useAuthGuard("teacher");
  const router = useRouter();

  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);

  // FETCH DATA ANAK
  useEffect(() => {
    if (authLoading) return; // 🔥 JANGAN RETURN KOMPONEN DI SINI

    async function load() {
      try {
        const res = await apiFetch("/api/children");
        setChildren(res.data || []);
      } catch (err) {
        console.error("Gagal load anak:", err);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [authLoading]);

  // 🔥 aman karena dipanggil SETELAH semua hook
  if (authLoading) {
    return <p className="mt-20 text-center">Cek akses...</p>;
  }

  if (loading) {
    return <p className="mt-20 text-center">Loading...</p>;
  }

  const aktivitasOptions = [
    "Senam Pagi",
    "Kegiatan Bermain",
    "Kegiatan Bercerita",
    "Makan Siang",
    "Jam Pulang",
  ];

  async function handleSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.target);

    const payload = {
      ChildID: form.get("ChildID"),
      Activity: form.get("Activity"),
      Date: form.get("Date"),
      TimeStart: form.get("TimeStart"),
      TimeEnd: form.get("TimeEnd"),
      AdditionalNotes: form.get("AdditionalNotes"),
    };

    try {
      await apiFetch("/api/activitychild", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      alert("Aktivitas berhasil ditambahkan!");
      router.push("/admin/aktivitas");
    } catch (err) {
      console.error(err);
      alert("Gagal menambah aktivitas");
    }
  }

  return (
    <div className="flex flex-col items-center mt-[10vh]">
      <FormContainer
        title="Input Aktivitas Anak"
        onSubmit={handleSubmit}
        fields={[
          {
            id: "ChildID",
            label: "Pilih Anak",
            type: "select",
            options: children.map((c) => ({
              value: c._id,
              label: `${c.name} (${c.classId?.name})`,
            })),
            placeholder: "Pilih anak",
          },
          {
            id: "Activity",
            label: "Jenis Aktivitas",
            type: "select",
            options: aktivitasOptions.map((a) => ({ value: a, label: a })),
            placeholder: "Pilih aktivitas",
          },
          { id: "Date", label: "Tanggal", type: "date" },
          { id: "TimeStart", label: "Waktu Mulai", type: "time" },
          { id: "TimeEnd", label: "Waktu Selesai", type: "time" },
          {
            id: "AdditionalNotes",
            label: "Catatan Tambahan",
            type: "textarea",
            placeholder: "Opsional",
          },
        ]}
      />
    </div>
  );
}
