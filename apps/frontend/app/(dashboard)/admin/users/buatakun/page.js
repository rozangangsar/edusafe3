"use client";

import { useState, useEffect } from "react";
import FormContainer from "../../../../components/userPage/FormContainer";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function CreateAccount() {
  const [selectedRole, setSelectedRole] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const baseFields = [
    {
      id: "name",
      label: "Name",
      type: "text",
      placeholder: "isi nama lengkap",
    },
    {
      id: "email",
      label: "Email",
      type: "text",
      placeholder: "example@gmail.com",
    },
    {
      id: "phoneNumber",
      label: "Phone Number",
      type: "text",
      placeholder: "+62 123456789",
    },
    {
      id: "password",
      label: "Password",
      type: "password",
      placeholder: "********",
    },
    {
      id: "confirmPassword",
      label: "Confirm Password",
      type: "password",
      placeholder: "********",
    },
  ];

  const parentExtraFields = [

    {
      id: "childName",
      label: "Child Name",
      type: "text",
      placeholder: "isi nama lengkap anak",
    },
    {
      id: "childBirthDate",
      label: "Child Birth Date",
      type: "date",
    },
  ];

  const fields = [
    {
      id: "role",
      label: "Role",
      type: "select",
      options: [
        { value: "teacher", label: "Guru" },
        { value: "parent", label: "Orang Tua" },
      ],
    },
    ...(selectedRole === "parent" ? parentExtraFields : []),
    ...baseFields,
  ];

  useEffect(() => {
    const roleSelect = document.getElementById("role");
    if (!roleSelect) return;

    const handleChange = (e) => {
      setSelectedRole(e.target.value);
    };

    roleSelect.addEventListener("change", handleChange);
    return () => {
      roleSelect.removeEventListener("change", handleChange);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const form = e.target;

    const role = form.role.value;
    const name = form.name.value.trim();
    const email = form.email.value.trim().toLowerCase();
    const phoneNumber = form.phoneNumber?.value.trim();
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;

    const childName = form.childName?.value.trim() || "";
    const childBirthDate = form.childBirthDate?.value || "";

    const payload = {
      name,
      email,
      password,
      role,
    };
    
    if (role === "parent") {
      payload.childName = childName;
      payload.childBirthDate = childBirthDate; // 'YYYY-MM-DD'
      //payload.childClass = childClass;         // kalau mau dipakai nanti
    } 

    if (!role) {
      setError("Role wajib dipilih");
      return;
    }
    if (!name || !email || !password || !confirmPassword) {
      setError("Nama, email, dan password wajib diisi");
      return;
    }
    if (password !== confirmPassword) {
      setError("Password dan konfirmasi password tidak sama");
      return;
    }

    try {
      const newUser = await apiFetch("/api/users", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      console.log("User created:", newUser);


      setSuccess("Akun berhasil dibuat");
      form.reset();
      setSelectedRole("");

      router.push("/admin/users");
    } catch (err) {
      console.error(err);
      setError(err.message || "Gagal membuat akun");
    }
  };

  return (
    <div className="flex flex-col items-center mt-[10vh] ml-[10vh]">
      <FormContainer
        title="Buat Akun"
        fields={fields}
        onSubmit={handleSubmit}
        error={error}
        success={success}
      />
    </div>
  );
}
