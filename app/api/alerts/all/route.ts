import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const factoryId = searchParams.get("factoryId");

  const API_BASE =
  process.env.NEXT_PUBLIC_FASTAPI_URL || "http://127.0.0.1:8000";

  const res = await fetch(
  `${API_BASE}/alerts/all?factoryId=${factoryId}`
);

  const data = await res.json();
  return NextResponse.json(data);
}
