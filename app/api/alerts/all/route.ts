import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const factoryId = searchParams.get("factoryId");

  const res = await fetch(
    `http://127.0.0.1:8000/alerts/all?factoryId=${factoryId}`
  );

  const data = await res.json();
  return NextResponse.json(data);
}
