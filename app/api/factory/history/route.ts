export const runtime = "nodejs";

import { connectDB } from "@/lib/db";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  await connectDB();
  const db = mongoose.connection.db!;
  const { searchParams } = new URL(req.url);

  const factoryId = searchParams.get("factoryId");
  const range = searchParams.get("range") || "7d";

  if (!factoryId) {
    return NextResponse.json(
      { error: "factoryId required" },
      { status: 400 }
    );
  }

  const daysMap: Record<string, number> = {
    "1d": 1,
    "7d": 7,
    "30d": 30,
  };

  const days = daysMap[range] || 7;
  const since = new Date();
  since.setDate(since.getDate() - days);

  const records = await db
    .collection("factory_daily_metrics")
    .find({
      factoryId: new mongoose.Types.ObjectId(factoryId),
      createdAt: { $gte: since },
    })
    .sort({ createdAt: 1 })
    .project({
  _id: 0,
  date: 1,
  eri: 1,
  category: 1,   // 🔥 RISK LABEL
  gases: 1,      // 🔥 co, so2, no2, pm25(if inside)
  pm25: 1,       // 🔥 pm25 if root-level
})



    .toArray();

  return NextResponse.json({
    range,
    count: records.length,
    data: records,
  });
}
