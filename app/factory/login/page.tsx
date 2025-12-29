"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Step = "login" | "forgot" | "otp" | "reset"; // 🔥 NEW

export default function FactoryLogin() {
  const router = useRouter();

  const [step, setStep] = useState<Step>("login"); // 🔥 NEW

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState(""); // 🔥 NEW
  const [newPassword, setNewPassword] = useState(""); // 🔥 NEW

  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // 🔥 NEW

  const [cooldown, setCooldown] = useState(0); // 🔥 NEW (resend timer)

  useEffect(() => {
    const saved = localStorage.getItem("factory-email");
    if (saved) {
      setEmail(saved);
      setRemember(true);
    }
  }, []);

  /* 🔁 OTP RESEND TIMER */
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown(c => c - 1), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  /* ---------------- LOGIN ---------------- */
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: "factory", email, password }),
    });

    setLoading(false);

    if (!res.ok) {
      setError("Invalid credentials");
      return;
    }

    remember
      ? localStorage.setItem("factory-email", email)
      : localStorage.removeItem("factory-email");

    router.push("/factory");
  }

  /* ---------------- SEND OTP ---------------- */
  async function sendOtp() {
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/forgot/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Failed to send OTP");
      return;
    }

    setCooldown(30);
    setStep("otp");
  }

  /* ---------------- VERIFY OTP ---------------- */
  async function verifyOtp() {
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/forgot/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Invalid OTP");
      return;
    }

    setStep("reset");
  }

  /* ---------------- RESET PASSWORD ---------------- */
  async function resetPassword() {
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/forgot/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, newPassword }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Reset failed");
      return;
    }

    setStep("login");
    setPassword("");
    setOtp("");
    setNewPassword("");
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-black text-white">

      {/* LEFT SIDE — EMPTY */}
      <div className="hidden lg:flex items-center justify-center border-2" />

      {/* RIGHT SIDE */}
      <div className="flex items-center justify-center px-6 ml-0">
        <div className="w-full h-full">

          {/* LOGO */}
          <div className="flex flex-row mt-15">
            <img
              src="/logo.png"
              alt="Logo"
              className="h-18 w-20 object-contain mb-2"
            />
            <p className="text-4xl mt-3 font-semibold text-indigo-400">
              Corevia
            </p>
          </div>

          {/* TITLE */}
          <div className="flex flex-col items-center mb-8 mt-10">
            <p className="text-xl text-gray-400">Welcome</p>
            <h1 className="text-2xl font-semibold mt-1">
              {step === "login" && "Sign in now"}
              {step === "forgot" && "Enter registered email"}
              {step === "otp" && "Verify OTP"}
              {step === "reset" && "Set new password"}
            </h1>
          </div>

          {step !== "login" && (
  <div
    onClick={() => {
      if (step === "forgot") setStep("login");
      if (step === "otp") setStep("forgot");
      if (step === "reset") setStep("otp");
      setError("");
    }}
    className="cursor-pointer text-sm text-gray-400 hover:text-indigo-400 w-[450px]"
  >
    ← Back
  </div>
)}


          <form
            onSubmit={step === "login" ? handleLogin : undefined}
            className="space-y-6 flex items-center justify-center flex-col"
          >
            {/* EMAIL (LOGIN + FORGOT) */}
            {(step === "login" || step === "forgot") && (
              <div>
                <label className="block text-xs uppercase tracking-wide text-gray-400 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                 className="w-[450px] px-4 py-3 rounded-md
  bg-white/6
  border border-[#1E293B]
  outline-none
  focus:outline-none
  focus:ring-0
  focus:border-indigo-500
"

                />
              </div>
            )}

            {/* PASSWORD (LOGIN) */}
            {step === "login" && (
              <div>
                <label className="block text-xs uppercase tracking-wide text-gray-400 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-[450px] px-4 py-3 rounded-md
  bg-white/6
  border border-[#1E293B]
  outline-none
  focus:outline-none
  focus:ring-0
  focus:border-indigo-500
"

                />
              </div>
            )}

            {/* OTP */}
            {step === "otp" && (
  <div className="flex gap-3">
    {Array.from({ length: 6 }).map((_, i) => (
      <input
        key={i}
        maxLength={1}
        value={otp[i] || ""}
        onChange={(e) => {
          const val = e.target.value.replace(/\D/, "");
          if (!val) return;

          const next = otp.split("");
          next[i] = val;
          setOtp(next.join(""));

          const nextInput = document.getElementById(`otp-${i + 1}`);
          nextInput?.focus();
        }}
        id={`otp-${i}`}
        className="w-12 h-12 text-center text-lg rounded-md
          bg-white/6 border border-[#1E293B]
          focus:border-indigo-500 outline-none"
      />
    ))}
  </div>
)}


            {/* NEW PASSWORD */}
            {step === "reset" && (
              <input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-[450px] px-4 py-3 rounded-md
                  bg-white/6 border border-[#1E293B]"
              />
            )}

            {/* OPTIONS */}
            {step === "login" && (
              <div className="flex justify-between space-x-56 items-center text-sm">
                <label className="flex items-center gap-2 text-gray-400">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="accent-indigo-500 cursor-pointer"
                  />
                  Remember me
                </label>

                <span
                  onClick={() => setStep("forgot")}
                  className="text-indigo-400 cursor-pointer hover:underline"
                >
                  Forgot password?
                </span>
              </div>
            )}

            {/* ERROR */}
            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            {/* BUTTONS (SAME POSITION ALWAYS) */}
            <div className="flex gap-10 pt-10">
              {step === "login" && (
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 px-19 rounded-md font-medium
                    bg-indigo-500 hover:bg-indigo-600 transition"
                >
                  {loading ? "Signing in.." : "Sign in"}
                </button>
              )}

              {step === "forgot" && (
                <button
                  type="button"
                  onClick={sendOtp}
                  className="flex-1 py-3 px-18 rounded-md font-medium
                    bg-indigo-500"
                >
                  Send OTP
                </button>
              )}

              {step === "otp" && (
                <button
                  type="button"
                  onClick={verifyOtp}
                  className="flex-1 py-3 px-18 rounded-md font-medium
                    bg-indigo-500"
                >
                  Verify OTP
                </button>
              )}

              {step === "reset" && (
                <button
                  type="button"
                  onClick={resetPassword}
                  className="flex-1 py-3 px-18 rounded-md font-medium
                    bg-indigo-500"
                >
                  Reset Password
                </button>
              )}

              {/* REGISTER — NEVER REMOVED */}
              {step === "login" && (
  <button
    type="button"
    onClick={() => router.push("/factory/register")}
    className="flex-1 py-3 px-19 rounded-md
      border border-[#1E293B]
      hover:border-indigo-500 transition"
  >
    Register
  </button>
)}

            </div>

            {/* RESEND OTP */}
            {step === "otp" && (
              <button
                type="button"
                disabled={cooldown > 0}
                onClick={sendOtp}
                className="text-sm text-indigo-400"
              >
                {cooldown > 0
                  ? `Resend in ${cooldown}s`
                  : "Resend OTP"}
              </button>
            )}
          </form>

          <p className="text-xs text-gray-500 text-center mt-8">
            By signing in, you agree to our Terms & Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
