import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const factoryId = searchParams.get("factoryId");

  console.log("➡️ API ROUTE factoryId:", factoryId);

  if (!factoryId) {
    return NextResponse.json({ count: 0, alerts: [] });
  }
  const API_BASE =
          process.env.NEXT_PUBLIC_FASTAPI_URL || "http://127.0.0.1:8000";

  try {
    const backendRes = await fetch(
      `${API_BASE}/alerts/unread?factoryId=${factoryId}`,
      { cache: "no-store" }
    );

    const text = await backendRes.text(); // 🔥 IMPORTANT
    console.log("⬅️ BACKEND RAW:", text);

    const data = JSON.parse(text); // 💥 force parse

    return NextResponse.json(data);
  } catch (err) {
    console.error("❌ ALERTS API ERROR:", err);
    return NextResponse.json(
      { count: 0, alerts: [] },
      { status: 200 }
    );
  }
}
