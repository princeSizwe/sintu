import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const params = new URLSearchParams(body);
  console.log("[PayFast ITN] payment_status=%s m_payment_id=%s", params.get("payment_status"), params.get("m_payment_id"));
  return new NextResponse("OK", { status: 200 });
}
