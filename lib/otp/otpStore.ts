import bcrypt from "bcryptjs";

type OtpEntry = {
  hash: string;
  expiresAt: number;
};

const store = new Map<string, OtpEntry>();

const OTP_TTL = 3 * 60 * 1000; // ✅ 3 minutes

export async function createOtp(userId: string) {
  const existing = store.get(userId);

  // 🔒 If OTP still valid → reuse
  if (existing && Date.now() < existing.expiresAt) {
    return null; // means "already sent"
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hash = await bcrypt.hash(otp, 10);

  store.set(userId, {
    hash,
    expiresAt: Date.now() + OTP_TTL,
  });

  return otp;
}

export async function verifyOtp(userId: string, otp: string) {
  const entry = store.get(userId);
  if (!entry) return false;

  if (Date.now() > entry.expiresAt) {
    store.delete(userId);
    return false;
  }

  const ok = await bcrypt.compare(otp, entry.hash);
  if (!ok) return false;

  store.delete(userId); // ✅ invalidate after success
  return true;
}
