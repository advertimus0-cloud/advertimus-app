"use client";

import React from "react";

import { useChat } from "../context/ChatContext";

// ─── Types ────────────────────────────────────────────────────────────────────
interface HistoryItem {
  id: string;
  title: string;
  subtitle: string;
  active?: boolean;
}

const navItems = [
  { id: "projects", icon: "bx bx-grid-alt", label: "Projects" },
  { id: "assets", icon: "bx bx-folder-open", label: "Assets" },
  { id: "chat", icon: "bx bx-chat", label: "Chat", active: true },
  { id: "history", icon: "bx bx-time-five", label: "History" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────
function HistoryGroup({ label, items, onSelect }: { label: string; items: HistoryItem[]; onSelect: (id: string) => void }) {
  if (items.length === 0) return null;
  return (
    <div style={{ marginBottom: 20 }}>
      <p style={{ margin: "0 0 6px 12px", fontSize: 10, fontWeight: 700, letterSpacing: "0.09em", color: "#5a5a72", textTransform: "uppercase" }}>
        {label}
      </p>
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelect(item.id)}
          style={{
            display: "block",
            width: "100%",
            textAlign: "left",
            padding: "9px 14px",
            borderRadius: 10,
            border: "none",
            cursor: "pointer",
            background: item.active ? "rgba(204,41,54,0.13)" : "transparent",
            borderLeft: item.active ? "2px solid #cc2936" : "2px solid transparent",
            transition: "background 0.15s",
            marginBottom: 2,
          }}
          onMouseEnter={(e) => { if (!item.active) (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)"; }}
          onMouseLeave={(e) => { if (!item.active) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
        >
          <p style={{ margin: 0, fontSize: 13, fontWeight: item.active ? 600 : 400, color: item.active ? "#fff" : "#c0c0d0", lineHeight: 1.3, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
            {item.title}
          </p>
          <p style={{ margin: "2px 0 0", fontSize: 11, color: "#5a5a72", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{item.subtitle}</p>
        </button>
      ))}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Sidebar({ isCollapsed = false }: { isCollapsed?: boolean }) {
  const { chats, activeChatId, switchChat, createNewChat } = useChat();

  const tokenUsed = 200;
  const tokenTotal = 400;
  const pct = Math.round((tokenUsed / tokenTotal) * 100);

  // Group chats naively based on active vs inactive for demonstration
  const recentItems: HistoryItem[] = chats.map(c => ({
    id: c.id,
    title: c.title || "[New Chat]",
    subtitle: `${c.messages.length} messages`,
    active: c.id === activeChatId,
  }));

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#000",
        borderRight: "1px solid transparent",
        backgroundImage: "linear-gradient(#000,#000), linear-gradient(180deg,#161142,#5d1a1b)",
        backgroundOrigin: "border-box",
        backgroundClip: "padding-box, border-box",
        fontFamily: "Inter, system-ui, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* ── Logo ──────────────────────────────────────────────────── */}
      <div style={{ padding: isCollapsed ? "20px 0 16px" : "20px 16px 16px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: isCollapsed ? "center" : "flex-start", gap: 10 }}>
          {/* Bot Avatar — gradient icon */}
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 7,
              overflow: "hidden",
              flexShrink: 0,
              boxShadow: "0 0 12px rgba(93,26,27,0.35)",
              border: "1px solid transparent",
              backgroundImage: "linear-gradient(#000,#000), linear-gradient(135deg,#161142,#5d1a1b)",
              backgroundOrigin: "border-box",
              backgroundClip: "padding-box, border-box",
            }}
          >
            <img
              src="/adverboticon.jpg"
              alt="Advertimus Bot"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </div>
          {!isCollapsed && (
            <span style={{ fontSize: 16, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>
              Advertimus
            </span>
          )}
        </div>
      </div>

      {/* ── Nav ───────────────────────────────────────────────────── */}
      <nav style={{ padding: "12px 8px" }}>
        {navItems.map((n) => (
          <button
            key={n.id}
            onClick={() => { if (n.id === "chat") createNewChat(); }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: isCollapsed ? "center" : "flex-start",
              gap: 10,
              width: "100%",
              padding: isCollapsed ? "9px 0" : "9px 12px",
              borderRadius: 9,
              border: "none",
              cursor: "pointer",
              background: n.active ? "rgba(255,255,255,0.07)" : "transparent",
              color: n.active ? "#fff" : "#7a7a90",
              fontSize: 13,
              fontWeight: n.active ? 600 : 400,
              textAlign: "left",
              marginBottom: 2,
              transition: "background 0.15s, color 0.15s, padding 0.15s",
            }}
            onMouseEnter={(e) => { if (!n.active) { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)"; (e.currentTarget as HTMLButtonElement).style.color = "#c0c0d0"; }}}
            onMouseLeave={(e) => { if (!n.active) { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "#7a7a90"; }}}
          >
            <i className={n.icon} style={{ fontSize: isCollapsed ? 20 : 17 }} />
            {!isCollapsed && (n.id === "chat" ? "New Chat" : n.label)}
          </button>
        ))}
      </nav>

      <div style={{ flex: 1, overflowY: "auto", padding: "0 8px", opacity: isCollapsed ? 0 : 1, transition: "opacity 0.2s" }}>
        {!isCollapsed && (
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 14 }}>
            <HistoryGroup label="Conversations" items={recentItems} onSelect={switchChat} />
          </div>
        )}
      </div>

      {/* ── Footer ────────────────────────────────────────────────── */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "10px 12px" }}>
        {/* User */}
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            width: "100%",
            padding: "7px 4px",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            borderRadius: 8,
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              background: "linear-gradient(135deg,#5b21b6,#7c3aed)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 700,
              color: "#fff",
              flexShrink: 0,
            }}
          >
            [XY]
          </div>
          {!isCollapsed && <span style={{ fontSize: 13, fontWeight: 500, color: "#c0c0d0" }}>[User Name]</span>}
        </button>

        {/* Settings */}
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            width: "100%",
            padding: "7px 4px",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            borderRadius: 8,
            color: "#7a7a90",
            fontSize: 13,
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
        >
          <i className="bx bx-cog" style={{ fontSize: isCollapsed ? 20 : 17 }} />
          {!isCollapsed && "Settings"}
        </button>

        {/* Token bar */}
        {!isCollapsed && (
          <div style={{ marginTop: 10, padding: "0 4px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ fontSize: 10, color: "#5a5a72" }}>Token usage</span>
              <span style={{ fontSize: 10, color: "#5a5a72" }}>{tokenUsed} / {tokenTotal}</span>
            </div>
            <div style={{ height: 4, borderRadius: 999, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
              <div
                style={{
                  height: "100%",
                  width: `${pct}%`,
                  borderRadius: 999,
                  background: "linear-gradient(90deg,#cc2936,#8b1520)",
                  transition: "width 0.4s ease",
                }}
              />
            </div>
            <p style={{ margin: "4px 0 0", fontSize: 10, color: "#5a5a72" }}>
              {tokenTotal - tokenUsed} tokens remaining this month
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
