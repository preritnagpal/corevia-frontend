"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Step = "login" | "forgot" | "otp" | "reset";

export default function FactoryLogin() {
  const router = useRouter();

  const [step, setStep] = useState<Step>("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [cooldown, setCooldown] = useState(0);

  /* ================= REMEMBER EMAIL ================= */
  useEffect(() => {
    const saved = localStorage.getItem("factory-email");
    if (saved) {
      setEmail(saved);
      setRemember(true);
    }
  }, []);

  /* ================= OTP TIMER ================= */
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setInterval(() => setCooldown(c => c - 1), 1000);
    return () => clearInterval(t);
  }, [cooldown]);

  /* ================= LOGIN ================= */
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

  /* ================= SEND OTP ================= */
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

  /* ================= VERIFY OTP ================= */
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

  /* ================= RESET PASSWORD ================= */
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
        {/* LEFT EMPTY (DESKTOP) */}
        <div className="hidden lg:block" />

        {/* RIGHT FORM */}
        <div className="flex items-center justify-center px-4 sm:px-6">
          <div className="w-full max-w-[480px] rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 sm:p-8 shadow-2xl">

            {/* LOGO */}
            <div className="flex items-center gap-3 mb-6">
              <img src="/logo.png" className="h-10 w-10" />
              <span className="text-2xl font-semibold text-indigo-400">
                Corevia
              </span>
            </div>

            {/* TITLE */}
            <div className="mb-6 text-center">
              <p className="text-sm text-gray-400">Welcome</p>
              <h1 className="text-xl font-semibold mt-1">
                {step === "login" && "Sign in to your account"}
                {step === "forgot" && "Recover your password"}
                {step === "otp" && "Verify OTP"}
                {step === "reset" && "Set new password"}
              </h1>
            </div>

            {/* BACK */}
            {step !== "login" && (
              <button
                onClick={() => {
                  setError("");
                  setStep(step === "forgot" ? "login" : step === "otp" ? "forgot" : "otp");
                }}
                className="mb-4 text-sm text-gray-400 hover:text-indigo-400"
              >
                ← Back
              </button>
            )}

            <form
              onSubmit={step === "login" ? handleLogin : undefined}
              className="space-y-5"
            >
              {(step === "login" || step === "forgot") && (
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="w-full px-4 py-3 rounded-md bg-black/30 border border-white/10 focus:border-indigo-500 outline-none"
                />
              )}

              {step === "login" && (
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-4 py-3 rounded-md bg-black/30 border border-white/10 focus:border-indigo-500 outline-none"
                />
              )}

              {step === "otp" && (
                <div className="flex justify-center gap-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <input
                      key={i}
                      maxLength={1}
                      value={otp[i] || ""}
                      onChange={(e) => {
                        const v = e.target.value.replace(/\D/, "");
                        if (!v) return;
                        const arr = otp.split("");
                        arr[i] = v;
                        setOtp(arr.join(""));
                      }}
                      className="w-11 h-11 text-center text-lg rounded-md bg-black/30 border border-white/10 focus:border-indigo-500 outline-none"
                    />
                  ))}
                </div>
              )}

              {step === "reset" && (
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New password"
                  className="w-full px-4 py-3 rounded-md bg-black/30 border border-white/10"
                />
              )}

              {error && (
                <p className="text-sm text-red-400 text-center">{error}</p>
              )}

              <button
                type="button"
                onClick={
                  step === "login"
                    ? undefined
                    : step === "forgot"
                    ? sendOtp
                    : step === "otp"
                    ? verifyOtp
                    : resetPassword
                }
                disabled={loading}
                className="w-full py-3 rounded-md bg-indigo-500 hover:bg-indigo-600 transition font-medium"
              >
                {loading
                  ? "Please wait..."
                  : step === "login"
                  ? "Sign in"
                  : step === "forgot"
                  ? "Send OTP"
                  : step === "otp"
                  ? "Verify OTP"
                  : "Reset password"}
              </button>

              {step === "login" && (
                <div className="flex justify-between text-sm text-gray-400">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="accent-indigo-500"
                    />
                    Remember me
                  </label>
                  <span
                    onClick={() => setStep("forgot")}
                    className="cursor-pointer hover:text-indigo-400"
                  >
                    Forgot password?
                  </span>
                </div>
              )}

              {step === "otp" && (
                <button
                  type="button"
                  disabled={cooldown > 0}
                  onClick={sendOtp}
                  className="text-sm text-indigo-400 mx-auto block"
                >
                  {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP"}
                </button>
              )}
            </form>

            <p className="mt-6 text-xs text-center text-gray-500">
              By continuing, you agree to our Terms & Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
