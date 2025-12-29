export const runtime = "nodejs";

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { createOtp } from "@/lib/otp/otpStore";
import { sendOtpMail } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    /* 🔐 TOKEN */
    const cookie = req.headers.get("cookie") || "";
    const token = cookie
      .split("; ")
      .find(c => c.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    await connectDB();

    const user = await User.findById(decoded.id);
    if (!user || !user.email) {
      return NextResponse.json(
        { error: "Email not found" },
        { status: 400 }
      );
    }

    /* 🔥 CREATE / REUSE OTP */
    const otp = await createOtp(user._id.toString());

    // ✅ OTP already sent & still valid
    if (!otp) {
      return NextResponse.json({ success: true });
    }

    /* 📧 SEND MAIL */
    sendOtpMail(user.email, otp);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("SEND OTP ERROR:", err);
    return NextResponse.json(
      { error: "Failed to send OTP" },
      { status: 500 }
    );
  }
}
