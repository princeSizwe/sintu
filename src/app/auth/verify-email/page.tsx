"use client";
import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [resendStatus, setResendStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleResend() {
    if (!email) return;
    setResendStatus("sending");
    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setResendStatus(res.ok ? "sent" : "error");
    } catch {
      setResendStatus("error");
    }
  }

  return (
    <div className="max-w-md mx-auto text-center py-16">
      <div className="text-5xl mb-6">📬</div>
      <h1 className="text-2xl font-bold text-indigo-800 mb-3">Check your email</h1>
      <p className="text-gray-600 mb-2">
        We sent a verification link to <strong>{email || "your email address"}</strong>.
      </p>
      <p className="text-gray-500 text-sm mb-8">
        Click the link in the email to activate your account. The link expires in 24 hours.
      </p>

      {email && (
        <div className="mb-6">
          {resendStatus === "sent" ? (
            <p className="text-green-600 text-sm">✓ Verification email resent. Please check your inbox.</p>
          ) : resendStatus === "error" ? (
            <p className="text-red-600 text-sm">Failed to resend. Please try again.</p>
          ) : (
            <button
              onClick={handleResend}
              disabled={resendStatus === "sending"}
              className="text-indigo-600 text-sm underline hover:text-indigo-800 disabled:opacity-50"
            >
              {resendStatus === "sending" ? "Sending…" : "Didn't receive it? Resend verification email"}
            </button>
          )}
        </div>
      )}

      <Link href="/" className="text-sm text-gray-500 hover:text-indigo-600">
        ← Back to home
      </Link>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailContent />
    </Suspense>
  );
}
