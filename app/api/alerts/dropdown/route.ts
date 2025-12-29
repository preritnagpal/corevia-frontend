import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const factoryId = searchParams.get("factoryId");

  if (!factoryId) {
    return NextResponse.json({ count: 0, alerts: [] });
  }

  try {
    const res = await fetch(
      `http://127.0.0.1:8000/alerts/dropdown?factoryId=${factoryId}`,
      { cache: "no-store" }
    );

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("❌ DROPDOWN ALERT API ERROR", err);
    return NextResponse.json({ count: 0, alerts: [] });
  }
}
