import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Otp from "@/models/otp";
import { sendOtpMail } from "@/lib/mailer";

export async function POST(req: Request) {
  const { email } = await req.json();
  await connectDB();

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json(
      { error: "Email not registered" },
      { status: 400 }
    );
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hash = await bcrypt.hash(otp, 10);

  // 🔥 overwrite old OTP
  await Otp.findOneAndUpdate(
    { userId: user._id.toString() },
    {
      hash,
      expiresAt: Date.now() + 3 * 60 * 1000,
    },
    { upsert: true }
  );

  sendOtpMail(email, otp);

  return NextResponse.json({ success: true });
}
