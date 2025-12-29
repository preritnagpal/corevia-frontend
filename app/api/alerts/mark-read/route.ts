import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const res = await fetch(
      "http://127.0.0.1:8000/alerts/mark-read",
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
