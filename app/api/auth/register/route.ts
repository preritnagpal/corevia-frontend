export const runtime = "nodejs";

import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, role, ...rest } = body;

    /* BASIC VALIDATION */
    if (!email || !password || !role) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectDB();

    /* BUILD DUPLICATE QUERY SAFELY */
    const orConditions: Record<string, any>[] = [
      { email },
    ];

    if (rest.factoryName) {
      orConditions.push({ "data.factoryName": rest.factoryName });
    }

    if (rest.mobile) {
      orConditions.push({ "data.mobile": rest.mobile });
    }

    const duplicate = await User.findOne({
      role,
      $or: orConditions,
    });

    if (duplicate) {
      if (duplicate.email === email) {
        return NextResponse.json(
          { error: "Email already registered" },
          { status: 400 }
        );
      }

      if (rest.factoryName && duplicate.data?.factoryName === rest.factoryName) {
        return NextResponse.json(
          { error: "Factory name already registered" },
          { status: 400 }
        );
      }

      if (rest.mobile && duplicate.data?.mobile === rest.mobile) {
        return NextResponse.json(
          { error: "Mobile number already registered" },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: "Already registered" },
        { status: 400 }
      );
    }

    /* HASH PASSWORD */
    const hash = await bcrypt.hash(password, 10);

    /* CREATE USER */
    const user = await User.create({
      email,
      password: hash,
      role,
      data: rest, // 🔥 flexible Mixed data
    });

    /* ✅ IMPORTANT: return factoryId */
    return NextResponse.json({
      success: true,
      factoryId: user._id.toString(),
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
