import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Otp from "@/models/otp";

export async function POST(req: Request) {
  const { email, otp } = await req.json();
  await connectDB();

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    );
  }

  const entry = await Otp.findOne({ userId: user._id.toString() });
  if (!entry || Date.now() > entry.expiresAt) {
    return NextResponse.json(
      { error: "OTP expired" },
      { status: 400 }
    );
  }

  const ok = await bcrypt.compare(otp, entry.hash);
  if (!ok) {
    return NextResponse.json(
      { error: "Invalid OTP" },
      { status: 400 }
    );
  }

  await Otp.deleteOne({ userId: user._id.toString() });

  return NextResponse.json({ success: true });
}
