export const runtime = "nodejs";

import { connectDB } from "@/lib/db";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    await connectDB();
    const db = mongoose.connection.db!;
    const { searchParams } = new URL(req.url);

    const factoryId = searchParams.get("factoryId");
    if (!factoryId) {
      return NextResponse.json(
        { error: "factoryId is required" },
        { status: 400 }
      );
    }

    const factoryObjectId = new mongoose.Types.ObjectId(factoryId);

    /* =======================
       1️⃣ LATEST DAILY METRICS
    ======================= */
    const [dailyMetric] = await db
      .collection("factory_daily_metrics")
      .find({ factoryId: factoryObjectId })
      .sort({ createdAt: -1 })   // ✅ latest
      .limit(1)
      .toArray();

    /* =======================
       2️⃣ LATEST IMPACT
    ======================= */
    const [impactDaily] = await db
      .collection("factory_impact_daily")
      .find({ factoryId: factoryObjectId })
      .sort({ generatedAt: -1 })
      .limit(1)
      .toArray();

    /* =======================
       3️⃣ ALERTS
    ======================= */
    const alertsCount = await db
      .collection("factory_alerts")
      .countDocuments({ factoryId: factoryObjectId });

    const [latestAlert] = await db
      .collection("factory_alerts")
      .find({ factoryId: factoryObjectId })
      .sort({ createdAt: -1 })
      .limit(1)
      .toArray();

    /* =======================
       FINAL RESPONSE (FIXED)
    ======================= */
    return NextResponse.json({
      eri: dailyMetric
        ? {
            value: Number(dailyMetric.eri),
            category: dailyMetric.category,
            date: dailyMetric.date,
          }
        : null,

      emissions: dailyMetric?.gases ?? null,

      // 🔥🔥🔥 THIS WAS THE MISSING LINK
      emissionEstimate: dailyMetric?.emissionEstimate
        ? {
            dailyKgEstimate: Number(
              dailyMetric.emissionEstimate.dailyKgEstimate
            ),
            method: dailyMetric.emissionEstimate.method,
          }
        : null,

      impact: impactDaily?.impact ?? null,

      alerts: {
        count: alertsCount,
        latest: latestAlert
          ? {
              type: latestAlert.type,
              severity: latestAlert.severity,
              message: latestAlert.message,
              createdAt: latestAlert.createdAt,
            }
          : null,
      },

      coverage: dailyMetric
        ? {
            coverage_percent: 100, // daily ingest present
            confidence: "high",
          }
        : null,

      meta: {
        factoryId,
        source: "satellite_processed",
        updatedAt: new Date(),
      },
    });
  } catch (error) {
    console.error("FACTORY DASHBOARD API ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
