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

      // 🔥 background backfill (non-blocking)
      fetch(`${process.env.NEXT_PUBLIC_FASTAPI_URL}/satellite/backfill`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ factoryId, days: 7 }),
      }).catch(() => {});

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
    <div
      className="
        min-h-screen w-full relative text-white
        bg-[url('/loginbg.png')] bg-cover bg-center bg-no-repeat
      "
    >
      {/* DARK OVERLAY */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-[1px]" />

      {/* CONTENT */}
      <div className="relative z-10 min-h-screen grid grid-cols-1 lg:grid-cols-2">
        {/* LEFT EMPTY */}
        <div className="hidden lg:block" />

        {/* RIGHT FORM */}
        <div className="flex items-center justify-center px-4 sm:px-6 py-10">
          <div className="w-full max-w-[640px] rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 sm:p-8 shadow-2xl">

            {/* LOGO */}
            <div className="flex items-center gap-3 mb-6">
              <img src="/logo.png" className="h-10 w-10 object-contain" />
              <span className="text-2xl font-semibold text-indigo-400">
                Corevia
              </span>
            </div>

            <h1 className="text-xl font-semibold mb-6 text-center">
              Factory Registration
            </h1>

            {/* FORM GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Factory Name *" value={form.factoryName} onChange={(v) => update("factoryName", v)} />
              <Input label="Factory Type *" value={form.factoryType} onChange={(v) => update("factoryType", v)} />
              <Input label="Email *" type="email" value={form.email} onChange={(v) => update("email", v)} />
              <Input label="Password *" type="password" value={form.password} onChange={(v) => update("password", v)} />
              <Input label="Mobile *" value={form.mobile} onChange={(v) => update("mobile", v)} />
              <Input label="GST Number *" value={form.gst} onChange={(v) => update("gst", v)} />
              <Input label="Latitude *" value={form.latitude} onChange={(v) => update("latitude", v)} />
              <Input label="Longitude *" value={form.longitude} onChange={(v) => update("longitude", v)} />
            </div>

            {/* ACTIONS */}
            <button
              onClick={submit}
              disabled={loading}
              className="w-full mt-8 py-3 rounded-md bg-indigo-500 hover:bg-indigo-600 transition font-medium"
            >
              {loading ? "Registering..." : "Register"}
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              By registering, you agree to our Terms & Privacy Policy
            </p>

            <p
              onClick={() => router.push("/factory/login")}
              className="text-sm text-center text-indigo-400 mt-4 cursor-pointer hover:underline"
            >
              Already have an account? Sign in
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- INPUT ---------------- */

function Input({
  label,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-wide text-gray-400 mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full px-4 py-3 rounded-md
          bg-black/30 border border-white/10
          focus:outline-none focus:border-indigo-500
        "
      />
    </div>
  );
}

