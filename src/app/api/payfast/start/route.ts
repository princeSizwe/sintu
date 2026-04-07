import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function POST() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const isSandbox = process.env.PAYFAST_MODE === "sandbox";
  const merchantId = process.env.PAYFAST_MERCHANT_ID || "10000100";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  // TODO: include PAYFAST_MERCHANT_KEY in the MD5 signature when building the form payload

  const payfastUrl = isSandbox
    ? "https://sandbox.payfast.co.za/eng/process"
    : "https://www.payfast.co.za/eng/process";

  return NextResponse.json({
    url: payfastUrl,
    sandbox: isSandbox,
    merchantId,
    returnUrl: `${appUrl}/me/payouts`,
    cancelUrl: `${appUrl}/pricing`,
    notifyUrl: `${appUrl}/api/payfast/itn`,
  });
}
