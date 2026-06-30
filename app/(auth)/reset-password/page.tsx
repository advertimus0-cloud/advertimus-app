"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { Lock, Eye, EyeOff } from "lucide-react";
import { updatePassword } from "./actions";

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

function PasswordInput({
  value, onChange, show, onToggle, placeholder, disabled, borderOverride,
}: {
  value: string; onChange: (v: string) => void;
  show: boolean; onToggle: () => void;
  placeholder: string; disabled: boolean; borderOverride?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <div style={{
        position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
        color: focused ? "#cc2936" : "#6b6b82", display: "flex", transition: "color 0.2s",
      }}>
        <Lock size={16} />
      </div>
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%", padding: "14px 44px 14px 44px", borderRadius: 12,
          background: "rgba(255,255,255,0.05)",
          border: borderOverride ?? `1px solid ${focused ? "rgba(204,41,54,0.5)" : "rgba(255,255,255,0.1)"}`,
          color: "#fff", fontSize: 15, outline: "none", boxSizing: "border-box",
          opacity: disabled ? 0.6 : 1, transition: "border-color 0.2s",
        }}
      />
      <button type="button" onClick={onToggle} tabIndex={-1}
        style={{
          position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
          background: "none", border: "none", cursor: "pointer", color: "#6b6b82", padding: 0, display: "flex",
        }}>
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}

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
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }
    setError(null);
    startTransition(async () => {
      const result = await updatePassword(password);
      if (result?.error) setError(result.error);
      // On success, updatePassword() calls redirect('/dashboard') server-side
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
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
            <img src="/advertimus-logo.PNG" alt="Advertimus" style={{ height: 36, objectFit: "contain", display: "block" }} />
          </div>

          {/* Lock icon */}
          <div style={{
            width: 64, height: 64, borderRadius: "50%",
            background: "rgba(93,26,27,0.15)", border: "1px solid rgba(93,26,27,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 24px",
          }}>
            <Lock size={26} color="#cc2936" />
          </div>

          <h1 style={{ margin: "0 0 8px", fontSize: 26, fontWeight: 700, color: "#fff", textAlign: "center", letterSpacing: "-0.02em" }}>
            Set new password
          </h1>
          <p style={{ margin: "0 0 28px", fontSize: 15, color: "#6b6b82", textAlign: "center" }}>
            Choose a strong password for your account.
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
            <PasswordInput
              value={password} onChange={setPassword}
              show={showPassword} onToggle={() => setShowPassword(v => !v)}
              placeholder="At least 8 characters" disabled={isPending}
            />
            <div>
              <PasswordInput
                value={confirmPassword} onChange={setConfirmPassword}
                show={showConfirm} onToggle={() => setShowConfirm(v => !v)}
                placeholder="Re-enter your new password" disabled={isPending}
                borderOverride={passwordMismatch ? "1px solid rgba(204,41,54,0.6)" : undefined}
              />
              {passwordMismatch && (
                <p style={{ margin: "6px 0 0", fontSize: 12, color: "#ff7875" }}>Passwords do not match.</p>
              )}
            </div>

            <button
              type="submit"
              disabled={!isReady}
              className={isReady ? "adv-animated-btn" : ""}
              style={{
                marginTop: 4, padding: 15, borderRadius: 12,
                background: isReady ? undefined : "rgba(255,255,255,0.06)",
                border: isReady ? undefined : "none",
                color: isReady ? "#fff" : "#4a4a62",
                fontSize: 15, fontWeight: 700, cursor: isReady ? "pointer" : "default",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                width: "100%",
              }}
            >
              {isPending ? <><i className="bx bx-loader-alt bx-spin" style={{ fontSize: 18 }} /> Updating…</> : "Update password"}
            </button>
          </form>

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
