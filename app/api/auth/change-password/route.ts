export const runtime = "nodejs";

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { verifyOtp } from "@/lib/otp/otpStore";
import { sendPasswordChangedMail } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    /* 🔐 AUTH */
    const cookie = req.headers.get("cookie") || "";
    const token = cookie
      .split("; ")
      .find(c => c.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const { current, next, otp } = await req.json();

    if (!current || !next || !otp) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    /* 🔐 OTP VERIFY */
    const otpOk = await verifyOtp(user.id, otp);
    if (!otpOk) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 401 });
    }

    /* 🔑 CURRENT PASSWORD VERIFY (🔥 THIS IS IMPORTANT) */
    const isMatch = await bcrypt.compare(current, user.password);

    if (!isMatch) {
      return NextResponse.json(
        { error: "Current password incorrect" },
        { status: 400 }
      );
    }

    /* 🔒 HASH & SAVE NEW PASSWORD */
    const hashed = await bcrypt.hash(next, 10);
    user.password = hashed;
    await user.save();

    /* 📧 NOTIFY USER */
    await sendPasswordChangedMail(user.email);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("CHANGE PASSWORD ERROR:", err);
    return NextResponse.json(
      { error: "Password update failed" },
      { status: 500 }
    );
  }
}
