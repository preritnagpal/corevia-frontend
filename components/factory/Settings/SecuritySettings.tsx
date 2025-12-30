"use client";

import { useEffect, useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import EditableRow from "./EditableRow";
import { requiresOtp } from "@/lib/otp/otpConfig";
import { toast } from "sonner";


type Field = "email" | "mobile" | "password";

const COOLDOWNS = [30, 60, 180, 10800]; // seconds

export default function SecuritySettings() {
  const [data, setData] = useState<any>(null);
  const [editing, setEditing] = useState<Field | null>(null);

  const [value, setValue] = useState("");
  const [passwords, setPasswords] = useState({ current: "", next: "" });

  /* 👁️ PASSWORD VISIBILITY */
  const [showCurrent, setShowCurrent] = useState<boolean>(false);
  const [showNext, setShowNext] = useState<boolean>(false);

  /* 🔐 OTP STATE */
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [cooldown, setCooldown] = useState(0);

  /* LOAD USER */
  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then(r => r.json())
      .then(r => setData(r.user || {}));
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
      toast.error("OTP blocked for 3 hours");
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
      toast.error("Invalid OTP");
    }
  }

  /* SAVE */
  async function save(field: Field) {
    if (requiresOtp(field) && !otpVerified) {
      toast.warning("Please verify OTP first");
      return;
    }

    if (field === "password") {
      await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(passwords),
      });
    } else {
      // email / mobile → single update API
      await fetch("/api/factory/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          [field]: value,
        }),
      });

      if (field === "email") {
        setData((d: any) => ({ ...d, email: value }));
      }
      if (field === "mobile") {
        setData((d: any) => ({
          ...d,
          data: { ...d.data, mobile: value },
        }));
      }
    }
    toast.success("Updated successfully");
    resetOtp();
    setEditing(null);
  }

  if (!data) {
    return <p className="text-sm text-gray-400">Loading security…</p>;
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Security</h1>
        <p className="text-sm text-gray-400">
          Login credentials & account protection
        </p>
      </div>

      <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-gray-400">
        <Lock size={14} />
        Sensitive changes require OTP verification
      </div>

      {/* EMAIL */}
      <EditableRow
        label="Email"
        value={data.email}
        editing={editing === "email"}
        onEdit={() => {
          setEditing("email");
          setValue(data.email || "");
        }}
        onSave={() => save("email")}
        onCancel={() => {
          resetOtp();
          setEditing(null);
        }}
      >
        <OtpBlock {...otpProps()} />
      </EditableRow>

      {/* MOBILE */}
      <EditableRow
        label="Mobile"
        value={data.data?.mobile || "-"}
        editing={editing === "mobile"}
        onEdit={() => {
          setEditing("mobile");
          setValue(data.data?.mobile || "");
        }}
        onSave={() => save("mobile")}
        onCancel={() => {
          resetOtp();
          setEditing(null);
        }}
      >
        <OtpBlock {...otpProps()} />
      </EditableRow>

      {/* PASSWORD */}
      <EditableRow
        label="Password"
        value="••••••••"
        editing={editing === "password"}
        onEdit={() => setEditing("password")}
        onSave={() => save("password")}
        onCancel={() => {
          resetOtp();
          setEditing(null);
        }}
      >
        {!otpVerified ? (
          <OtpVerify {...otpProps()} />
        ) : (
          <div className="space-y-3">
            {/* CURRENT PASSWORD */}
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                placeholder="Current password"
                value={passwords.current}
                onChange={e =>
                  setPasswords(p => ({ ...p, current: e.target.value }))
                }
                className="w-full rounded-lg border border-cyan-400 bg-black px-3 py-2 text-white pr-10"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(prev => !prev)}
                className="absolute right-3 top-2.5 text-gray-400"
              >
                {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* NEW PASSWORD */}
            <div className="relative">
              <input
                type={showNext ? "text" : "password"}
                placeholder="New password"
                value={passwords.next}
                onChange={e =>
                  setPasswords(p => ({ ...p, next: e.target.value }))
                }
                className="w-full rounded-lg border border-cyan-400 bg-black px-3 py-2 text-white pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNext(prev => !prev)}
                className="absolute right-3 top-2.5 text-gray-400"
              >
                {showNext ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        )}
      </EditableRow>
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

/* ---------- OTP UI ---------- */

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
          className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-black disabled:opacity-50"
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
