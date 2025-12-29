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

    const res = await fetch(
      "http://127.0.0.1:8000/alerts/dismiss-dropdown",
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
    console.error("❌ DISMISS DROPDOWN API ERROR", err);
    return NextResponse.json(
      { error: "Dismiss dropdown failed" },
      { status: 500 }
    );
  }
}
