"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { requestPasswordReset } from "./actions";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await requestPasswordReset(email);
      if (result?.error) setError(result.error);
      else setSent(true);
    });
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#000", fontFamily: "Inter, sans-serif" }}>
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
        <Link href="/login" style={{ color: "#9090a8", fontSize: 14, textDecoration: "none", fontWeight: 500 }}>
          Back to <span style={{ color: "#fff" }}>Sign in</span>
        </Link>
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
        <div style={{
          width: "100%", maxWidth: 420,
          background: "rgba(255,255,255,0.02)",
          borderRadius: 24, padding: "40px 32px",
          border: "1px solid rgba(255,255,255,0.05)",
          boxShadow: "0 0 80px rgba(93,26,27,0.1), 0 0 40px rgba(22,17,66,0.1)"
        }}>
          <h1 style={{ margin: "0 0 8px", fontSize: 26, fontWeight: 700, color: "#fff", textAlign: "center", letterSpacing: "-0.02em" }}>
            Reset your password
          </h1>
          <p style={{ margin: "0 0 32px", fontSize: 15, color: "#9090a8", textAlign: "center" }}>
            Enter your email and we'll send you a reset link.
          </p>

          {error && (
            <div style={{
              marginBottom: 20, padding: "12px 16px", borderRadius: 10,
              background: "rgba(93,26,27,0.18)", border: "1px solid rgba(93,26,27,0.4)",
              color: "#ff6b6b", fontSize: 13, lineHeight: 1.5
            }}>
              {error}
            </div>
          )}

          {sent ? (
            <div style={{
              padding: "14px 16px", borderRadius: 10,
              background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)",
              color: "#4ade80", fontSize: 13, lineHeight: 1.6
            }}>
              If an account exists for <strong>{email}</strong>, a password reset link has been sent.
              Check your inbox (and spam folder).
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div>
                <label style={{ display: "block", marginBottom: 8, fontSize: 13, fontWeight: 600, color: "#c0c0d0" }}>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="email@company.com"
                  disabled={isPending}
                  style={{
                    width: "100%", padding: "14px 16px", borderRadius: 12,
                    background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)",
                    color: "#fff", fontSize: 15, outline: "none",
                    boxSizing: "border-box", opacity: isPending ? 0.6 : 1
                  }}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={!email || isPending}
                style={{
                  marginTop: 8, padding: "16px", borderRadius: 12, border: "none",
                  background: email && !isPending ? "linear-gradient(135deg,#5d1a1b,#161142)" : "rgba(255,255,255,0.05)",
                  color: email && !isPending ? "#fff" : "#5a5a72",
                  fontSize: 16, fontWeight: 600, cursor: email && !isPending ? "pointer" : "default",
                  boxShadow: email && !isPending ? "0 4px 14px rgba(93,26,27,0.3)" : "none",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8
                }}
              >
                {isPending ? (
                  <>
                    <i className="bx bx-loader-alt bx-spin" style={{ fontSize: 18 }} />
                    Sending…
                  </>
                ) : "Send reset link"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
