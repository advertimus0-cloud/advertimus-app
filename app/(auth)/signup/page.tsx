"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { signUp, getGoogleOAuthUrl } from "./actions";

const inputStyle = (disabled: boolean): React.CSSProperties => ({
  width: "100%", padding: "14px 44px 14px 16px", borderRadius: 12,
  background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)",
  color: "#fff", fontSize: 15, outline: "none",
  boxSizing: "border-box", opacity: disabled ? 0.6 : 1,
});

const eyeStyle: React.CSSProperties = {
  position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
  background: "none", border: "none", cursor: "pointer",
  color: "#5a5a72", fontSize: 20, padding: 0, display: "flex", alignItems: "center",
};

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [company, setCompany] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const passwordMismatch = confirmPassword.length > 0 && password !== confirmPassword;
  const isReady =
    email && password.length >= 8 && password === confirmPassword && agreed && !isPending;

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await signUp(email, password, company);
      if (result?.error) setError(result.error);
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
        <Link href="/login" style={{ color: "#9090a8", fontSize: 14, textDecoration: "none", fontWeight: 500 }}>
          Already have an account? <span style={{ color: "#fff" }}>Sign in</span>
        </Link>
      </div>

      {/* Main Form */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
        <div style={{
          width: "100%", maxWidth: 440,
          background: "rgba(255,255,255,0.02)",
          borderRadius: 24, padding: "40px 32px",
          border: "1px solid rgba(255,255,255,0.05)",
          boxShadow: "0 0 80px rgba(93,26,27,0.1), 0 0 40px rgba(22,17,66,0.1)"
        }}>
          <h1 style={{ margin: "0 0 8px", fontSize: 28, fontWeight: 700, color: "#fff", textAlign: "center", letterSpacing: "-0.02em" }}>Create your account</h1>
          <p style={{ margin: "0 0 32px", fontSize: 15, color: "#9090a8", textAlign: "center" }}>Start your 7-day free trial. No credit card required.</p>

          {error && (
            <div style={{
              marginBottom: 20, padding: "12px 16px", borderRadius: 10,
              background: "rgba(93,26,27,0.18)", border: "1px solid rgba(93,26,27,0.4)",
              color: "#ff6b6b", fontSize: 13, lineHeight: 1.5
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {/* Email */}
            <div>
              <label style={{ display: "block", marginBottom: 8, fontSize: 13, fontWeight: 600, color: "#c0c0d0" }}>Work Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="email@company.com"
                disabled={isPending}
                style={{ ...inputStyle(isPending), padding: "14px 16px" }}
                required
              />
            </div>

            {/* Company */}
            <div>
              <label style={{ display: "block", marginBottom: 8, fontSize: 13, fontWeight: 600, color: "#c0c0d0" }}>
                Company Name <span style={{ color: "#5a5a72", fontWeight: 400 }}>(Optional)</span>
              </label>
              <input
                type="text"
                value={company}
                onChange={e => setCompany(e.target.value)}
                placeholder="Company Name"
                disabled={isPending}
                style={{ ...inputStyle(isPending), padding: "14px 16px" }}
              />
            </div>

            {/* Password */}
            <div>
              <label style={{ display: "block", marginBottom: 8, fontSize: 13, fontWeight: 600, color: "#c0c0d0" }}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  disabled={isPending}
                  style={inputStyle(isPending)}
                  required
                  minLength={8}
                />
                <button type="button" style={eyeStyle} onClick={() => setShowPassword(v => !v)} tabIndex={-1}>
                  <i className={showPassword ? "bx bx-hide" : "bx bx-show"} />
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label style={{ display: "block", marginBottom: 8, fontSize: 13, fontWeight: 600, color: "#c0c0d0" }}>Confirm Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  disabled={isPending}
                  style={{
                    ...inputStyle(isPending),
                    border: passwordMismatch
                      ? "1px solid rgba(204,41,54,0.6)"
                      : "1px solid rgba(255,255,255,0.1)",
                  }}
                  required
                />
                <button type="button" style={eyeStyle} onClick={() => setShowConfirm(v => !v)} tabIndex={-1}>
                  <i className={showConfirm ? "bx bx-hide" : "bx bx-show"} />
                </button>
              </div>
              {passwordMismatch && (
                <p style={{ margin: "6px 0 0", fontSize: 12, color: "#ff6b6b" }}>
                  Passwords do not match.
                </p>
              )}
            </div>

            {/* Terms */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginTop: 4 }}>
              <input
                type="checkbox"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                id="terms"
                disabled={isPending}
                style={{ marginTop: 4, width: 16, height: 16, cursor: "pointer", accentColor: "#cc2936" }}
              />
              <label htmlFor="terms" style={{ fontSize: 13, color: "#9090a8", lineHeight: 1.5, cursor: "pointer" }}>
                I agree to Advertimus's{" "}
                <a href="#" style={{ color: "#fff", textDecoration: "underline" }}>Terms of Service</a>
                {" "}and{" "}
                <a href="#" style={{ color: "#fff", textDecoration: "underline" }}>Privacy Policy</a>.
              </label>
            </div>

            <button
              type="submit"
              disabled={!isReady}
              style={{
                marginTop: 12, padding: "16px", borderRadius: 12, border: "none",
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
                  Creating account…
                </>
              ) : "Start Free Trial"}
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
