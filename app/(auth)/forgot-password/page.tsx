"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { Mail, CheckCircle } from "lucide-react";
import { requestPasswordReset } from "./actions";

const cardStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: 420,
  background: "rgba(255,255,255,0.03)",
  borderRadius: 24,
  padding: 40,
  border: "1px solid rgba(255,255,255,0.07)",
  boxShadow: "0 0 60px rgba(93,26,27,0.12), 0 32px 64px rgba(0,0,0,0.4)",
  backdropFilter: "blur(20px)",
};

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focused, setFocused] = useState(false);
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
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <img src="/advertimus-logo.PNG" alt="Advertimus" style={{ height: 34, objectFit: "contain" }} />
          </div>

          {sent ? (
            <div style={{ textAlign: "center" }}>
              <div style={{
                width: 64, height: 64, borderRadius: "50%",
                background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 24px",
              }}>
                <CheckCircle size={28} color="#4ade80" />
              </div>
              <h1 style={{ margin: "0 0 12px", fontSize: 26, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>
                Check your inbox
              </h1>
              <p style={{ margin: "0 0 8px", fontSize: 15, color: "#6b6b82", lineHeight: 1.6 }}>
                If an account exists for
              </p>
              <p style={{ margin: "0 0 20px", fontSize: 15, fontWeight: 600, color: "#fff" }}>{email}</p>
              <p style={{ margin: "0 0 32px", fontSize: 14, color: "#6b6b82", lineHeight: 1.6 }}>
                a password reset link has been sent. Check your inbox and spam folder.
              </p>
              <div style={{
                padding: "11px 14px", borderRadius: 10,
                background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)",
                color: "#4ade80", fontSize: 13.5,
              }}>
                Reset link sent successfully.
              </div>
            </div>
          ) : (
            <>
              {/* Icon */}
              <div style={{
                width: 64, height: 64, borderRadius: "50%",
                background: "rgba(93,26,27,0.15)", border: "1px solid rgba(93,26,27,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 24px",
              }}>
                <Mail size={26} color="#cc2936" />
              </div>

              <h1 style={{ margin: "0 0 8px", fontSize: 26, fontWeight: 700, color: "#fff", textAlign: "center", letterSpacing: "-0.02em" }}>
                Forgot password?
              </h1>
              <p style={{ margin: "0 0 28px", fontSize: 15, color: "#6b6b82", textAlign: "center" }}>
                We'll send a reset link to your email.
              </p>

              {error && (
                <div style={{
                  marginBottom: 20, padding: "11px 14px", borderRadius: 10,
                  background: "rgba(204,41,54,0.12)", border: "1px solid rgba(204,41,54,0.3)",
                  color: "#ff7875", fontSize: 13.5,
                }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ position: "relative" }}>
                  <div style={{
                    position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
                    color: focused ? "#cc2936" : "#6b6b82", display: "flex", transition: "color 0.2s",
                  }}>
                    <Mail size={16} />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="email@company.com"
                    disabled={isPending}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    style={{
                      width: "100%", padding: "14px 14px 14px 44px", borderRadius: 12,
                      background: "rgba(255,255,255,0.05)",
                      border: `1px solid ${focused ? "rgba(204,41,54,0.5)" : "rgba(255,255,255,0.1)"}`,
                      color: "#fff", fontSize: 15, outline: "none", boxSizing: "border-box",
                      opacity: isPending ? 0.6 : 1, transition: "border-color 0.2s",
                    }}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={!email || isPending}
                  style={{
                    padding: 15, borderRadius: 12, border: "none",
                    background: email && !isPending ? "#cc2936" : "rgba(255,255,255,0.06)",
                    color: email && !isPending ? "#fff" : "#4a4a62",
                    fontSize: 15, fontWeight: 700, cursor: email && !isPending ? "pointer" : "default",
                    boxShadow: email && !isPending ? "0 0 24px rgba(204,41,54,0.4), 0 4px 16px rgba(204,41,54,0.25)" : "none",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    transition: "all 0.2s",
                  }}
                >
                  {isPending ? <><i className="bx bx-loader-alt bx-spin" style={{ fontSize: 18 }} /> Sending…</> : "Send reset link"}
                </button>
              </form>
            </>
          )}

          <p style={{ margin: "24px 0 0", textAlign: "center", fontSize: 14, color: "#6b6b82" }}>
            <Link href="/login" style={{ color: "#cc2936", textDecoration: "none", fontWeight: 500 }}>
              ← Back to Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
