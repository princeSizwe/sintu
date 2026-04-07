"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function VerifiedContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");

  if (status === "success") {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <div className="text-5xl mb-6">✅</div>
        <h1 className="text-2xl font-bold text-green-700 mb-3">Email verified!</h1>
        <p className="text-gray-600 mb-8">Your account is now active. You can log in and start using Sintu.</p>
        <Link
          href="/login"
          className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 inline-block"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  if (status === "expired") {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <div className="text-5xl mb-6">⏰</div>
        <h1 className="text-2xl font-bold text-yellow-700 mb-3">Link expired</h1>
        <p className="text-gray-600 mb-8">
          Your verification link has expired. Please register again or request a new verification email.
        </p>
        <Link
          href="/register"
          className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 inline-block"
        >
          Register again
        </Link>
      </div>
    );
  }

  // status === "invalid" or anything else
  return (
    <div className="max-w-md mx-auto text-center py-16">
      <div className="text-5xl mb-6">❌</div>
      <h1 className="text-2xl font-bold text-red-700 mb-3">Invalid verification link</h1>
      <p className="text-gray-600 mb-8">
        This verification link is invalid or has already been used. Please register again or request a new link.
      </p>
      <Link
        href="/register"
        className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 inline-block"
      >
        Register
      </Link>
    </div>
  );
}

export default function VerifiedPage() {
  return (
    <Suspense>
      <VerifiedContent />
    </Suspense>
  );
}
