// src/app/govt/register/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GovtRegister() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [designation, setDesignation] = useState("");

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        role: "govt",
        email,
        password,
        department,
        designation,
      }),
    });

    if (res.ok) {
      router.push("/login"); // ya /govt/login
    } else {
      alert("Govt registration failed");
    }
  }

  return (
    <form onSubmit={handleRegister}>
      <h2>Govt Register</h2>

      <input
        placeholder="Email"
        onChange={e => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        onChange={e => setPassword(e.target.value)}
        required
      />

      <input
        placeholder="Department"
        onChange={e => setDepartment(e.target.value)}
        required
      />

      <input
        placeholder="Designation"
        onChange={e => setDesignation(e.target.value)}
        required
      />

      <button type="submit">Register</button>
    </form>
  );
}
