"use client";

import React, { Suspense, useState, useTransition } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { resendVerification } from "../signup/actions";

const cardStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: 420,
  background: "rgba(255,255,255,0.03)",
  borderRadius: 24,
  padding: 40,
  border: "1px solid rgba(255,255,255,0.07)",
  boxShadow: "0 0 60px rgba(93,26,27,0.12), 0 32px 64px rgba(0,0,0,0.4)",
  backdropFilter: "blur(20px)",
  textAlign: "center",
};

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";
  const [resent, setResent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleResend = () => {
    if (!email) return;
    setError(null);
    setResent(false);
    startTransition(async () => {
      const result = await resendVerification(email);
      if (result?.error) setError(result.error);
      else setResent(true);
    });
  };

  return (
    <div style={{
      position: "relative",
      overflow: "hidden",
      background: "#0a0a0f",
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Inter, sans-serif",
      padding: "16px",
    }}>
      <div className="auth-blob auth-blob-1" />
      <div className="auth-blob auth-blob-2" />
      <div className="auth-blob auth-blob-3" />
      <div style={{ position: "relative", zIndex: 1, width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={cardStyle}>
          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <img src="/advertimus-logo.PNG" alt="Advertimus" style={{ height: 34, objectFit: "contain" }} />
          </div>

          {/* Envelope icon */}
          <div style={{
            width: 72, height: 72, borderRadius: "50%",
            background: "linear-gradient(135deg,#5d1a1b,#161142)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 24px",
            boxShadow: "0 0 30px rgba(93,26,27,0.4)",
          }}>
            <i className="bx bx-envelope" style={{ fontSize: 32, color: "#fff" }} />
          </div>

          <h1 style={{ margin: "0 0 16px", fontSize: 26, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>
            Check your inbox
          </h1>

          <p style={{ margin: "0 0 6px", fontSize: 14, color: "#6b6b82", lineHeight: 1.6 }}>
            We've sent a verification link to
          </p>
          {email && (
            <p style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700, color: "#fff" }}>
              {email}
            </p>
          )}
          <p style={{ margin: "0 0 28px", fontSize: 14, color: "#6b6b82", lineHeight: 1.6 }}>
            Click the link in that email to activate your account and claim your 400 free trial tokens.
          </p>

          {error && (
            <div style={{
              marginBottom: 16, padding: "11px 14px", borderRadius: 10,
              background: "rgba(204,41,54,0.12)", border: "1px solid rgba(204,41,54,0.3)",
              color: "#ff7875", fontSize: 13.5,
            }}>
              {error}
            </div>
          )}

          {resent && (
            <div style={{
              marginBottom: 16, padding: "11px 14px", borderRadius: 10,
              background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)",
              color: "#4ade80", fontSize: 13.5,
            }}>
              Verification email resent successfully.
            </div>
          )}

          <button
            onClick={handleResend}
            disabled={isPending || !email}
            style={{
              width: "100%", padding: 15, borderRadius: 12, border: "none",
              background: isPending ? "rgba(255,255,255,0.06)" : "#cc2936",
              color: isPending ? "#4a4a62" : "#fff",
              fontSize: 15, fontWeight: 700, cursor: isPending ? "default" : "pointer",
              boxShadow: isPending ? "none" : "0 0 24px rgba(204,41,54,0.4), 0 4px 16px rgba(204,41,54,0.25)",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              transition: "all 0.2s",
            }}
          >
            {isPending ? <><i className="bx bx-loader-alt bx-spin" style={{ fontSize: 18 }} /> Sending…</> : "Resend verification email"}
          </button>

          <p style={{ margin: "24px 0 0", fontSize: 14, color: "#6b6b82" }}>
            <Link href="/login" style={{ color: "#cc2936", textDecoration: "none", fontWeight: 500 }}>
              ← Back to Sign in
            </Link>
          </p>
        </div>
      </div>
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
