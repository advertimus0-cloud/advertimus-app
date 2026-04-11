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

// ─── Bold text renderer (very simple) ────────────────────────────────────────
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
        background: "#111118",
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
          padding: "14px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* Bot Avatar */}
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 7,
              overflow: "hidden",
            }}
          >
            <img src="/advertimus-bot.png" alt="Advertimus" className="border-2 border-red-500" style={{ width: "100%", height: "100%", objectFit: "cover", border: "2px solid red", zIndex: 999 }} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#fff" }}>New conversation</p>
            <p style={{ margin: 0, fontSize: 11, color: "#6b6b80" }}>AI marketing assistant · ready to generate</p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {["Export", "Share"].map((label) => (
            <button
              key={label}
              style={{
                padding: "6px 14px",
                borderRadius: 8,
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.04)",
                color: "#c0c0d0",
                fontSize: 12,
                fontWeight: 500,
                cursor: "pointer",
                transition: "border-color 0.15s, background 0.15s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.22)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.1)"; }}
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
          padding: "24px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: "flex",
              flexDirection: msg.role === "user" ? "row-reverse" : "row",
              alignItems: "flex-start",
              gap: 10,
            }}
          >
            {/* Avatar */}
            {msg.role === "ai" ? (
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 8,
                    overflow: "hidden",
                    border: "1px solid rgba(255,255,255,0.1)",
                    background: "rgba(255,255,255,0.03)",
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                >
                  <img src="/advertimus-bot.png" alt="BotIcon" className="border-2 border-red-500" style={{ width: "100%", height: "100%", objectFit: "cover", border: "2px solid red", zIndex: 999 }} />
                </div>
              ) : (
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg,#5b21b6,#7c3aed)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    fontWeight: 700,
                    color: "#fff",
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                >
                  SK
                </div>
              )}
  
              {/* Bubble */}
              <div style={{ maxWidth: "72%" }}>
                <div
                  style={{
                    padding: "12px 15px",
                    borderRadius: msg.role === "ai" ? "4px 14px 14px 14px" : "14px 4px 14px 14px",
                    background: msg.role === "ai" ? "#1c1c28" : "#1f2a4a",
                    border: `1px solid ${msg.role === "ai" ? "rgba(255,255,255,0.06)" : "rgba(79,107,185,0.3)"}`,
                    fontSize: 13.5,
                    lineHeight: 1.65,
                    color: "#d4d4e8",
                    whiteSpace: "pre-line",
                  }}
                >
                  {renderText(msg.content)}
                </div>
                <p
                  style={{
                    margin: "4px 0 0",
                    fontSize: 10,
                    color: "#4a4a5a",
                    textAlign: msg.role === "user" ? "right" : "left",
                  }}
                >
                  {msg.timestamp}
                </p>
              </div>
            </div>
          ))}
  
          {/* Typing indicator */}
          {isTyping && (
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 8,
                  overflow: "hidden",
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.03)",
                  flexShrink: 0,
                }}
              >
                <img src="/advertimus-bot.png" alt="BotIcon" className="border-2 border-red-500" style={{ width: "100%", height: "100%", objectFit: "cover", border: "2px solid red", zIndex: 999 }} />
              </div>
            <div
              style={{
                padding: "12px 16px",
                borderRadius: "4px 14px 14px 14px",
                background: "#1c1c28",
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
                    background: "#cc2936",
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
          padding: "12px 20px 16px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          flexShrink: 0,
          background: "#111118",
        }}
      >
        {/* Chips */}
        <div style={{ display: "flex", gap: 7, marginBottom: 10, flexWrap: "wrap" }}>
          {CHIPS.map((chip) => (
            <button
              key={chip}
              onClick={() => setInput(chip)}
              style={{
                padding: "5px 12px",
                borderRadius: 20,
                border: "1px solid rgba(255,255,255,0.1)",
                background: "transparent",
                color: "#7a7a90",
                fontSize: 11,
                cursor: "pointer",
                transition: "border-color 0.15s, color 0.15s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(204,41,54,0.5)"; (e.currentTarget as HTMLButtonElement).style.color = "#cc2936"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.1)"; (e.currentTarget as HTMLButtonElement).style.color = "#7a7a90"; }}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "#1c1c28",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 14,
            padding: "10px 14px",
            transition: "border-color 0.2s",
          }}
        >
          <button
            style={{
              background: "transparent",
              border: "none",
              padding: 0,
              cursor: "pointer",
              color: "#5a5a72",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
            }}
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
              background: input.trim() ? "linear-gradient(135deg,#cc2936,#8b1520)" : "rgba(255,255,255,0.06)",
              color: "#fff",
              cursor: input.trim() ? "pointer" : "default",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              transition: "background 0.2s",
            }}
          >
            <i className="bx bx-send" style={{ fontSize: 16 }} />
          </button>
        </div>
      </div>

      {/* dot-bounce animation */}
      <style>{`
        @keyframes dot-bounce {
          0%, 80%, 100% { transform: scale(0.7); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
