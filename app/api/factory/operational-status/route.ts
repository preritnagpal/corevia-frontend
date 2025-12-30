export const runtime = "nodejs";

import { connectDB } from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

type Status = "Running" | "Closed";

export async function PATCH(req: Request) {
  try {
    // ✅ FIX HERE
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const { status } = await req.json();

    if (status !== "Running" && status !== "Closed") {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    await connectDB();

    await User.findByIdAndUpdate(decoded.id, {
      "data.operationalStatus": status,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("OPERATIONAL STATUS ERROR:", err);
    return NextResponse.json(
      { error: "Failed to update status" },
      { status: 500 }
    );
  }
}
