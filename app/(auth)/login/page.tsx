"use client";

import React, { Suspense, useState, useTransition } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signInWithPassword, getGoogleOAuthUrl } from "./actions";

function LoginContent() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(
    searchParams.get("error") === "auth_callback_failed"
      ? "Authentication failed. Please try again."
      : null
  );
  const [isPending, startTransition] = useTransition();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await signInWithPassword(email, password);
      if (result?.error) setError(result.error);
      // On success, signInWithPassword() calls redirect('/dashboard') server-side
    });
  };

  const handleGoogle = () => {
    setError(null);
    startTransition(async () => {
      const result = await getGoogleOAuthUrl();
      if ("error" in result && result.error) {
        setError(result.error);
      } else if ("url" in result && result.url) {
        window.location.href = result.url;
      }
    });
  };

  const isReady = email && password && !isPending;

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
        <Link href="/signup" style={{ color: "#9090a8", fontSize: 14, textDecoration: "none", fontWeight: 500 }}>
          Don't have an account? <span style={{ color: "#fff" }}>Sign up</span>
        </Link>
      </div>

      {/* Main Form */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
        <div style={{
          width: "100%", maxWidth: 400,
          background: "rgba(255,255,255,0.02)",
          borderRadius: 24, padding: "40px 32px",
          border: "1px solid rgba(255,255,255,0.05)",
          boxShadow: "0 0 80px rgba(93,26,27,0.1), 0 0 40px rgba(22,17,66,0.1)"
        }}>
          <h1 style={{ margin: "0 0 8px", fontSize: 28, fontWeight: 700, color: "#fff", textAlign: "center", letterSpacing: "-0.02em" }}>Welcome back</h1>
          <p style={{ margin: "0 0 32px", fontSize: 15, color: "#9090a8", textAlign: "center" }}>Enter your details to access your workspace.</p>

          {error && (
            <div style={{
              marginBottom: 20, padding: "12px 16px", borderRadius: 10,
              background: "rgba(93,26,27,0.18)", border: "1px solid rgba(93,26,27,0.4)",
              color: "#ff6b6b", fontSize: 13, lineHeight: 1.5
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
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
                  color: "#fff", fontSize: 15, outline: "none", transition: "border 0.2s",
                  boxSizing: "border-box", opacity: isPending ? 0.6 : 1
                }}
                required
              />
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#c0c0d0" }}>Password</label>
                <a href="#" style={{ fontSize: 12, color: "#cc2936", textDecoration: "none" }}>Forgot password?</a>
              </div>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={isPending}
                style={{
                  width: "100%", padding: "14px 16px", borderRadius: 12,
                  background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)",
                  color: "#fff", fontSize: 15, outline: "none", transition: "border 0.2s",
                  boxSizing: "border-box", opacity: isPending ? 0.6 : 1
                }}
                required
              />
            </div>

            <button
              type="submit"
              disabled={!isReady}
              style={{
                marginTop: 8, padding: "16px", borderRadius: 12, border: "none",
                background: isReady ? "linear-gradient(135deg,#5d1a1b,#161142)" : "rgba(255,255,255,0.05)",
                color: isReady ? "#fff" : "#5a5a72",
                fontSize: 16, fontWeight: 600, cursor: isReady ? "pointer" : "default",
                transition: "all 0.2s",
                boxShadow: isReady ? "0 4px 14px rgba(93,26,27,0.3)" : "none",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8
              }}
            >
              {isPending ? (
                <>
                  <i className="bx bx-loader-alt bx-spin" style={{ fontSize: 18 }} />
                  Signing in…
                </>
              ) : "Sign In"}
            </button>
          </form>

          {/* Social Auth */}
          <div style={{ marginTop: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.05)" }} />
              <span style={{ fontSize: 12, color: "#5a5a72", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>OR CONTINUE WITH</span>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.05)" }} />
            </div>

            <button
              onClick={handleGoogle}
              disabled={isPending}
              style={{
                width: "100%", padding: "14px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)",
                background: "transparent", color: "#fff", fontSize: 14, fontWeight: 500,
                cursor: isPending ? "default" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                transition: "background 0.2s", opacity: isPending ? 0.6 : 1
              }}
            >
              <i className="bx bxl-google" style={{ fontSize: 20 }} />
              Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
