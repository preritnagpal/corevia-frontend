import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const factoryId = searchParams.get("factoryId");

  if (!factoryId) {
    return NextResponse.json({ count: 0, alerts: [] });
  }

  const API_BASE =
          process.env.NEXT_PUBLIC_FASTAPI_URL || "http://127.0.0.1:8000";

  try {
    const res = await fetch(
      `${API_BASE}/alerts/dropdown?factoryId=${factoryId}`,
      { cache: "no-store" }
    );

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("❌ DROPDOWN ALERT API ERROR", err);
    return NextResponse.json({ count: 0, alerts: [] });
  }
}
