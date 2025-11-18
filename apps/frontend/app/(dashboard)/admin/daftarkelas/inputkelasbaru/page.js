"use client";

import { useRouter } from "next/navigation";
import FormContainer from "../../../../components/userPage/FormContainer";
import { apiFetch } from "@/lib/api";
import { useState, useEffect } from "react";

export default function CreateClassPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [teachers, setTeachers] = useState([]);


  useEffect(() => {
    async function loadTeachers() {
      try {
        const res = await apiFetch("/api/users/teachers");
        setTeachers(res || []);
      } catch (err) {
        console.error("Gagal load teacher:", err);
      }
    }
    loadTeachers();
  }, []);


  const fields = [
    {
      id: "name",
      label: "Nama Kelas",
      type: "text",
      placeholder: "contoh : 1A",
    },
    {
      id: "grade",
      label: "Tingkat (angka)",
      type: "number",
      placeholder: "1",
      min: 0,
      max: 100,
      step: 1,
    },
    {
      id: "schoolyear",
      label: "Tahun Ajaran",
      type: "text",
      placeholder: "2025/2026",
    },
    {
      id: "teacher",
      label: "Wali Kelas",
      type: "select",
      options: teachers.length
        ? teachers.map((t) => ({
            label: t.name,
            value: t._id,
          }))
        : [{ label: "Memuat guru...", value: "" }],
    },
  ];


  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;

    const selectedTeacher = form.teacher.value;

    const payload = {
      name: form.name.value,
      grade: Number(form.grade.value),
      schoolYear: form.schoolyear.value,
      homeroomTeacherIDs: [selectedTeacher],
    };


    if (!payload.name || !payload.schoolYear || !payload.grade || !selectedTeacher) {
      setError("Nama, tingkat, guru, dan tahun ajaran wajib diisi.");
      setSuccess("");
      return;
    }


    if (!selectedTeacher) {
      setError("Wali kelas wajib dipilih.");
      setSuccess("");
      return;
    }


    try {
      setError("");

      await apiFetch("/api/classes", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setSuccess("Kelas berhasil dibuat");
      router.push("/daftarkelas");
    } catch (err) {
      console.error(err);
      setError(err.message || "Gagal membuat kelas");
      setSuccess("");
    }
  }

  return (
    <div className="flex flex-col items-center mt-[10vh] w-full">
      <FormContainer
        title="Input Kelas Baru"
        fields={fields}
        onSubmit={handleSubmit}
        error={error}
        success={success}
      />
    </div>
  );
}
