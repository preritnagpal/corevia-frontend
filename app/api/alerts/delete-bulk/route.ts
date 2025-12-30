import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.alertId) {
      return NextResponse.json(
        { error: "alertId required" },
        { status: 400 }
      );
    }

    const API_BASE =
          process.env.NEXT_PUBLIC_FASTAPI_URL || "http://127.0.0.1:8000";

    const res = await fetch(
      `${API_BASE}/alerts/delete`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          alertId: body.alertId,
        }),
      }
    );

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("❌ DELETE ALERT API ERROR", err);
    return NextResponse.json(
      { error: "Delete alert failed" },
      { status: 500 }
    );
  }
}
