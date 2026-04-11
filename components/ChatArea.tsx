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
const INITIAL_MESSAGES: Message[] = [
  {
    id: "m1",
    role: "ai",
    content:
      "Hi Sarah! I'm **Advertimus**, your AI marketing expert. Tell me about your product and I'll create high-converting ads, videos and designs tailored to your audience.\n\nTo get started — what are you selling, and who's your target customer?",
    timestamp: "Just now",
  },
  {
    id: "m2",
    role: "user",
    content:
      "I sell premium leather wallets. Hand-crafted, slim design. Targeting men 25–45 who care about quality and style. Budget around $200.",
    timestamp: "2 min ago",
  },
  {
    id: "m3",
    role: "ai",
    content:
      "Great niche — **premium leather** has strong purchase intent on Instagram and YouTube. A few quick questions:\n\n1. Do you have product reference photos?\n2. Which platforms — Instagram, TikTok, YouTube, Meta?\n3. Brand vibe — rugged masculine, minimal luxury, or artisan craft?",
    timestamp: "1 min ago",
  },
  {
    id: "m4",
    role: "user",
    content: "Minimal luxury. Instagram and YouTube Shorts. I'll attach some product photos now.",
    timestamp: "Just now",
  },
];

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
export default function ChatArea() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setIsTyping(false), 1200);
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

      {/* ── Input area ────────────────────────────────────────────── */}
      <div
        style={{
          padding: "12px 24px 18px",
          borderTop: "1px solid transparent",
          backgroundImage: "linear-gradient(#000,#000), linear-gradient(90deg,#161142,#5d1a1b)",
          backgroundOrigin: "border-box",
          backgroundClip: "padding-box, border-box",
          borderTopWidth: 1,
          flexShrink: 0,
          background: "#000",
        }}
      >
        {/* Chips */}
        <div style={{ display: "flex", gap: 7, marginBottom: 10, flexWrap: "wrap" }}>
          {CHIPS.map((chip) => (
            <button
              key={chip}
              onClick={() => setInput(chip)}
              style={{
                padding: "5px 13px",
                borderRadius: 20,
                border: "1px solid transparent",
                backgroundImage: "linear-gradient(#060608,#060608), linear-gradient(135deg,#161142,#5d1a1b)",
                backgroundOrigin: "border-box",
                backgroundClip: "padding-box, border-box",
                color: "#6060a0",
                fontSize: 11,
                cursor: "pointer",
                transition: "color 0.2s",
                fontFamily: "Inter, system-ui, sans-serif",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#c0c0e8"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#6060a0"; }}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input row — gradient border */}
        <div
          style={{
            padding: "1px",
            borderRadius: 16,
            background: "linear-gradient(135deg,#161142,#5d1a1b)",
            boxShadow: "0 0 28px rgba(22,17,66,0.3), 0 0 18px rgba(93,26,27,0.15)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              background: "#080810",
              borderRadius: 15,
              padding: "10px 14px",
            }}
          >
            <button
              style={{
                background: "transparent",
                border: "none",
                padding: 0,
                cursor: "pointer",
                color: "#3a3a60",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#8888c0"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = "#3a3a60"; }}
            >
              <i className="bx bx-plus-circle" style={{ fontSize: 20 }} />
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder="Describe your product, campaign goal, or ask anything..."
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                color: "#d4d4e8",
                fontSize: 13.5,
                fontFamily: "inherit",
              }}
            />

            <button
              onClick={handleSend}
              disabled={!input.trim()}
              style={{
                width: 32,
                height: 32,
                borderRadius: 9,
                border: "none",
                background: input.trim()
                  ? "linear-gradient(135deg,#5d1a1b,#161142)"
                  : "rgba(255,255,255,0.04)",
                color: "#fff",
                cursor: input.trim() ? "pointer" : "default",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "background 0.2s, box-shadow 0.2s",
                boxShadow: input.trim() ? "0 0 14px rgba(93,26,27,0.45)" : "none",
              }}
            >
              <i className="bx bx-send" style={{ fontSize: 16 }} />
            </button>
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
