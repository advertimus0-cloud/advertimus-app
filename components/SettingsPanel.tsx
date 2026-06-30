"use client";

import React, { useState, useTransition } from "react";
import { X, User, Shield, LogOut, Trash2, Eye, EyeOff, Check, AlertTriangle } from "lucide-react";
import { updateProfile, changePassword, deleteAccount } from "@/app/dashboard/settings/actions";
import { logout } from "@/app/dashboard/actions";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  email: string;
  company: string;
  credits: number;
  initials: string;
  onClose: () => void;
}

type Tab = "account" | "profile" | "security";

// ─── Shared mini-components ───────────────────────────────────────────────────

function Banner({ kind, text }: { kind: "error" | "success"; text: string }) {
  const ok = kind === "success";
  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: 8,
      padding: "11px 14px", borderRadius: 10, marginBottom: 16,
      fontSize: 13.5, lineHeight: 1.5,
      background: ok ? "rgba(34,197,94,0.1)" : "rgba(204,41,54,0.12)",
      border: `1px solid ${ok ? "rgba(34,197,94,0.25)" : "rgba(204,41,54,0.3)"}`,
      color: ok ? "#4ade80" : "#ff7875",
    }}>
      {ok ? <Check size={15} style={{ flexShrink: 0, marginTop: 1 }} /> : <AlertTriangle size={15} style={{ flexShrink: 0, marginTop: 1 }} />}
      {text}
    </div>
  );
}

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", margin: "0 0 16px" }}>
    {children}
  </h3>
);

const FieldLabel = ({ children }: { children: React.ReactNode }) => (
  <label style={{ display: "block", fontSize: 12.5, fontWeight: 600, color: "rgba(255,255,255,0.6)", marginBottom: 7 }}>
    {children}
  </label>
);

const Input = ({ value, onChange, placeholder, type = "text", disabled, rightSlot, style: extra }: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string; disabled?: boolean; rightSlot?: React.ReactNode; style?: React.CSSProperties;
}) => (
  <div style={{ position: "relative" }}>
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      style={{
        width: "100%", boxSizing: "border-box",
        padding: rightSlot ? "12px 44px 12px 14px" : "12px 14px",
        borderRadius: 10, outline: "none",
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.1)",
        color: "#fff", fontSize: 14,
        opacity: disabled ? 0.55 : 1,
        ...extra,
      }}
    />
    {rightSlot && (
      <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", display: "flex" }}>
        {rightSlot}
      </div>
    )}
  </div>
);

const PrimaryBtn = ({ children, onClick, disabled, type = "button" }: {
  children: React.ReactNode; onClick?: () => void; disabled?: boolean; type?: "button" | "submit";
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    style={{
      padding: "11px 22px", borderRadius: 10, border: "none",
      background: disabled ? "rgba(255,255,255,0.06)" : "linear-gradient(135deg,#5d1a1b,#161142)",
      color: disabled ? "#4a4a62" : "#fff",
      fontSize: 13.5, fontWeight: 600, cursor: disabled ? "default" : "pointer",
      boxShadow: disabled ? "none" : "0 4px 16px rgba(93,26,27,0.3)",
    }}
  >
    {children}
  </button>
);

const OutlineBtn = ({ children, onClick, disabled, style: extra }: {
  children: React.ReactNode; onClick?: () => void; disabled?: boolean; style?: React.CSSProperties;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    style={{
      padding: "10px 20px", borderRadius: 10,
      background: "transparent", border: "1px solid rgba(255,255,255,0.12)",
      color: "rgba(255,255,255,0.7)", fontSize: 13.5, fontWeight: 500,
      cursor: disabled ? "default" : "pointer", opacity: disabled ? 0.5 : 1,
      ...extra,
    }}
  >
    {children}
  </button>
);

// ─── Tabs ────────────────────────────────────────────────────────────────────

function AccountTab({ email, credits, initials, onClose }: { email: string; credits: number; initials: string; onClose: () => void }) {
  const [isPending, startTransition] = useTransition();
  const handleLogout = () => startTransition(() => logout());

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* Avatar + identity */}
      <div style={{
        display: "flex", alignItems: "center", gap: 16, padding: "20px 24px",
        background: "rgba(255,255,255,0.02)", borderRadius: 14,
        border: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{
          width: 54, height: 54, borderRadius: "50%",
          background: "linear-gradient(135deg,#5d1a1b,#161142)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18, fontWeight: 700, color: "#fff", flexShrink: 0,
        }}>
          {initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "#fff", marginBottom: 2 }}>{email}</p>
          <p style={{ margin: 0, fontSize: 12.5, color: "rgba(255,255,255,0.4)" }}>Advertimus account</p>
        </div>
      </div>

      {/* Credits */}
      <div>
        <SectionTitle>Credits</SectionTitle>
        <div style={{
          padding: "20px 24px", background: "rgba(255,255,255,0.02)", borderRadius: 14,
          border: "1px solid rgba(255,255,255,0.06)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>Available balance</span>
            <span style={{ fontSize: 22, fontWeight: 700, color: "#fff" }}>{credits.toLocaleString()}</span>
          </div>
          <div style={{ height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 4, overflow: "hidden" }}>
            <div style={{
              height: "100%", borderRadius: 4,
              width: `${Math.min(100, (credits / 400) * 100)}%`,
              background: credits > 200 ? "linear-gradient(90deg,#22c55e,#16a34a)" : credits > 80 ? "linear-gradient(90deg,#eab308,#ca8a04)" : "linear-gradient(90deg,#ef4444,#dc2626)",
              transition: "width 0.5s",
            }} />
          </div>
          <p style={{ margin: "8px 0 0", fontSize: 12, color: "rgba(255,255,255,0.25)" }}>{credits} / 400 trial credits remaining</p>
        </div>
      </div>

      {/* Sign out */}
      <div>
        <SectionTitle>Session</SectionTitle>
        <button
          onClick={handleLogout}
          disabled={isPending}
          style={{
            display: "flex", alignItems: "center", gap: 10, padding: "12px 16px",
            background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 12, color: "rgba(255,255,255,0.7)", fontSize: 14, fontWeight: 500,
            cursor: isPending ? "default" : "pointer", opacity: isPending ? 0.6 : 1,
            width: "100%",
          }}
        >
          <LogOut size={16} />
          {isPending ? "Signing out…" : "Sign out of Advertimus"}
        </button>
      </div>
    </div>
  );
}

function ProfileTab({ initialCompany }: { initialCompany: string }) {
  const [company, setCompany] = useState(initialCompany);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setSuccess(false);
    startTransition(async () => {
      const res = await updateProfile(company);
      if (res?.error) setError(res.error);
      else setSuccess(true);
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <div>
        <SectionTitle>Company information</SectionTitle>
        {error && <Banner kind="error" text={error} />}
        {success && <Banner kind="success" text="Profile saved successfully." />}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <FieldLabel>Company name</FieldLabel>
            <Input value={company} onChange={v => { setCompany(v); setSuccess(false); }} placeholder="Your company" disabled={isPending} />
          </div>
          <div>
            <PrimaryBtn type="submit" disabled={isPending}>{isPending ? "Saving…" : "Save changes"}</PrimaryBtn>
          </div>
        </form>
      </div>
    </div>
  );
}

function SecurityTab() {
  // ── Change password ──────────────────────────────────────────────
  const [current, setCurrent] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSuccess, setPwSuccess] = useState(false);
  const [pwPending, startPwTransition] = useTransition();

  // ── Delete account ───────────────────────────────────────────────
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deletePending, startDeleteTransition] = useTransition();

  const mismatch = confirmPw.length > 0 && newPw !== confirmPw;
  const pwReady = current && newPw.length >= 8 && newPw === confirmPw && !pwPending;

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPwError(null); setPwSuccess(false);
    if (newPw !== confirmPw) { setPwError("Passwords do not match."); return; }
    startPwTransition(async () => {
      const res = await changePassword(current, newPw);
      if (res?.error) setPwError(res.error);
      else { setPwSuccess(true); setCurrent(""); setNewPw(""); setConfirmPw(""); }
    });
  };

  const handleDelete = (e: React.FormEvent) => {
    e.preventDefault();
    setDeleteError(null);
    startDeleteTransition(async () => {
      const res = await deleteAccount(deletePassword);
      if (res?.error) setDeleteError(res.error);
    });
  };

  const EyeBtn = ({ show, toggle }: { show: boolean; toggle: () => void }) => (
    <button type="button" onClick={toggle} tabIndex={-1}
      style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", display: "flex", padding: 0 }}>
      {show ? <EyeOff size={16} /> : <Eye size={16} />}
    </button>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>

      {/* Change password */}
      <div>
        <SectionTitle>Change password</SectionTitle>
        {pwError && <Banner kind="error" text={pwError} />}
        {pwSuccess && <Banner kind="success" text="Password updated successfully." />}
        <form onSubmit={handlePasswordChange} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <FieldLabel>Current password</FieldLabel>
            <Input type={showCurrent ? "text" : "password"} value={current} onChange={setCurrent} disabled={pwPending}
              rightSlot={<EyeBtn show={showCurrent} toggle={() => setShowCurrent(v => !v)} />} />
          </div>
          <div>
            <FieldLabel>New password</FieldLabel>
            <Input type={showNew ? "text" : "password"} value={newPw} onChange={setNewPw} placeholder="At least 8 characters" disabled={pwPending}
              rightSlot={<EyeBtn show={showNew} toggle={() => setShowNew(v => !v)} />} />
          </div>
          <div>
            <FieldLabel>Confirm new password</FieldLabel>
            <Input type={showNew ? "text" : "password"} value={confirmPw} onChange={setConfirmPw} disabled={pwPending}
              style={mismatch ? { border: "1px solid rgba(204,41,54,0.5)" } : undefined} />
            {mismatch && <p style={{ margin: "5px 0 0", fontSize: 12, color: "#ff7875" }}>Passwords do not match.</p>}
          </div>
          <div style={{ paddingTop: 4 }}>
            <PrimaryBtn type="submit" disabled={!pwReady}>{pwPending ? "Updating…" : "Update password"}</PrimaryBtn>
          </div>
        </form>
      </div>

      {/* Danger zone */}
      <div>
        <SectionTitle>Danger zone</SectionTitle>
        <div style={{
          padding: "20px 22px", borderRadius: 14,
          background: "rgba(204,41,54,0.06)", border: "1px solid rgba(204,41,54,0.2)",
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 16 }}>
            <Trash2 size={18} style={{ color: "#ff7875", flexShrink: 0, marginTop: 1 }} />
            <div>
              <p style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 600, color: "#ff7875" }}>Delete account</p>
              <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>
                Permanently removes your account and all associated data. This action cannot be undone.
              </p>
            </div>
          </div>

          {!deleteOpen ? (
            <button onClick={() => setDeleteOpen(true)} style={{
              padding: "9px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600,
              background: "rgba(204,41,54,0.14)", border: "1px solid rgba(204,41,54,0.35)",
              color: "#ff7875", cursor: "pointer",
            }}>Delete my account</button>
          ) : (
            <form onSubmit={handleDelete} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {deleteError && <Banner kind="error" text={deleteError} />}
              <FieldLabel>Enter your password to confirm</FieldLabel>
              <Input type="password" value={deletePassword} onChange={setDeletePassword} disabled={deletePending} />
              <div style={{ display: "flex", gap: 10, paddingTop: 2 }}>
                <button type="submit" disabled={!deletePassword || deletePending} style={{
                  padding: "9px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600,
                  background: deletePassword && !deletePending ? "#cc2936" : "rgba(255,255,255,0.06)",
                  color: deletePassword && !deletePending ? "#fff" : "#4a4a62",
                  border: "none", cursor: deletePassword && !deletePending ? "pointer" : "default",
                }}>
                  {deletePending ? "Deleting…" : "Permanently delete"}
                </button>
                <OutlineBtn onClick={() => { setDeleteOpen(false); setDeletePassword(""); setDeleteError(null); }}>
                  Cancel
                </OutlineBtn>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── SettingsPanel ────────────────────────────────────────────────────────────

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "account", label: "Account", icon: <User size={15} /> },
  { id: "profile", label: "Profile", icon: <User size={15} /> },
  { id: "security", label: "Security", icon: <Shield size={15} /> },
];

export default function SettingsPanel({ email, company, credits, initials, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("account");

  return (
    <div
      style={{
        flex: 1, overflow: "hidden", display: "flex", flexDirection: "column",
        background: "#0e0e12",
      }}
    >
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "20px 28px", borderBottom: "1px solid rgba(255,255,255,0.06)",
        flexShrink: 0,
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#fff" }}>Settings</h2>
          <p style={{ margin: "2px 0 0", fontSize: 12.5, color: "rgba(255,255,255,0.35)" }}>Manage your account and preferences</p>
        </div>
        <button
          onClick={onClose}
          aria-label="Close settings"
          style={{
            width: 34, height: 34, borderRadius: 10, border: "1px solid rgba(255,255,255,0.09)",
            background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.5)",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <X size={16} />
        </button>
      </div>

      {/* Tab bar */}
      <div style={{
        display: "flex", gap: 4, padding: "12px 28px",
        borderBottom: "1px solid rgba(255,255,255,0.05)", flexShrink: 0,
        overflowX: "auto",
      }}>
        {TABS.map(tab => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: "flex", alignItems: "center", gap: 7,
                padding: "8px 14px", borderRadius: 9, border: "none",
                background: active ? "rgba(93,26,27,0.25)" : "transparent",
                color: active ? "#fff" : "rgba(255,255,255,0.4)",
                fontSize: 13.5, fontWeight: active ? 600 : 500,
                cursor: "pointer", whiteSpace: "nowrap",
                boxShadow: active ? "inset 0 0 0 1px rgba(93,26,27,0.5)" : "none",
                transition: "all 0.15s",
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "28px", maxWidth: 560 }}>
        {activeTab === "account" && <AccountTab email={email} credits={credits} initials={initials} onClose={onClose} />}
        {activeTab === "profile" && <ProfileTab initialCompany={company} />}
        {activeTab === "security" && <SecurityTab />}
      </div>
    </div>
  );
}
