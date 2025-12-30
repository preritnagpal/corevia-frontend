import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const API_BASE =
          process.env.NEXT_PUBLIC_FASTAPI_URL || "http://127.0.0.1:8000";

    const res = await fetch(
      `${API_BASE}/alerts/mark-read`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("MARK READ API ERROR", err);
    return NextResponse.json(
      { error: "Mark read failed" },
      { status: 500 }
    );
  }
}
