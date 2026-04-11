"use client";

import React, { useState, useRef, useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Message {
  id: string;
  role: "ai" | "user";
  content: string;
  timestamp: string;
  typing?: boolean;
}

// ─── Mock initial messages ────────────────────────────────────────────────────
// ─── Initial empty messages ─────────────────────────────────────────────────────
const INITIAL_MESSAGES: Message[] = [];

// ─── Quick chip suggestions ───────────────────────────────────────────────────
const CHIPS = ["Create Instagram ad", "Write ad copy", "YouTube Shorts script", "Predict performance"];

// ─── Bold text renderer ───────────────────────────────────────────────────────
function renderText(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} style={{ color: "#fff", fontWeight: 700 }}>
        {part.slice(2, -2)}
      </strong>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    )
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ChatArea({ isSidebarOpen, onToggleSidebar }: { isSidebarOpen?: boolean; onToggleSidebar?: () => void }) {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // setIsTyping(false); 
    const t = setTimeout(() => setIsTyping(false), 500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      content: input,
      timestamp: "Just now",
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "ai",
          content: "Got it! Let me analyse that and prepare the best ad strategy for you.",
          timestamp: "Just now",
        },
      ]);
    }, 1800);
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#000",
        fontFamily: "Inter, system-ui, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* ── Top bar ───────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 24px",
          borderBottom: "1px solid transparent",
          backgroundImage: "linear-gradient(#000,#000), linear-gradient(90deg,#161142,#5d1a1b)",
          backgroundOrigin: "border-box",
          backgroundClip: "padding-box, border-box",
          borderBottomWidth: 1,
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              style={{
                background: "transparent",
                border: "none",
                color: "#9090a8",
                cursor: "pointer",
                padding: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "8px",
                transition: "background 0.2s, color 0.2s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)"; (e.currentTarget as HTMLButtonElement).style.color = "#fff"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "#9090a8"; }}
            >
              <i className={isSidebarOpen ? "bx bx-menu-alt-left" : "bx bx-menu"} style={{ fontSize: 22 }} />
            </button>
          )}

          {/* Bot avatar */}
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 9,
              overflow: "hidden",
              flexShrink: 0,
              border: "1px solid transparent",
              backgroundImage: "linear-gradient(#000,#000), linear-gradient(135deg,#161142,#5d1a1b)",
              backgroundOrigin: "border-box",
              backgroundClip: "padding-box, border-box",
              boxShadow: "0 0 14px rgba(93,26,27,0.35)",
            }}
          >
            <img src="/adverboticon.jpg" alt="Advertimus" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#fff" }}>New conversation</p>
            <p style={{ margin: 0, fontSize: 11, color: "#5a5a72" }}>AI marketing assistant · ready to generate</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["Export", "Share"].map((label) => (
            <button
              key={label}
              style={{
                padding: "6px 14px",
                borderRadius: 8,
                border: "1px solid transparent",
                backgroundImage: "linear-gradient(#0a0a0a,#0a0a0a), linear-gradient(135deg,#161142,#5d1a1b)",
                backgroundOrigin: "border-box",
                backgroundClip: "padding-box, border-box",
                color: "#9090a8",
                fontSize: 12,
                fontWeight: 500,
                cursor: "pointer",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#fff"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#9090a8"; }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Messages ──────────────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "28px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        {messages.map((msg) =>
          msg.role === "ai" ? (
            /* ── AI message: no box, just text ── */
            <div key={msg.id} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              {/* Bot icon pill */}
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  overflow: "hidden",
                  flexShrink: 0,
                  marginTop: 1,
                  border: "1px solid transparent",
                  backgroundImage: "linear-gradient(#000,#000), linear-gradient(135deg,#161142,#5d1a1b)",
                  backgroundOrigin: "border-box",
                  backgroundClip: "padding-box, border-box",
                  boxShadow: "0 0 10px rgba(93,26,27,0.25)",
                }}
              >
                <img src="/adverboticon.jpg" alt="Advertimus" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    margin: 0,
                    fontSize: 13.5,
                    lineHeight: 1.75,
                    color: "#c8c8e0",
                    whiteSpace: "pre-line",
                  }}
                >
                  {renderText(msg.content)}
                </p>
                <p style={{ margin: "6px 0 0", fontSize: 10, color: "#3a3a50" }}>{msg.timestamp}</p>
              </div>
            </div>
          ) : (
            /* ── User message: premium tech bubble ── */
            <div key={msg.id} style={{ display: "flex", justifyContent: "flex-end" }}>
              <div style={{ maxWidth: "72%", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                {/* Gradient-border tech bubble */}
                <div
                  style={{
                    position: "relative",
                    padding: "1px",
                    borderRadius: 16,
                    background: "linear-gradient(135deg,#161142,#5d1a1b)",
                    boxShadow: "0 0 22px rgba(93,26,27,0.25), 0 0 40px rgba(22,17,66,0.2)",
                  }}
                >
                  <div
                    style={{
                      background: "linear-gradient(135deg, rgba(22,17,66,0.85) 0%, rgba(8,6,20,0.95) 100%)",
                      borderRadius: 15,
                      padding: "12px 16px",
                    }}
                  >
                    {/* Decorative top bar */}
                    <div
                      style={{
                        height: 1,
                        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)",
                        marginBottom: 9,
                        borderRadius: 1,
                      }}
                    />
                    <p
                      style={{
                        margin: 0,
                        fontSize: 13.5,
                        lineHeight: 1.65,
                        color: "#e2e2f4",
                        whiteSpace: "pre-line",
                        fontWeight: 450,
                        letterSpacing: "0.01em",
                      }}
                    >
                      {msg.content}
                    </p>
                    {/* Decorative bottom bar */}
                    <div
                      style={{
                        height: 1,
                        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
                        marginTop: 9,
                        borderRadius: 1,
                      }}
                    />
                  </div>
                </div>

                {/* Timestamp + user badge */}
                <div style={{ display: "flex", alignItems: "center", gap: 6, paddingRight: 2 }}>
                  <p style={{ margin: 0, fontSize: 10, color: "#3a3a50" }}>{msg.timestamp}</p>
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg,#5b21b6,#7c3aed)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 8,
                      fontWeight: 800,
                      color: "#fff",
                    }}
                  >
                    SK
                  </div>
                </div>
              </div>
            </div>
          )
        )}

        {/* Typing indicator */}
        {isTyping && (
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                overflow: "hidden",
                flexShrink: 0,
                border: "1px solid transparent",
                backgroundImage: "linear-gradient(#000,#000), linear-gradient(135deg,#161142,#5d1a1b)",
                backgroundOrigin: "border-box",
                backgroundClip: "padding-box, border-box",
                boxShadow: "0 0 10px rgba(93,26,27,0.25)",
              }}
            >
              <img src="/adverboticon.jpg" alt="Advertimus" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </div>
            <div
              style={{
                padding: "12px 16px",
                borderRadius: "4px 14px 14px 14px",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                display: "flex",
                gap: 5,
                alignItems: "center",
              }}
            >
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg,#5d1a1b,#161142)",
                    display: "inline-block",
                    animation: `dot-bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                  }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* ── Input area (Manus Style) ────────────────────────────────── */}
      <div
        style={{
          padding: messages.length === 0 ? "0 24px" : "0 24px 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: messages.length === 0 ? "center" : "flex-end",
          width: "100%",
          flex: messages.length === 0 ? 1 : "0 0 auto",
          background: "#000",
        }}
      >
        <div style={{ maxWidth: 800, width: "100%", display: "flex", flexDirection: "column", gap: 20 }}>
          {messages.length === 0 && (
            <h1 
              style={{ 
                color: "#e2e2f4", 
                fontSize: 32, 
                fontWeight: 500, 
                fontFamily: "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif", 
                textAlign: "center", 
                marginBottom: "16px",
                letterSpacing: "0.01em"
              }}
            >
              lets make the best marketing campaign
            </h1>
          )}
          {/* Main Input Box */}
          <div
            style={{
              padding: "1px",
              borderRadius: 24,
              background: "linear-gradient(135deg,#161142,#5d1a1b)",
              boxShadow: "0 0 40px rgba(22,17,66,0.5), 0 0 20px rgba(93,26,27,0.2)",
            }}
          >
            <div
              style={{
                background: "#0a0a12", // slightly lighter than black for depth
                borderRadius: 23,
                padding: "16px 20px 12px",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {/* Textarea */}
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Assign a task or ask anything..."
                rows={1}
                style={{
                  width: "100%",
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  color: "#e2e2f4",
                  fontSize: 15,
                  fontFamily: "inherit",
                  resize: "none",
                  minHeight: "44px",
                  lineHeight: 1.5,
                }}
              />
              
              {/* Toolbar */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", gap: 14 }}>
                  <button style={{ background: "transparent", border: "none", color: "#6a6a80", cursor: "pointer", padding: 0 }} onMouseEnter={(e) => (e.currentTarget.style.color = "#a0a0c0")} onMouseLeave={(e) => (e.currentTarget.style.color = "#6a6a80")}>
                    <i className="bx bx-plus" style={{ fontSize: 20 }} />
                  </button>
                  <button style={{ background: "transparent", border: "none", color: "#6a6a80", cursor: "pointer", padding: 0 }} onMouseEnter={(e) => (e.currentTarget.style.color = "#a0a0c0")} onMouseLeave={(e) => (e.currentTarget.style.color = "#6a6a80")}>
                    <i className="bx bx-folder" style={{ fontSize: 20 }} />
                  </button>
                  <button style={{ background: "transparent", border: "none", color: "#6a6a80", cursor: "pointer", padding: 0 }} onMouseEnter={(e) => (e.currentTarget.style.color = "#a0a0c0")} onMouseLeave={(e) => (e.currentTarget.style.color = "#6a6a80")}>
                    <i className="bx bx-desktop" style={{ fontSize: 20 }} />
                  </button>
                </div>
                <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                  <button style={{ background: "transparent", border: "none", color: "#6a6a80", cursor: "pointer", padding: 0 }} onMouseEnter={(e) => (e.currentTarget.style.color = "#a0a0c0")} onMouseLeave={(e) => (e.currentTarget.style.color = "#6a6a80")}>
                    <i className="bx bx-history" style={{ fontSize: 20 }} />
                  </button>
                  <button style={{ background: "transparent", border: "none", color: "#6a6a80", cursor: "pointer", padding: 0 }} onMouseEnter={(e) => (e.currentTarget.style.color = "#a0a0c0")} onMouseLeave={(e) => (e.currentTarget.style.color = "#6a6a80")}>
                    <i className="bx bx-microphone" style={{ fontSize: 20 }} />
                  </button>
                  <button
                    onClick={handleSend}
                    disabled={!input.trim()}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      border: "none",
                      background: input.trim() ? "linear-gradient(135deg,#5d1a1b,#161142)" : "rgba(255,255,255,0.06)",
                      color: input.trim() ? "#fff" : "#4a4a60",
                      cursor: input.trim() ? "pointer" : "default",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "background 0.2s, box-shadow 0.2s, color 0.2s",
                      boxShadow: input.trim() ? "0 0 14px rgba(93,26,27,0.45)" : "none",
                    }}
                  >
                    <i className="bx bx-up-arrow-alt" style={{ fontSize: 22 }} />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Chips below input */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
            {CHIPS.map((chip) => (
              <button
                key={chip}
                onClick={() => setInput(chip)}
                style={{
                  padding: "8px 16px",
                  borderRadius: 24,
                  border: "1px solid rgba(255,255,255,0.06)",
                  background: "transparent",
                  color: "#9090a8",
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "#9090a8";
                }}
              >
                <i className="bx bx-layer" style={{ fontSize: 14 }} />
                {chip}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes dot-bounce {
          0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
        /* Custom scrollbar */
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(93,26,27,0.35); border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(93,26,27,0.6); }
      `}</style>
    </div>
  );
}
