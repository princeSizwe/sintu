import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function POST() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const isSandbox = process.env.PAYFAST_MODE === "sandbox";
  const merchantId = process.env.PAYFAST_MERCHANT_ID || "10000100";
  const merchantKey = process.env.PAYFAST_MERCHANT_KEY || "46f0cd694581a";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const payfastUrl = isSandbox
    ? "https://sandbox.payfast.co.za/eng/process"
    : "https://www.payfast.co.za/eng/process";

  return NextResponse.json({
    url: payfastUrl,
    sandbox: isSandbox,
    merchantId,
    merchantKey,
    returnUrl: `${appUrl}/me/payouts`,
    cancelUrl: `${appUrl}/pricing`,
    notifyUrl: `${appUrl}/api/payfast/itn`,
  });
}
