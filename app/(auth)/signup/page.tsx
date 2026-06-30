"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, Building2 } from "lucide-react";
import { signUp, getGoogleOAuthUrl } from "./actions";

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

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

function InputField({
  type, value, onChange, placeholder, disabled, icon, right, borderOverride,
}: {
  type: string; value: string; onChange: (v: string) => void;
  placeholder: string; disabled: boolean;
  icon: React.ReactNode; right?: React.ReactNode; borderOverride?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <div style={{
        position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
        color: focused ? "#cc2936" : "#6b6b82", display: "flex", transition: "color 0.2s",
      }}>
        {icon}
      </div>
      <input
        type={type}
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
      {right && (
        <div style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", display: "flex" }}>
          {right}
        </div>
      )}
    </div>
  );
}

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
  const isReady = email && password.length >= 8 && password === confirmPassword && agreed && !isPending;

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }
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
      if ("error" in result && result.error) setError(result.error);
      else if ("url" in result && result.url) window.location.href = result.url;
    });
  };

  const eyeBtn = (show: boolean, toggle: () => void) => (
    <button type="button" onClick={toggle} tabIndex={-1}
      style={{ background: "none", border: "none", cursor: "pointer", color: "#6b6b82", padding: 0, display: "flex" }}>
      {show ? <EyeOff size={16} /> : <Eye size={16} />}
    </button>
  );

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

          <h1 style={{ margin: "0 0 8px", fontSize: 28, fontWeight: 700, color: "#fff", textAlign: "center", letterSpacing: "-0.02em" }}>
            Create your account
          </h1>
          <p style={{ margin: "0 0 28px", fontSize: 15, color: "#6b6b82", textAlign: "center" }}>
            Start your 7-day free trial.
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

          {/* Google first */}
          <button
            onClick={handleGoogle}
            disabled={isPending}
            style={{
              width: "100%", padding: 14, borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.04)", color: "#fff", fontSize: 15, fontWeight: 500,
              cursor: isPending ? "default" : "pointer",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
              transition: "background 0.2s", opacity: isPending ? 0.6 : 1, marginBottom: 24,
            }}
            onMouseEnter={e => { if (!isPending) (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.07)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)"; }}
          >
            <GoogleIcon />
            Continue with Google
          </button>

          {/* OR divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
            <span style={{ fontSize: 12, color: "#6b6b82", fontWeight: 500 }}>or</span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.08)" }} />
          </div>

          <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <InputField type="email" value={email} onChange={setEmail}
              placeholder="email@company.com" disabled={isPending} icon={<Mail size={16} />} />

            <InputField type="text" value={company} onChange={setCompany}
              placeholder="Company name (optional)" disabled={isPending} icon={<Building2 size={16} />} />

            <InputField type={showPassword ? "text" : "password"} value={password} onChange={setPassword}
              placeholder="At least 8 characters" disabled={isPending} icon={<Lock size={16} />}
              right={eyeBtn(showPassword, () => setShowPassword(v => !v))} />

            <div>
              <InputField type={showConfirm ? "text" : "password"} value={confirmPassword} onChange={setConfirmPassword}
                placeholder="Re-enter your password" disabled={isPending} icon={<Lock size={16} />}
                right={eyeBtn(showConfirm, () => setShowConfirm(v => !v))}
                borderOverride={passwordMismatch ? "1px solid rgba(204,41,54,0.6)" : undefined}
              />
              {passwordMismatch && (
                <p style={{ margin: "6px 0 0", fontSize: 12, color: "#ff7875" }}>Passwords do not match.</p>
              )}
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
                id="terms" disabled={isPending}
                style={{ marginTop: 3, width: 16, height: 16, cursor: "pointer", accentColor: "#cc2936", flexShrink: 0 }}
              />
              <label htmlFor="terms" style={{ fontSize: 13, color: "#6b6b82", lineHeight: 1.5, cursor: "pointer" }}>
                I agree to the{" "}
                <a href="#" style={{ color: "#cc2936", textDecoration: "none" }}>Terms of Service</a>
                {" "}and{" "}
                <a href="#" style={{ color: "#cc2936", textDecoration: "none" }}>Privacy Policy</a>.
              </label>
            </div>

            <button
              type="submit"
              disabled={!isReady}
              style={{
                marginTop: 4, padding: 15, borderRadius: 12, border: "none",
                background: isReady ? "#cc2936" : "rgba(255,255,255,0.06)",
                color: isReady ? "#fff" : "#4a4a62",
                fontSize: 15, fontWeight: 700, cursor: isReady ? "pointer" : "default",
                boxShadow: isReady ? "0 0 24px rgba(204,41,54,0.4), 0 4px 16px rgba(204,41,54,0.25)" : "none",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                transition: "all 0.2s",
              }}
            >
              {isPending ? <><i className="bx bx-loader-alt bx-spin" style={{ fontSize: 18 }} /> Creating account…</> : "Start Free Trial"}
            </button>
          </form>

          <p style={{ margin: "24px 0 0", textAlign: "center", fontSize: 14, color: "#6b6b82" }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "#cc2936", textDecoration: "none", fontWeight: 500 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
