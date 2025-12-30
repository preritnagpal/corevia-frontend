"use client";

import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
import EditableRow from "./EditableRow";
import { requiresOtp } from "@/lib/otp/otpConfig";

type Field =
  | "gst"
  | "pan"
  | "cin"
  | "pcbRegistrationId"
  | "consentStatus"
  | "industryCategory"
  | "monitoringMethod";

const COOLDOWNS = [30, 60, 180, 10800]; // seconds

export default function ComplianceSettings() {
  const [data, setData] = useState<any>(null);
  const [editing, setEditing] = useState<Field | null>(null);
  const [value, setValue] = useState("");

  /* OTP */
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [cooldown, setCooldown] = useState(0);

  /* LOAD USER */
  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then(r => r.json())
      .then(r => setData(r.user?.data || {}));
  }, []);

  /* COOLDOWN TIMER */
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown(c => c - 1), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  function resetOtp() {
    setOtp("");
    setOtpVerified(false);
    setOtpSent(false);
    setAttempt(0);
    setCooldown(0);
  }

  /* SEND OTP */
  async function sendOtp() {
    if (cooldown > 0) return;
    if (attempt >= 4) {
      alert("OTP blocked for 3 hours");
      return;
    }

    await fetch("/api/auth/send-otp", {
      method: "POST",
      credentials: "include",
    });

    setAttempt(a => a + 1);
    setCooldown(COOLDOWNS[attempt] ?? 10800);
    setOtpSent(true);
  }

  /* VERIFY OTP */
  async function verifyOtp() {
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ otp }),
    });

    if (res.ok) {
      setOtpVerified(true);
    } else {
      alert("Invalid OTP");
    }
  }

  /* SAVE */
  async function save(field: Field) {
    if (requiresOtp(field) && !otpVerified) {
      alert("Please verify OTP first");
      return;
    }

    await fetch("/api/factory/update", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        [field]: value,
      }),
    });

    setData((d: any) => ({ ...d, [field]: value }));
    resetOtp();
    setEditing(null);
  }

  if (!data) {
    return <p className="text-sm text-gray-400">Loading compliance…</p>;
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold text-white">
          Compliance & Regulatory
        </h1>
        <p className="text-sm text-gray-400">
          Legal identifiers & pollution board compliance
        </p>
      </div>

      <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-gray-400">
        <ShieldCheck size={14} />
        Changes here require OTP verification
      </div>

      {rows.map(([label, field]) => (
        <EditableRow
          key={field}
          label={label}
          value={data[field] || "-"}
          editing={editing === field}
          onEdit={() => {
            setEditing(field);
            setValue(data[field] || "");
          }}
          onSave={() => save(field)}
          onCancel={() => {
            resetOtp();
            setEditing(null);
          }}
        >
          <OtpBlock {...otpProps()} />
        </EditableRow>
      ))}
    </div>
  );

  function otpProps() {
    return {
      otp,
      otpSent,
      cooldown,
      sendOtp,
      verifyOtp,
      onOtpChange: setOtp,
      verified: otpVerified,
      value,
      onChange: setValue,
    };
  }
}

/* ---------------- FIELD LIST ---------------- */

const rows: [string, Field][] = [
  ["GST Number", "gst"],
  ["PAN Number", "pan"],
  ["CIN", "cin"],
  ["PCB Registration ID", "pcbRegistrationId"],
  ["Consent Status", "consentStatus"],
  ["Industry Category", "industryCategory"],
  ["Monitoring Method", "monitoringMethod"],
];

/* ---------------- OTP UI ---------------- */

function OtpBlock({ verified, value, onChange, ...p }: any) {
  return !verified ? (
    <OtpVerify {...p} />
  ) : (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full rounded-lg border border-cyan-400 bg-black px-3 py-2 text-white"
    />
  );
}

function OtpVerify({
  otp,
  cooldown,
  otpSent,
  sendOtp,
  verifyOtp,
  onOtpChange,
}: any) {
  return (
    <div className="space-y-3">
      <input
        placeholder="Enter OTP"
        value={otp}
        onChange={e => onOtpChange(e.target.value)}
        className="w-full rounded-lg border border-cyan-400 bg-black px-3 py-2 text-white"
      />

      <div className="flex items-center gap-3">
        <button
          onClick={verifyOtp}
          disabled={!otp}
          className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-black hover:bg-cyan-400 disabled:opacity-50"
        >
          Verify
        </button>

        <button
          onClick={sendOtp}
          disabled={cooldown > 0}
          className="text-sm text-cyan-400 disabled:opacity-50"
        >
          {cooldown > 0
            ? `Resend in ${cooldown}s`
            : otpSent
            ? "Resend OTP"
            : "Send OTP"}
        </button>
      </div>
    </div>
  );
}
