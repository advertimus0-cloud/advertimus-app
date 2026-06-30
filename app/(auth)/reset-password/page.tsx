"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { updatePassword } from "./actions";

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

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const passwordMismatch = confirmPassword.length > 0 && password !== confirmPassword;
  const isReady = password.length >= 8 && password === confirmPassword && !isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await updatePassword(password);
      if (result?.error) setError(result.error);
      // On success, updatePassword() calls redirect('/dashboard') server-side
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
            Set a new password
          </h1>
          <p style={{ margin: "0 0 32px", fontSize: 15, color: "#9090a8", textAlign: "center" }}>
            Choose a strong password for your account.
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

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div>
              <label style={{ display: "block", marginBottom: 8, fontSize: 13, fontWeight: 600, color: "#c0c0d0" }}>New Password</label>
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

            <div>
              <label style={{ display: "block", marginBottom: 8, fontSize: 13, fontWeight: 600, color: "#c0c0d0" }}>Confirm New Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your new password"
                  disabled={isPending}
                  style={{
                    ...inputStyle(isPending),
                    border: passwordMismatch ? "1px solid rgba(204,41,54,0.6)" : "1px solid rgba(255,255,255,0.1)",
                  }}
                  required
                />
                <button type="button" style={eyeStyle} onClick={() => setShowConfirm(v => !v)} tabIndex={-1}>
                  <i className={showConfirm ? "bx bx-hide" : "bx bx-show"} />
                </button>
              </div>
              {passwordMismatch && (
                <p style={{ margin: "6px 0 0", fontSize: 12, color: "#ff6b6b" }}>Passwords do not match.</p>
              )}
            </div>

            <button
              type="submit"
              disabled={!isReady}
              style={{
                marginTop: 8, padding: "16px", borderRadius: 12, border: "none",
                background: isReady ? "linear-gradient(135deg,#5d1a1b,#161142)" : "rgba(255,255,255,0.05)",
                color: isReady ? "#fff" : "#5a5a72",
                fontSize: 16, fontWeight: 600, cursor: isReady ? "pointer" : "default",
                boxShadow: isReady ? "0 4px 14px rgba(93,26,27,0.3)" : "none",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8
              }}
            >
              {isPending ? (
                <>
                  <i className="bx bx-loader-alt bx-spin" style={{ fontSize: 18 }} />
                  Updating…
                </>
              ) : "Update password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
