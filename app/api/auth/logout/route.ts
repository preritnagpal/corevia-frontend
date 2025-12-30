export const runtime = "nodejs";

import { connectDB } from "@/lib/db";
import Session from "@/models/Session";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const cookie = req.headers.get("cookie");
    const token = cookie?.split("token=")[1];

    if (token) {
      await connectDB();

      // session inactive
      await Session.findOneAndUpdate(
        { token },
        { isActive: false }
      );
    }

    const res = NextResponse.json({ success: true });

    // clear cookie
    res.cookies.set("token", "", {
      httpOnly: true,
      path: "/",
      maxAge: 0,
    });

    return res;
  } catch (err) {
    console.error("LOGOUT ERROR:", err);
    return NextResponse.json(
      { error: "Logout failed" },
      { status: 500 }
    );
  }
}
