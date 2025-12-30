"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/* ---------------- TYPES ---------------- */

type FormData = {
  email: string;
  password: string;

  factoryName: string;
  factoryType: string;
  designation: string;
  establishedYear: string;
  employees: string;
  ownerName: string;

  mobile: string;
  alternateMobile: string;
  factoryPhone: string;

  gst: string;
  pan: string;
  cin: string;
  pcbRegistrationId: string;
  consentStatus: string;
  operationalStatus: "Running" | "Closed";
  workingHours: string;

  estimatedDailyEmission: string;
  chimneyHeight: string;

  address: string;
  area: string;
  district: string;
  state: string;
  pincode: string;
  latitude: string;
  longitude: string;
};

/* ---------------- COMPONENT ---------------- */

export default function FactoryRegister() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<FormData>({
    email: "",
    password: "",

    factoryName: "",
    factoryType: "",
    designation: "",
    establishedYear: "",
    employees: "",
    ownerName: "",

    mobile: "",
    alternateMobile: "",
    factoryPhone: "",

    gst: "",
    pan: "",
    cin: "",
    pcbRegistrationId: "",
    consentStatus: "Pending",
    operationalStatus: "Running",
    workingHours: "",

    estimatedDailyEmission: "",
    chimneyHeight: "",

    address: "",
    area: "",
    district: "",
    state: "",
    pincode: "",
    latitude: "",
    longitude: "",
  });

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  /* ---------------- SUBMIT ---------------- */

  async function submit() {
    if (
      !form.factoryName ||
      !form.factoryType ||
      !form.email ||
      !form.password ||
      !form.mobile ||
      !form.gst ||
      !form.latitude ||
      !form.longitude
    ) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      /* 1️⃣ REGISTER */
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: "factory",
          ...form,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Register failed");
        setLoading(false);
        return;
      }

      const factoryId = data.factoryId;
      if (!factoryId) {
        console.warn("factoryId missing from register response");
      }

      /* 2️⃣ BACKFILL (🔥 background, NOT awaited) */
      fetch(
        `${process.env.NEXT_PUBLIC_FASTAPI_URL}/satellite/backfill`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            factoryId,
            days: 7, // 👈 keep 7 for demo / judges
          }),
        }
      ).catch((err) => {
        console.warn("Backfill failed (ignored):", err);
      });

      /* 3️⃣ DONE */
      setLoading(false);
      router.push("/factory/login");

    } catch (err) {
      console.error(err);
      alert("Something went wrong");
      setLoading(false);
    }
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-black text-white">
      <div className="hidden lg:flex items-center justify-center" />

      <div className="flex items-center justify-center px-6">
        <div className="w-full max-w-xl">

          <div className="flex items-center gap-3 mb-10">
            <img src="/logo.png" className="h-16 w-20 object-contain" />
            <span className="text-4xl font-semibold text-indigo-400">
              Corevia
            </span>
          </div>

          <h1 className="text-2xl font-semibold mb-8 text-center">
            Factory Registration
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input label="Factory Name *" value={form.factoryName} onChange={(v) => update("factoryName", v)} />
            <Input label="Factory Type *" value={form.factoryType} onChange={(v) => update("factoryType", v)} />
            <Input label="Email *" type="email" value={form.email} onChange={(v) => update("email", v)} />
            <Input label="Password *" type="password" value={form.password} onChange={(v) => update("password", v)} />
            <Input label="Mobile *" value={form.mobile} onChange={(v) => update("mobile", v)} />
            <Input label="GST Number *" value={form.gst} onChange={(v) => update("gst", v)} />
            <Input label="Latitude *" value={form.latitude} onChange={(v) => update("latitude", v)} />
            <Input label="Longitude *" value={form.longitude} onChange={(v) => update("longitude", v)} />
          </div>

          <button
            onClick={submit}
            disabled={loading}
            className="w-full mt-10 py-3 rounded-md bg-indigo-500 hover:bg-indigo-600 transition font-medium"
          >
            {loading ? "Registering..." : "Register"}
          </button>

          <p className="text-xs text-gray-500 text-center mt-6">
            By registering, you agree to our Terms & Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}

/* ---------------- INPUT ---------------- */

function Input(props: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wide text-gray-400 mb-2">
        {props.label}
      </label>
      <input
        type={props.type || "text"}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-md bg-white/5 border border-[#1E293B]
        focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30"
      />
    </div>
  );
}
