export const runtime = "nodejs";

import { connectDB } from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    /* 🔐 READ TOKEN */
    const cookie = req.headers.get("cookie") || "";
    const token = cookie
      .split("; ")
      .find(c => c.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const body = await req.json();

    await connectDB();

    /**
     * ✅ ROOT FIELDS (top-level in User schema)
     * email is NOT inside data
     */
    const ROOT_FIELDS = ["email"];

    /**
     * 🔥 BUILD UPDATE OBJECT
     * - email → root
     * - rest → data.*
     */
    const updateFields: Record<string, any> = {};

    for (const key in body) {
      if (ROOT_FIELDS.includes(key)) {
        updateFields[key] = body[key]; // root update
      } else {
        updateFields[`data.${key}`] = body[key]; // nested update
      }
    }

    await User.findByIdAndUpdate(
      decoded.id,
      { $set: updateFields },
      { new: true }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("FACTORY UPDATE ERROR:", err);
    return NextResponse.json(
      { error: "Update failed" },
      { status: 500 }
    );
  }
}
