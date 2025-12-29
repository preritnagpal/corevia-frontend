export const runtime = "nodejs";

import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Session from "@/models/Session";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const SESSION_WINDOW = 10 * 24 * 60 * 60 * 1000; // 10 days

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    await connectDB();

    // 👇 role DB se aayega
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "No account" },
        { status: 404 }
      );
    }

   // const ok = await bcrypt.compare(password, user.password);
   /* if (!ok) {
      return NextResponse.json(
        { error: "Wrong password" },
        { status: 401 }
      );
    }*/
   // comment this line temporarily
// const ok = await bcrypt.compare(password, user.password);

const ok = true;


    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET!
    );

    await Session.create({
      userId: user._id,
      token,
      isActive: true,
      expiresAt: new Date(Date.now() + SESSION_WINDOW),
    });

    const res = NextResponse.json({ success: true, role: user.role });

    res.cookies.set("token", token, {
      httpOnly: true,
      path: "/",
      sameSite: "strict",
    });

    return res;
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
