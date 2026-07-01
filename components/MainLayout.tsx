"use client";

/**
 * MainLayout — application shell.
 *
 * Sidebar behaviour:
 *  Desktop (≥768px) : mini (64px icons-only) ↔ full (280px). Toggle in top header.
 *  Mobile  (<768px) : hidden (translate off-screen) ↔ full overlay (280px). Floating toggle.
 *
 * SECURITY (Rule 18): pure layout — no API calls, no auth logic (§16).
 */

import React, { useState, useEffect, useRef, useTransition } from "react";
import { Menu, PanelRight, Crown, LogOut, Settings2 } from "lucide-react";
import { Sidebar } from "../src/components/Sidebar";
import { ChatArea } from "../src/components/ChatArea";
import { ResultsPanel } from "../src/components/ResultsPanel";
import { ChatProvider } from "../context/ChatContext";
import SettingsPanel from "./SettingsPanel";
import { logout } from "@/app/dashboard/actions";

const SIDEBAR_FULL = 280;
const SIDEBAR_MINI = 64;
const RESULTS_WIDTH = 380;

export interface MainLayoutUser {
  name: string;
  initials: string;
}

export interface MainLayoutProps {
  user?: MainLayoutUser;
  userEmail?: string;
  userCompany?: string;
  userFullName?: string;
  userPhone?: string;
  userWebsite?: string;
  tokenUsed?: number;
  tokenMax?: number;
  tokenRemaining?: number;
}

// ── UserMenu ──────────────────────────────────────────────────────────────────

function UserMenu({
  user,
  tokenRemaining = 0,
  tokenMax = 400,
  onOpenSettings,
}: {
  user?: MainLayoutUser;
  tokenRemaining?: number;
  tokenMax?: number;
  onOpenSettings: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const pct = tokenMax > 0 ? Math.min(1, tokenRemaining / tokenMax) : 0;
  const ringDeg = Math.round(pct * 360);
  const initials = user?.initials ?? "?";

  return (
    <div ref={ref} style={{ position: "relative" }}>
      {/* Avatar trigger with credit ring */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        style={{ padding: 0, background: "none", border: "none", cursor: "pointer", display: "flex" }}
        aria-label="Account menu"
        aria-expanded={isOpen}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: `conic-gradient(
              rgba(204,41,54,0.95) 0deg,
              rgba(204,41,54,0.95) ${ringDeg}deg,
              rgba(255,255,255,0.12) ${ringDeg}deg,
              rgba(255,255,255,0.12) 360deg
            )`,
            padding: 3,
            boxShadow: "0 0 0 1px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.35)",
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              background: "#2a2a2a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 700,
              color: "#fff",
              letterSpacing: "-0.02em",
              userSelect: "none",
            }}
          >
            {initials}
          </div>
        </div>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 10px)",
            right: 0,
            width: 244,
            borderRadius: 16,
            overflow: "hidden",
            background: "rgba(16,13,22,0.98)",
            border: "1px solid rgba(93,26,27,0.35)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            boxShadow: "0 16px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.03)",
            zIndex: 100,
            animation: "advDropIn 140ms ease forwards",
          }}
        >
          {/* User info */}
          <div
            style={{
              padding: "14px 16px 12px",
              borderBottom: "1px solid rgba(93,26,27,0.15)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: "50%",
                  background: "rgba(93,26,27,0.9)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#fff",
                  flexShrink: 0,
                  userSelect: "none",
                }}
              >
                {initials}
              </div>
              <div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#fff",
                    lineHeight: 1.2,
                  }}
                >
                  {user?.name ?? "Account"}
                </p>
                <span
                  style={{
                    display: "inline-block",
                    marginTop: 4,
                    fontSize: 9,
                    fontWeight: 700,
                    padding: "2px 7px",
                    borderRadius: 4,
                    background: "rgba(93,26,27,0.22)",
                    color: "rgba(204,41,54,0.9)",
                    letterSpacing: "0.07em",
                    textTransform: "uppercase",
                  }}
                >
                  Free Plan
                </span>
              </div>
            </div>

            {/* Credits bar */}
            <div style={{ marginTop: 13 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 6,
                }}
              >
                <span
                  style={{
                    fontSize: 9,
                    color: "rgba(255,255,255,0.35)",
                    fontWeight: 700,
                    letterSpacing: "0.07em",
                    textTransform: "uppercase",
                  }}
                >
                  Credits
                </span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "rgba(255,255,255,0.72)",
                  }}
                >
                  {tokenRemaining.toLocaleString()} left
                </span>
              </div>
              <div
                style={{
                  height: 3,
                  borderRadius: 99,
                  background: "rgba(255,255,255,0.07)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${pct * 100}%`,
                    borderRadius: 99,
                    background:
                      "linear-gradient(90deg, rgba(93,26,27,0.9), rgba(204,41,54,0.9))",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Upgrade CTA */}
          <div
            style={{
              padding: "10px 12px",
              borderBottom: "1px solid rgba(93,26,27,0.1)",
            }}
          >
            <button
              style={{
                width: "100%",
                padding: "9px 14px",
                borderRadius: 10,
                border: "none",
                background: "rgba(93,26,27,0.9)",
                color: "#fff",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                boxShadow: "0 0 18px rgba(93,26,27,0.45)",
              }}
            >
              <Crown size={12} />
              Go Premium — Upgrade
            </button>
          </div>

          {/* Menu items */}
          <div style={{ padding: "6px 0" }}>
            <MenuRow
              icon={<Settings2 size={13} />}
              label="Manage Account"
              onClick={() => {
                setIsOpen(false);
                onOpenSettings();
              }}
            />
          </div>

          {/* Sign out */}
          <div
            style={{
              borderTop: "1px solid rgba(93,26,27,0.1)",
              padding: "6px 0 8px",
            }}
          >
            <button
              onClick={() => {
                setIsOpen(false);
                startTransition(() => logout());
              }}
              disabled={isPending}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "9px 16px",
                background: "none",
                border: "none",
                color: "rgba(255,90,90,0.72)",
                fontSize: 13,
                fontWeight: 500,
                cursor: isPending ? "default" : "pointer",
                textAlign: "left",
                opacity: isPending ? 0.6 : 1,
                transition: "color 120ms",
              }}
              onMouseEnter={(e) => {
                if (!isPending)
                  (e.currentTarget as HTMLButtonElement).style.color = "#ff6b6b";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color =
                  "rgba(255,90,90,0.72)";
              }}
            >
              <LogOut size={13} />
              {isPending ? "Signing out…" : "Sign out"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuRow({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "9px 16px",
        background: "none",
        border: "none",
        color: "rgba(255,255,255,0.6)",
        fontSize: 13,
        fontWeight: 500,
        cursor: "pointer",
        textAlign: "left",
        transition: "color 120ms, background 120ms",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.color = "#fff";
        (e.currentTarget as HTMLButtonElement).style.background =
          "rgba(255,255,255,0.04)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.color =
          "rgba(255,255,255,0.6)";
        (e.currentTarget as HTMLButtonElement).style.background = "none";
      }}
    >
      <span style={{ color: "rgba(255,255,255,0.28)" }}>{icon}</span>
      {label}
    </button>
  );
}

// ── MainLayout ────────────────────────────────────────────────────────────────

export default function MainLayout({
  user,
  userEmail = "",
  userCompany = "",
  userFullName = "",
  userPhone = "",
  userWebsite = "",
  tokenUsed,
  tokenMax,
  tokenRemaining,
}: MainLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isResultsOpen, setIsResultsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Panel/results feature is not wired to a backend yet — kept off for now.
  const PANEL_ENABLED = false;

  useEffect(() => {
    function check() {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    }
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen((o) => !o);

  // Results panel is disabled for now (backend not connected yet). Results will
  // be shown inline in the chat later, so sending a message must NOT open it.
  function handleSendMessage(_content: string) {
    /* no-op until the generation backend is wired up */
  }

  const isCollapsed = !isMobile && !isSidebarOpen;

  const sidebarStyle: React.CSSProperties = isMobile
    ? {
        position: "fixed",
        top: 0,
        left: 0,
        height: "100%",
        width: SIDEBAR_FULL,
        zIndex: 30,
        overflow: "hidden",
        transform: isSidebarOpen ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 300ms ease-in-out",
      }
    : {
        position: "relative",
        flexShrink: 0,
        height: "100%",
        width: isSidebarOpen ? SIDEBAR_FULL : SIDEBAR_MINI,
        overflow: "hidden",
        transition: "width 300ms ease-in-out",
      };

  return (
    <ChatProvider>
      <div className="flex w-full h-screen bg-background text-white overflow-hidden">

        {/* Mobile overlay backdrop */}
        {isMobile && isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-20"
            onClick={() => setIsSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Mobile-only floating sidebar toggle */}
        {isMobile && !isSidebarOpen && (
          <button
            onClick={toggleSidebar}
            style={{ position: "fixed", top: 14, left: 14, zIndex: 50 }}
            className="w-8 h-8 flex items-center justify-center rounded-lg
                       bg-background border border-white/10
                       text-white/40 hover:text-white/72 hover:bg-white/[0.06]
                       transition-all duration-150"
            aria-label="Open sidebar"
          >
            <Menu size={16} />
          </button>
        )}

        {/* Sidebar */}
        <aside
          style={sidebarStyle}
          aria-label="Sidebar navigation"
          aria-hidden={isMobile && !isSidebarOpen}
        >
          <Sidebar
            isCollapsed={isCollapsed}
            onToggle={toggleSidebar}
            onMobileClose={isMobile ? () => setIsSidebarOpen(false) : undefined}
            user={user}
            tokenUsed={tokenUsed}
            tokenMax={tokenMax}
            tokenRemaining={tokenRemaining}
            onSettings={() => setIsSettingsOpen(true)}
          />
        </aside>

        {/* Main content area */}
        <div className="flex flex-1 min-w-0 overflow-hidden relative">

          {/* ── Floating top-right toolbar (no header bar) ──────────────────
              Hidden while Settings is open (would overlap its close button) and
              while the mobile sidebar overlay is open (would sit on top of it). */}
          {!isSettingsOpen && !(isMobile && isSidebarOpen) && (
            <div
              className="absolute top-3 sm:top-3.5 z-30 flex items-center gap-2 sm:gap-2.5"
              style={{
                right: PANEL_ENABLED && isResultsOpen ? RESULTS_WIDTH + 16 : 14,
                transition: "right 300ms ease-in-out",
              }}
            >
              {/* Panel button — present on desktop, hidden on mobile. Inert for
                  now (results panel is gated behind PANEL_ENABLED until the
                  backend is wired up). */}
              {!isMobile && (
                <button
                  onClick={() => setIsResultsOpen((o) => !o)}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-[13px] font-semibold
                             text-white/70 hover:text-white backdrop-blur-md transition-all duration-150"
                  style={{
                    border: "1px solid rgba(93,26,27,0.35)",
                    background: "rgba(26,26,26,0.75)",
                  }}
                  aria-label="Panel"
                >
                  <span className="inline-flex items-center justify-center rounded-md bg-red-500/10 text-red-600 shadow-[0_0_15px_rgba(220,38,38,0.15)] p-1">
                    <PanelRight size={14} />
                  </span>
                  Panel
                </button>
              )}

              {/* Pricing button */}
              <button
                className="flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl text-[13px] font-semibold
                           text-white/70 hover:text-white backdrop-blur-md transition-all duration-150"
                style={{
                  border: "1px solid rgba(93,26,27,0.35)",
                  background: "rgba(26,26,26,0.75)",
                }}
                aria-label="Pricing"
              >
                <span className="inline-flex items-center justify-center rounded-md bg-red-500/10 text-red-600 shadow-[0_0_15px_rgba(220,38,38,0.15)] p-1">
                  <Crown size={14} />
                </span>
                Pricing
              </button>

              {/* User account dropdown with credit ring */}
              <UserMenu
                user={user}
                tokenRemaining={tokenRemaining ?? 0}
                tokenMax={tokenMax ?? 400}
                onOpenSettings={() => setIsSettingsOpen(true)}
              />
            </div>
          )}

          {/* Content: settings OR chat + results */}
          {isSettingsOpen ? (
            <SettingsPanel
              email={userEmail}
              company={userCompany}
              fullName={userFullName}
              phone={userPhone}
              website={userWebsite}
              credits={tokenRemaining ?? 0}
              initials={user?.initials ?? "?"}
              onClose={() => setIsSettingsOpen(false)}
            />
          ) : (
            <>
              {/* Chat column */}
              <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <ChatArea
                  projectName="New conversation"
                  onSendMessage={handleSendMessage}
                />
              </main>

              {/* Results panel — disabled for now (PANEL_ENABLED === false) */}
              {PANEL_ENABLED && isResultsOpen && (
                <aside
                  className="flex-shrink-0 h-full hidden md:block overflow-hidden"
                  style={{
                    width: RESULTS_WIDTH,
                    borderLeft: "1px solid rgba(93,26,27,0.2)",
                    boxShadow: "-2px 0 16px rgba(0,0,0,0.3)",
                  }}
                >
                  <ResultsPanel
                    showResults={isResultsOpen}
                    isGenerating={false}
                    progress={0}
                    currentPhase={1}
                  />
                </aside>
              )}
            </>
          )}
        </div>
      </div>
    </ChatProvider>
  );
}
