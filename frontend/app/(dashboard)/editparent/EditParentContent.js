// File: /app/edit-parent/page.js
"use client";
import React from "react";
import FormContainer from "../../components/userPage/FormContainer";
import { useRouter, useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function EditParentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const accountId = searchParams.get("id");
  const parentFields = [
    { id: "parentName", label: "Nama Wali", type: "text", placeholder: "Select" },
    { id: "childName", label: "Nama Anak / Murid", type: "text", placeholder: "Select" },
    { id: "email", label: "Email", type: "text", placeholder: "Select" },
    { id: "password", label: "Password", type: "password", placeholder: "Select" },
    {
      id: "schoolYear",
      label: "School year",
      type: "select",
      options: [
        { value: "2022/2023", label: "2022/2023" },
        { value: "2023/2024", label: "2023/2024" },
        { value: "2024/2025", label: "2024/2025" },
      ],
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!accountId) {
      alert("ID akun tidak ditemukan di URL");
      return;
    }

    const values = {};
    parentFields.forEach((f) => {
      const el = document.getElementById(f.id);
      values[f.id] = el ? el.value : "";
    });

    try {
      await apiFetch(`/api/users/${accountId}`, {
        method: "PUT",
        body: JSON.stringify({
          role: "parent",
          name: values.parentName,
          email: values.email,
          password: values.password || undefined,
          childName: values.childName,
          schoolYear: values.schoolYear,
        }),
      });


      alert("Akun orang tua berhasil diupdate");
      router.push("/admin/users");
    } catch (err) {
      console.error(err);
      alert(err.message || "Gagal menyimpan perubahan akun orang tua");
    }
  };

  return <FormContainer title="Edit Akun Orang Tua" fields={parentFields} onSubmit={handleSubmit} />;
}
