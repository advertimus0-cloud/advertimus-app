"use client";

import React, { useState, useEffect, useTransition } from "react";
import { X, User, Shield, LogOut, Trash2, Eye, EyeOff, Check, AlertTriangle, Search, UserCircle, CreditCard, Copy, Sparkles, Crown, CalendarClock } from "lucide-react";
import { updateProfile, changePassword, deleteAccount } from "@/app/dashboard/settings/actions";
import { logout } from "@/app/dashboard/actions";

// ─── Hooks ────────────────────────────────────────────────────────────────────

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);
  return isMobile;
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  email: string;
  company: string;
  fullName?: string;
  phone?: string;
  website?: string;
  credits: number;
  initials: string;
  userId?: string;
  onClose: () => void;
}

type Tab = "account" | "profile" | "usage" | "security";

const TRIAL_MAX = 400;

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
      background: disabled ? "rgba(255,255,255,0.06)" : "rgba(93,26,27,0.9)",
      color: disabled ? "#4a4a62" : "#fff",
      fontSize: 13.5, fontWeight: 600, cursor: disabled ? "default" : "pointer",
      boxShadow: disabled ? "none" : "0 0 20px rgba(93,26,27,0.5), 0 4px 12px rgba(93,26,27,0.3)",
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

/* Manus-style row: label + value on the left, action on the right */
function InfoRow({ label, value, action }: { label: string; value: string; action?: React.ReactNode }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
      padding: "16px 0", borderBottom: "1px solid rgba(255,255,255,0.05)",
    }}>
      <div style={{ minWidth: 0 }}>
        <p style={{ margin: "0 0 3px", fontSize: 13.5, fontWeight: 600, color: "#fff" }}>{label}</p>
        <p style={{ margin: 0, fontSize: 12.5, color: "rgba(255,255,255,0.4)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value}</p>
      </div>
      {action && <div style={{ flexShrink: 0 }}>{action}</div>}
    </div>
  );
}

function AccountTab({
  email, credits, initials, fullName, userId, onGoTo,
}: {
  email: string; credits: number; initials: string; fullName: string; userId: string;
  onGoTo: (t: Tab) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [copied, setCopied] = useState(false);
  const handleLogout = () => startTransition(() => logout());

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(userId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch { /* clipboard unavailable — ignore */ }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>

      {/* Identity row: avatar + full name + sign-out */}
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{
          width: 60, height: 60, borderRadius: "50%",
          background: "linear-gradient(135deg,#5d1a1b,#161142)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20, fontWeight: 700, color: "#fff", flexShrink: 0,
          boxShadow: "0 0 24px rgba(93,26,27,0.35)",
        }}>
          {initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: "0 0 5px", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.45)" }}>Full name</p>
          <div style={{
            padding: "10px 14px", borderRadius: 10, fontSize: 14, color: "#fff",
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            {fullName || email.split("@")[0]}
          </div>
        </div>
        <button
          onClick={handleLogout}
          disabled={isPending}
          title="Sign out"
          aria-label="Sign out"
          style={{
            width: 40, height: 40, borderRadius: 10, flexShrink: 0,
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.09)",
            color: "rgba(255,255,255,0.55)", cursor: isPending ? "default" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            opacity: isPending ? 0.5 : 1,
          }}
        >
          <LogOut size={16} />
        </button>
      </div>

      {/* Plan card — Free + Upgrade, credits inside */}
      <div style={{
        borderRadius: 16, border: "1px solid rgba(255,255,255,0.07)",
        background: "linear-gradient(160deg, rgba(93,26,27,0.10) 0%, rgba(255,255,255,0.02) 45%)",
        padding: "18px 22px",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 14, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <span style={{ fontSize: 20, fontWeight: 700, color: "#fff", fontFamily: "var(--font-heading, Georgia, serif)", fontStyle: "italic" }}>
            Free
          </span>
          <button
            onClick={() => onGoTo("usage")}
            style={{
              padding: "8px 18px", borderRadius: 10, border: "none",
              background: "rgba(93,26,27,0.9)", color: "#fff", fontSize: 13, fontWeight: 700,
              cursor: "pointer", boxShadow: "0 0 18px rgba(93,26,27,0.45)",
            }}
          >
            Upgrade
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0 6px" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, fontWeight: 600, color: "#fff" }}>
            <Sparkles size={15} style={{ color: "rgba(204,41,54,0.9)" }} /> Credits
          </span>
          <span style={{ fontSize: 16, fontWeight: 700, color: "#fff" }}>{credits.toLocaleString()}</span>
        </div>
        <div style={{ height: 6, background: "rgba(255,255,255,0.08)", borderRadius: 4, overflow: "hidden", margin: "6px 0 8px" }}>
          <div style={{
            height: "100%", borderRadius: 4,
            width: `${Math.min(100, (credits / TRIAL_MAX) * 100)}%`,
            background: "linear-gradient(90deg,#5d1a1b,#cc2936)",
            transition: "width 0.5s",
          }} />
        </div>
        <p style={{ margin: 0, display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: "rgba(255,255,255,0.35)" }}>
          <CalendarClock size={13} /> {credits} of {TRIAL_MAX} trial credits remaining
        </p>
      </div>

      {/* Info rows */}
      <div>
        <InfoRow label="Email" value={email} />
        <InfoRow
          label="User ID"
          value={userId || "—"}
          action={
            <button
              onClick={handleCopy}
              disabled={!userId}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "8px 14px", borderRadius: 9,
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
                color: copied ? "#4ade80" : "rgba(255,255,255,0.75)", fontSize: 12.5, fontWeight: 600,
                cursor: userId ? "pointer" : "default",
              }}
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
              {copied ? "Copied" : "Copy"}
            </button>
          }
        />
        <InfoRow
          label="Manage sign-in & security"
          value="Password, delete account"
          action={
            <button
              onClick={() => onGoTo("security")}
              style={{
                padding: "8px 14px", borderRadius: 9,
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.75)", fontSize: 12.5, fontWeight: 600, cursor: "pointer",
              }}
            >
              Manage
            </button>
          }
        />
      </div>
    </div>
  );
}

function UsageTab({ credits }: { credits: number }) {
  const used = Math.max(0, TRIAL_MAX - credits);
  const usedPct = Math.min(100, (used / TRIAL_MAX) * 100);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>

      {/* Current plan */}
      <div>
        <SectionTitle>Current plan</SectionTitle>
        <div style={{
          borderRadius: 16, border: "1px solid rgba(93,26,27,0.35)",
          background: "linear-gradient(160deg, rgba(93,26,27,0.14) 0%, rgba(22,17,66,0.10) 100%)",
          padding: "20px 24px",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap",
        }}>
          <div>
            <p style={{ margin: "0 0 4px", display: "flex", alignItems: "center", gap: 8, fontSize: 17, fontWeight: 700, color: "#fff" }}>
              <Crown size={16} style={{ color: "rgba(204,41,54,0.9)" }} /> Free Trial
            </p>
            <p style={{ margin: 0, fontSize: 12.5, color: "rgba(255,255,255,0.4)" }}>
              {TRIAL_MAX} credits included · no payment method required
            </p>
          </div>
          <button style={{
            padding: "10px 22px", borderRadius: 10, border: "none",
            background: "rgba(93,26,27,0.9)", color: "#fff", fontSize: 13.5, fontWeight: 700,
            cursor: "pointer", boxShadow: "0 0 20px rgba(93,26,27,0.5)",
          }}>
            Upgrade to Pro
          </button>
        </div>
      </div>

      {/* Usage */}
      <div>
        <SectionTitle>Usage this trial</SectionTitle>
        <div style={{
          padding: "20px 24px", background: "rgba(255,255,255,0.02)", borderRadius: 14,
          border: "1px solid rgba(255,255,255,0.06)",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>Credits used</span>
            <span style={{ fontSize: 20, fontWeight: 700, color: "#fff" }}>
              {used.toLocaleString()}<span style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", fontWeight: 500 }}> / {TRIAL_MAX}</span>
            </span>
          </div>
          <div style={{ height: 8, background: "rgba(255,255,255,0.08)", borderRadius: 5, overflow: "hidden" }}>
            <div style={{
              height: "100%", borderRadius: 5, width: `${usedPct}%`,
              background: "linear-gradient(90deg,#5d1a1b,#cc2936)", transition: "width 0.5s",
            }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>{credits.toLocaleString()} remaining</span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>{Math.round(usedPct)}% used</span>
          </div>
        </div>
      </div>

      {/* Billing */}
      <div>
        <SectionTitle>Billing</SectionTitle>
        <div style={{
          padding: "26px 24px", background: "rgba(255,255,255,0.02)", borderRadius: 14,
          border: "1px dashed rgba(255,255,255,0.12)", textAlign: "center",
        }}>
          <CreditCard size={22} style={{ color: "rgba(255,255,255,0.25)", marginBottom: 10 }} />
          <p style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>No payment method</p>
          <p style={{ margin: 0, fontSize: 12.5, color: "rgba(255,255,255,0.35)" }}>
            You're on the free trial. Add a payment method when you upgrade — invoices will appear here.
          </p>
        </div>
      </div>
    </div>
  );
}

function ProfileTab({
  initialFullName, initialCompany, initialPhone, initialWebsite, email, initials,
}: {
  initialFullName: string; initialCompany: string; initialPhone: string; initialWebsite: string;
  email: string; initials: string;
}) {
  const [fullName, setFullName] = useState(initialFullName);
  const [company, setCompany] = useState(initialCompany);
  const [phone, setPhone] = useState(initialPhone);
  const [website, setWebsite] = useState(initialWebsite);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const clearStatus = () => setSuccess(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setSuccess(false);
    startTransition(async () => {
      const res = await updateProfile({ fullName, company, phone, website });
      if (res?.error) setError(res.error);
      else setSuccess(true);
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {/* Avatar / identity block */}
      <div style={{
        display: "flex", alignItems: "center", gap: 16, padding: "18px 20px",
        background: "rgba(255,255,255,0.02)", borderRadius: 14,
        border: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{
          width: 58, height: 58, borderRadius: "50%",
          background: "linear-gradient(135deg,#5d1a1b,#161142)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 19, fontWeight: 700, color: "#fff", flexShrink: 0,
        }}>
          {initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "#fff" }}>
            {fullName || company || email.split("@")[0]}
          </p>
          <p style={{ margin: "2px 0 0", fontSize: 12.5, color: "rgba(255,255,255,0.4)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {email}
          </p>
        </div>
        <span style={{
          fontSize: 10, fontWeight: 700, padding: "4px 10px", borderRadius: 6,
          background: "rgba(93,26,27,0.22)", color: "rgba(204,41,54,0.95)",
          letterSpacing: "0.06em", textTransform: "uppercase", flexShrink: 0,
        }}>
          Free Plan
        </span>
      </div>

      <div>
        <SectionTitle>Personal information</SectionTitle>
        {error && <Banner kind="error" text={error} />}
        {success && <Banner kind="success" text="Profile saved successfully." />}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <FieldLabel>Full name</FieldLabel>
            <Input value={fullName} onChange={v => { setFullName(v); clearStatus(); }} placeholder="e.g. Alex Jackson" disabled={isPending} />
          </div>
          <div>
            <FieldLabel>Company name</FieldLabel>
            <Input value={company} onChange={v => { setCompany(v); clearStatus(); }} placeholder="Your company" disabled={isPending} />
          </div>
          <div>
            <FieldLabel>Phone number</FieldLabel>
            <Input value={phone} onChange={v => { setPhone(v); clearStatus(); }} placeholder="+1 234 567 8900" disabled={isPending} />
          </div>
          <div>
            <FieldLabel>Website</FieldLabel>
            <Input value={website} onChange={v => { setWebsite(v); clearStatus(); }} placeholder="https://yourcompany.com" disabled={isPending} />
          </div>
          <div>
            <FieldLabel>Email</FieldLabel>
            <Input value={email} onChange={() => {}} disabled style={{ opacity: 0.7, cursor: "not-allowed" }} />
            <p style={{ margin: "6px 0 0", fontSize: 11.5, color: "rgba(255,255,255,0.3)" }}>
              Your email is used for sign-in and can’t be changed here.
            </p>
          </div>
          <div style={{ paddingTop: 2 }}>
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
                  background: deletePassword && !deletePending ? "rgba(93,26,27,0.9)" : "rgba(255,255,255,0.06)",
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

const TABS: { id: Tab; label: string; icon: React.ReactNode; keywords: string }[] = [
  { id: "account", label: "Account", icon: <UserCircle size={16} />, keywords: "email credits balance plan sign out logout session user id copy" },
  { id: "profile", label: "Profile", icon: <User size={16} />, keywords: "name full company phone website avatar personal information details" },
  { id: "usage", label: "Usage & Billing", icon: <CreditCard size={16} />, keywords: "usage billing plan upgrade credits invoice payment subscription pro trial" },
  { id: "security", label: "Security", icon: <Shield size={16} />, keywords: "password change delete account danger zone privacy" },
];

export default function SettingsPanel({
  email, company, fullName = "", phone = "", website = "", credits, initials, userId = "", onClose,
}: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("account");
  const [search, setSearch] = useState("");
  const isMobile = useIsMobile();

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const activeMeta = TABS.find(t => t.id === activeTab);
  const q = search.trim().toLowerCase();
  const visibleTabs = q
    ? TABS.filter(t => t.label.toLowerCase().includes(q) || t.keywords.includes(q))
    : TABS;

  return (
    // Backdrop — click outside to close
    <div
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Settings"
      style={{
        position: "fixed", inset: 0, zIndex: 60,
        background: "rgba(0,0,0,0.65)",
        backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: isMobile ? 0 : 28,
        animation: "advDropIn 160ms ease",
      }}
    >
      {/* Modal card */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: isMobile ? "100%" : "min(1000px, 100%)",
          height: isMobile ? "100%" : "min(660px, 92vh)",
          background: "#141418",
          border: isMobile ? "none" : "1px solid rgba(255,255,255,0.08)",
          borderRadius: isMobile ? 0 : 20,
          boxShadow: "0 40px 90px rgba(0,0,0,0.6), 0 0 60px rgba(93,26,27,0.08)",
          overflow: "hidden",
          display: "flex", flexDirection: "column",
        }}
      >

      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: isMobile ? "14px 14px 14px 18px" : "18px 24px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        flexShrink: 0,
      }}>
        <h2 style={{ margin: 0, fontSize: isMobile ? 16 : 17, fontWeight: 700, color: "#fff", letterSpacing: "-0.01em" }}>
          {activeMeta?.label ?? "Settings"}
        </h2>
        <button
          onClick={onClose}
          aria-label="Close settings"
          style={{
            width: 34, height: 34, borderRadius: 10, border: "1px solid rgba(255,255,255,0.09)",
            background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.5)",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, marginLeft: 12,
          }}
        >
          <X size={16} />
        </button>
      </div>

      {/* Body: left rail on desktop, stacked (nav on top) on mobile */}
      <div style={{
        flex: 1, display: "flex", flexDirection: isMobile ? "column" : "row",
        overflow: "hidden", minHeight: 0,
      }}>

        {/* Nav */}
        <nav style={{
          width: isMobile ? "100%" : 224, flexShrink: 0,
          padding: isMobile ? "12px 14px" : "18px 14px",
          borderRight: isMobile ? "none" : "1px solid rgba(255,255,255,0.06)",
          borderBottom: isMobile ? "1px solid rgba(255,255,255,0.06)" : "none",
          display: "flex", flexDirection: isMobile ? "row" : "column",
          gap: isMobile ? 8 : 4,
          overflowX: isMobile ? "auto" : "visible",
          overflowY: isMobile ? "visible" : "auto",
          alignItems: isMobile ? "center" : "stretch",
        }}>
          {/* Identity block — desktop rail only (Manus style) */}
          {!isMobile && (
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 8px 14px" }}>
              <div style={{
                width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
                background: "linear-gradient(135deg,#5d1a1b,#161142)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700, color: "#fff",
              }}>
                {initials}
              </div>
              <div style={{ minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {fullName || email.split("@")[0]}
                </p>
                <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.35)" }}>Free plan</p>
              </div>
            </div>
          )}

          {/* Search — desktop only (mobile keeps the nav row compact) */}
          {!isMobile && (
            <div style={{ position: "relative", marginBottom: 10 }}>
              <Search size={14} style={{
                position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
                color: "rgba(255,255,255,0.3)",
              }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search settings…"
                style={{
                  width: "100%", boxSizing: "border-box",
                  padding: "9px 12px 9px 34px", borderRadius: 10, outline: "none",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  color: "#fff", fontSize: 13,
                }}
              />
            </div>
          )}

          {visibleTabs.map(tab => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: "flex", alignItems: "center", gap: isMobile ? 8 : 11,
                  padding: isMobile ? "9px 14px" : "11px 14px", borderRadius: 11, border: "none",
                  background: active ? "rgba(93,26,27,0.22)" : "transparent",
                  color: active ? "#fff" : "rgba(255,255,255,0.5)",
                  fontSize: 14, fontWeight: active ? 600 : 500,
                  cursor: "pointer", textAlign: "left",
                  width: isMobile ? "auto" : "100%", flexShrink: 0, whiteSpace: "nowrap",
                  borderLeft: !isMobile && active ? "2px solid rgba(204,41,54,0.9)" : "2px solid transparent",
                  transition: "all 0.15s",
                }}
                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.03)"; }}
                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLButtonElement).style.background = active ? "rgba(93,26,27,0.22)" : "transparent"; }}
              >
                <span style={{ color: active ? "rgba(204,41,54,0.95)" : "rgba(255,255,255,0.35)", display: "flex" }}>
                  {tab.icon}
                </span>
                {tab.label}
              </button>
            );
          })}
          {visibleTabs.length === 0 && (
            <p style={{ padding: "10px 14px", fontSize: 12.5, color: "rgba(255,255,255,0.3)" }}>
              No settings match “{search}”.
            </p>
          )}
        </nav>

        {/* Right content */}
        <div style={{ flex: 1, overflowY: "auto", minWidth: 0 }}>
          <div style={{ maxWidth: 640, padding: isMobile ? "22px 18px 48px" : "28px 32px 48px" }}>
            {activeTab === "account" && (
              <AccountTab
                email={email}
                credits={credits}
                initials={initials}
                fullName={fullName}
                userId={userId}
                onGoTo={setActiveTab}
              />
            )}
            {activeTab === "profile" && (
              <ProfileTab
                initialFullName={fullName}
                initialCompany={company}
                initialPhone={phone}
                initialWebsite={website}
                email={email}
                initials={initials}
              />
            )}
            {activeTab === "usage" && <UsageTab credits={credits} />}
            {activeTab === "security" && <SecurityTab />}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
