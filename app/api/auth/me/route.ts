export const runtime = "nodejs";

import { connectDB } from "@/lib/db";
import Session from "@/models/Session";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const SESSION_WINDOW = 10 * 24 * 60 * 60 * 1000; // 10 days

export async function GET(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const token = cookie
    .split("; ")
    .find(c => c.startsWith("token="))
    ?.split("=")[1];

  if (!token) {
    return NextResponse.json({ loggedIn: false });
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    await connectDB();

    const session = await Session.findOne({
      token,
      isActive: true,
    });

    if (!session) {
      return NextResponse.json({ loggedIn: false });
    }

    // 🔴 session expired
    if (session.expiresAt < new Date()) {
      session.isActive = false;
      await session.save();
      return NextResponse.json({ loggedIn: false });
    }

    // 🟢 extend session
    session.expiresAt = new Date(Date.now() + SESSION_WINDOW);
    await session.save();

    // 🔥 FETCH USER DATA (THIS WAS MISSING)
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return NextResponse.json({ loggedIn: false });
    }

    return NextResponse.json({
      loggedIn: true,
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
        data: user.data, // ✅ THIS FIXES EVERYTHING
      },
    });
  } catch (err) {
    return NextResponse.json({ loggedIn: false });
  }
}
