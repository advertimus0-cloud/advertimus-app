"use client";

import React, { Suspense, useState, useTransition } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { resendVerification } from "../signup/actions";

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
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#000", fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div style={{ padding: "24px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            boxShadow: "0 0 14px rgba(93,26,27,0.35)",
            background: "linear-gradient(135deg,#161142,#5d1a1b)"
          }}>
            <img src="/advernewicon.jpg" alt="Advertimus" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 8 }} />
          </div>
          <span style={{ fontSize: 20, fontWeight: 800, color: "#fff", letterSpacing: "-0.03em" }}>Advertimus</span>
        </Link>
      </div>

      {/* Main Container */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
        <div style={{
          width: "100%", maxWidth: 440,
          background: "rgba(255,255,255,0.02)",
          borderRadius: 24, padding: "48px 32px",
          border: "1px solid rgba(255,255,255,0.05)",
          boxShadow: "0 0 80px rgba(93,26,27,0.1), 0 0 40px rgba(22,17,66,0.1)",
          display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center"
        }}>

          <div style={{
            width: 80, height: 80, borderRadius: "50%",
            background: "rgba(93,26,27,0.15)",
            display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: 24, border: "1px solid rgba(93,26,27,0.5)",
            boxShadow: "0 0 30px rgba(93,26,27,0.2)"
          }}>
            <i className="bx bx-envelope" style={{ fontSize: 40, color: "#cc2936" }} />
          </div>

          <h1 style={{ margin: "0 0 12px", fontSize: 28, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>
            Check your email
          </h1>
          <p style={{ margin: "0 0 8px", fontSize: 15, color: "#9090a8", lineHeight: 1.6 }}>
            We've sent a verification link to
          </p>
          {email && (
            <p style={{ margin: "0 0 24px", fontSize: 15, fontWeight: 600, color: "#fff" }}>
              {email}
            </p>
          )}
          <p style={{ margin: "0 0 32px", fontSize: 14, color: "#9090a8", lineHeight: 1.6 }}>
            Click the link in that email to activate your account and claim your 400 free trial tokens.
          </p>

          {error && (
            <div style={{
              width: "100%", marginBottom: 20, padding: "12px 16px", borderRadius: 10,
              background: "rgba(93,26,27,0.18)", border: "1px solid rgba(93,26,27,0.4)",
              color: "#ff6b6b", fontSize: 13
            }}>
              {error}
            </div>
          )}

          {resent && (
            <div style={{
              width: "100%", marginBottom: 20, padding: "12px 16px", borderRadius: 10,
              background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)",
              color: "#4ade80", fontSize: 13
            }}>
              Verification email resent successfully.
            </div>
          )}

          <button
            onClick={handleResend}
            disabled={isPending || !email}
            style={{
              width: "100%", padding: "16px", borderRadius: 12, border: "none",
              background: isPending ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg,#5d1a1b,#161142)",
              color: isPending ? "#5a5a72" : "#fff",
              fontSize: 16, fontWeight: 600, cursor: isPending ? "default" : "pointer",
              transition: "all 0.2s",
              boxShadow: isPending ? "none" : "0 4px 14px rgba(93,26,27,0.3)",
              display: "flex", justifyContent: "center", alignItems: "center", gap: 10
            }}
          >
            {isPending ? (
              <>
                <i className="bx bx-loader-alt bx-spin" style={{ fontSize: 20 }} />
                Sending…
              </>
            ) : "Resend verification email"}
          </button>

          <div style={{ marginTop: 24 }}>
            <Link href="/login" style={{ color: "#9090a8", fontSize: 14, textDecoration: "none" }}>
              Back to <span style={{ color: "#fff", textDecoration: "underline" }}>Sign in</span>
            </Link>
          </div>

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
