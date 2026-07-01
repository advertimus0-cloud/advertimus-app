"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { updateProfile, changePassword, deleteAccount } from "./actions";
import { logout } from "../actions";

const card: React.CSSProperties = {
  background: "rgba(255,255,255,0.02)",
  borderRadius: 20,
  padding: "28px 28px",
  border: "1px solid rgba(255,255,255,0.06)",
  marginBottom: 20,
};

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "12px 14px", borderRadius: 10,
  background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.1)",
  color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box",
};

const label: React.CSSProperties = {
  display: "block", marginBottom: 6, fontSize: 12, fontWeight: 600, color: "#c0c0d0",
};

const primaryBtn = (disabled: boolean): React.CSSProperties => ({
  padding: "11px 20px", borderRadius: 10, border: "none",
  background: disabled ? "rgba(255,255,255,0.05)" : "rgba(93,26,27,0.9)",
  color: disabled ? "#5a5a72" : "#fff", fontSize: 14, fontWeight: 600,
  cursor: disabled ? "default" : "pointer",
  boxShadow: disabled ? "none" : "0 0 20px rgba(93,26,27,0.5), 0 4px 12px rgba(93,26,27,0.3)",
});

function Banner({ kind, text }: { kind: "error" | "success"; text: string }) {
  const isError = kind === "error";
  return (
    <div style={{
      marginBottom: 16, padding: "10px 14px", borderRadius: 10, fontSize: 13,
      background: isError ? "rgba(93,26,27,0.18)" : "rgba(34,197,94,0.1)",
      border: `1px solid ${isError ? "rgba(93,26,27,0.4)" : "rgba(34,197,94,0.3)"}`,
      color: isError ? "#ff6b6b" : "#4ade80",
    }}>
      {text}
    </div>
  );
}

export default function SettingsForm({
  email,
  company,
  credits,
}: {
  email: string;
  company: string;
  credits: number;
}) {
  return (
    <div style={{ minHeight: "100vh", background: "#000", fontFamily: "Inter, sans-serif", color: "#fff" }}>
      <div style={{ padding: "24px 32px", display: "flex", alignItems: "center", gap: 16 }}>
        <Link href="/dashboard" style={{ color: "#9090a8", display: "flex", alignItems: "center", gap: 6, textDecoration: "none", fontSize: 14 }}>
          <ArrowLeft size={16} /> Back
        </Link>
        <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>Account Settings</h1>
      </div>

      <div style={{ maxWidth: 560, margin: "0 auto", padding: "8px 20px 60px" }}>
        <AccountCard email={email} credits={credits} />
        <ProfileCard initialCompany={company} />
        <PasswordCard />
        <DangerCard />
      </div>
    </div>
  );
}

function AccountCard({ email, credits }: { email: string; credits: number }) {
  const [isPending, startTransition] = useTransition();
  return (
    <div style={card}>
      <h2 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 16px" }}>Account</h2>
      <div style={{ marginBottom: 14 }}>
        <span style={label}>Email</span>
        <p style={{ margin: 0, fontSize: 14, color: "#fff" }}>{email}</p>
      </div>
      <div style={{ marginBottom: 18 }}>
        <span style={label}>Credit Balance</span>
        <p style={{ margin: 0, fontSize: 14, color: "#fff" }}>{credits.toLocaleString()} credits</p>
      </div>
      <button
        onClick={() => startTransition(() => logout())}
        disabled={isPending}
        style={{
          padding: "10px 18px", borderRadius: 10, fontSize: 13, fontWeight: 600,
          background: "transparent", border: "1px solid rgba(255,255,255,0.12)",
          color: "#fff", cursor: isPending ? "default" : "pointer", opacity: isPending ? 0.6 : 1,
        }}
      >
        {isPending ? "Signing out…" : "Sign out"}
      </button>
    </div>
  );
}

function ProfileCard({ initialCompany }: { initialCompany: string }) {
  const [company, setCompany] = useState(initialCompany);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    startTransition(async () => {
      const result = await updateProfile(company);
      if (result?.error) setError(result.error);
      else setSuccess(true);
    });
  };

  return (
    <div style={card}>
      <h2 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 16px" }}>Profile</h2>
      {error && <Banner kind="error" text={error} />}
      {success && <Banner kind="success" text="Profile updated." />}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label style={label}>Company Name</label>
          <input
            type="text"
            value={company}
            onChange={e => { setCompany(e.target.value); setSuccess(false); }}
            placeholder="Company Name"
            disabled={isPending}
            maxLength={100}
            style={inputStyle}
          />
        </div>
        <button type="submit" disabled={isPending} style={primaryBtn(isPending)}>
          {isPending ? "Saving…" : "Save changes"}
        </button>
      </form>
    </div>
  );
}

function PasswordCard() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const mismatch = confirmPassword.length > 0 && newPassword !== confirmPassword;
  const isReady = currentPassword && newPassword.length >= 8 && newPassword === confirmPassword && !isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    startTransition(async () => {
      const result = await changePassword(currentPassword, newPassword);
      if (result?.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    });
  };

  return (
    <div style={card}>
      <h2 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 16px" }}>Change Password</h2>
      {error && <Banner kind="error" text={error} />}
      {success && <Banner kind="success" text="Password changed." />}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <label style={label}>Current Password</label>
          <div style={{ position: "relative" }}>
            <input
              type={showCurrent ? "text" : "password"}
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              disabled={isPending}
              style={{ ...inputStyle, paddingRight: 40 }}
            />
            <button type="button" onClick={() => setShowCurrent(v => !v)} tabIndex={-1}
              style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#5a5a72", cursor: "pointer", display: "flex" }}>
              {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        <div>
          <label style={label}>New Password</label>
          <div style={{ position: "relative" }}>
            <input
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              placeholder="At least 8 characters"
              disabled={isPending}
              minLength={8}
              style={{ ...inputStyle, paddingRight: 40 }}
            />
            <button type="button" onClick={() => setShowNew(v => !v)} tabIndex={-1}
              style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#5a5a72", cursor: "pointer", display: "flex" }}>
              {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        <div>
          <label style={label}>Confirm New Password</label>
          <input
            type={showNew ? "text" : "password"}
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            disabled={isPending}
            style={{ ...inputStyle, border: mismatch ? "1px solid rgba(204,41,54,0.6)" : inputStyle.border }}
          />
          {mismatch && <p style={{ margin: "6px 0 0", fontSize: 12, color: "#ff6b6b" }}>Passwords do not match.</p>}
        </div>
        <div>
          <button type="submit" disabled={!isReady} style={primaryBtn(!isReady)}>
            {isPending ? "Updating…" : "Update password"}
          </button>
        </div>
      </form>
    </div>
  );
}

function DangerCard() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleDelete = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await deleteAccount(password);
      if (result?.error) setError(result.error);
      // On success, deleteAccount() redirects to /login server-side
    });
  };

  return (
    <div style={{ ...card, border: "1px solid rgba(204,41,54,0.3)" }}>
      <h2 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 8px", color: "#ff6b6b" }}>Danger Zone</h2>
      <p style={{ fontSize: 13, color: "#9090a8", margin: "0 0 16px" }}>
        Deleting your account permanently removes all of your data. This cannot be undone.
      </p>

      {!confirmOpen ? (
        <button
          onClick={() => setConfirmOpen(true)}
          style={{
            padding: "10px 18px", borderRadius: 10, fontSize: 13, fontWeight: 600,
            background: "rgba(204,41,54,0.12)", border: "1px solid rgba(204,41,54,0.4)",
            color: "#ff6b6b", cursor: "pointer",
          }}
        >
          Delete account
        </button>
      ) : (
        <form onSubmit={handleDelete} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {error && <Banner kind="error" text={error} />}
          <div>
            <label style={label}>Confirm your password to delete your account</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={isPending}
              style={inputStyle}
              autoFocus
            />
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              type="submit"
              disabled={!password || isPending}
              style={{
                padding: "10px 18px", borderRadius: 10, fontSize: 13, fontWeight: 600,
                background: password && !isPending ? "rgba(93,26,27,0.9)" : "rgba(255,255,255,0.05)",
                color: password && !isPending ? "#fff" : "#5a5a72",
                border: "none", cursor: password && !isPending ? "pointer" : "default",
              }}
            >
              {isPending ? "Deleting…" : "Permanently delete"}
            </button>
            <button
              type="button"
              onClick={() => { setConfirmOpen(false); setPassword(""); setError(null); }}
              disabled={isPending}
              style={{
                padding: "10px 18px", borderRadius: 10, fontSize: 13, fontWeight: 600,
                background: "transparent", border: "1px solid rgba(255,255,255,0.12)",
                color: "#fff", cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
