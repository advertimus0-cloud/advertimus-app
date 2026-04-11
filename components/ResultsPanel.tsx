"use client";

import React, { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Tab = "All" | "Videos" | "Images" | "Scores";

interface VideoAsset {
  id: string;
  platform: string;
  duration: string;
  title: string;
  quality: string;
  score: number;
}

interface ImageAsset {
  id: string;
  placeholder: string;
}

// ─── Mock data ────────────────────────────────────────────────────────────────
const VIDEOS: VideoAsset[] = [
  { id: "v1", platform: "Instagram Reel · 15s", duration: "0:15", title: "Minimal luxury — reveal", quality: "1920×1080 · MP4", score: 94 },
  { id: "v2", platform: "YouTube Short · 30s", duration: "0:30", title: "Craftsmanship story", quality: "1920×1080 · MP4", score: 88 },
];

const IMAGES: ImageAsset[] = [
  { id: "i1", placeholder: "bx bx-image" },
  { id: "i2", placeholder: "bx bx-shopping-bag" },
  { id: "i3", placeholder: "bx bx-star" },
  { id: "i4", placeholder: "bx bx-store" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────
function ScoreBar({ label, value }: { label: string; value: number }) {
  const color = value >= 90 ? "#22c55e" : value >= 75 ? "#f59e0b" : "#cc2936";
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span style={{ fontSize: 11, color: "#7a7a90" }}>{label}</span>
        <span style={{ fontSize: 11, fontWeight: 700, color }}>{value}</span>
      </div>
      <div style={{ height: 4, borderRadius: 999, background: "rgba(255,255,255,0.07)", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${value}%`, borderRadius: 999, background: color, transition: "width 0.6s ease" }} />
      </div>
    </div>
  );
}

function VideoCard({ asset }: { asset: VideoAsset }) {
  return (
    <div
      style={{
        background: "#1c1c28",
        borderRadius: 12,
        border: "1px solid rgba(255,255,255,0.06)",
        overflow: "hidden",
        marginBottom: 10,
      }}
    >
      {/* Thumbnail */}
      <div
        style={{
          height: 110,
          background: "linear-gradient(135deg,#1a1020,#200a10)",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
      >
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.12)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(4px)",
          }}
        >
          <i className="bx bx-play" style={{ color: "#fff", fontSize: 22, marginLeft: 2 }} />
        </div>
        <span
          style={{
            position: "absolute",
            bottom: 7,
            right: 7,
            fontSize: 10,
            color: "#fff",
            background: "rgba(0,0,0,0.55)",
            padding: "2px 6px",
            borderRadius: 5,
          }}
        >
          {asset.duration}
        </span>
        <span
          style={{
            position: "absolute",
            top: 7,
            left: 8,
            fontSize: 10,
            color: "#9a9ab0",
          }}
        >
          {asset.platform}
        </span>
      </div>

      {/* Info */}
      <div style={{ padding: "10px 12px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
          <p style={{ margin: 0, fontSize: 12.5, fontWeight: 600, color: "#fff", lineHeight: 1.3 }}>{asset.title}</p>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "#22c55e",
              background: "rgba(34,197,94,0.12)",
              padding: "2px 6px",
              borderRadius: 5,
              flexShrink: 0,
              marginLeft: 6,
            }}
          >
            ⭑ {asset.score}
          </span>
        </div>
        <p style={{ margin: "0 0 10px", fontSize: 10.5, color: "#5a5a72" }}>{asset.quality}</p>
        <div style={{ display: "flex", gap: 7 }}>
          {["Preview", "Download"].map((btn, i) => (
            <button
              key={btn}
              style={{
                flex: 1,
                padding: "6px 0",
                borderRadius: 8,
                border: `1px solid ${i === 1 ? "rgba(204,41,54,0.5)" : "rgba(255,255,255,0.08)"}`,
                background: i === 1 ? "rgba(204,41,54,0.12)" : "transparent",
                color: i === 1 ? "#cc2936" : "#7a7a90",
                fontSize: 11,
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {btn}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ResultsPanel() {
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const tabs: Tab[] = ["All", "Videos", "Images", "Scores"];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#0d0d12",
        borderLeft: "1px solid rgba(255,255,255,0.06)",
        fontFamily: "Inter, system-ui, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* ── Header ────────────────────────────────────────────────── */}
      <div
        style={{
          padding: "16px 16px 0",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <h2 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#fff" }}>Generated assets</h2>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: "#22c55e",
              background: "rgba(34,197,94,0.1)",
              border: "1px solid rgba(34,197,94,0.25)",
              padding: "3px 8px",
              borderRadius: 9,
            }}
          >
            6 assets ready
          </span>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 2 }}>
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: "6px 12px",
                borderRadius: "8px 8px 0 0",
                border: "none",
                background: activeTab === tab ? "#1c1c28" : "transparent",
                color: activeTab === tab ? "#fff" : "#5a5a72",
                fontSize: 12,
                fontWeight: activeTab === tab ? 600 : 400,
                cursor: "pointer",
                borderBottom: activeTab === tab ? "2px solid #cc2936" : "2px solid transparent",
                transition: "all 0.15s",
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ───────────────────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: "auto", padding: 14 }}>

        {/* Videos */}
        {(activeTab === "All" || activeTab === "Videos") && (
          <div style={{ marginBottom: 16 }}>
            {activeTab === "All" && (
              <p style={{ margin: "0 0 10px", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: "#5a5a72", textTransform: "uppercase" }}>
                Videos · 2 Generated
              </p>
            )}
            {VIDEOS.map((v) => <VideoCard key={v.id} asset={v} />)}
          </div>
        )}

        {/* Images */}
        {(activeTab === "All" || activeTab === "Images") && (
          <div style={{ marginBottom: 16 }}>
            {activeTab === "All" && (
              <p style={{ margin: "0 0 10px", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: "#5a5a72", textTransform: "uppercase" }}>
                Images · 4 Generated
              </p>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {IMAGES.map((img) => (
                <div
                  key={img.id}
                  style={{
                    aspectRatio: "1",
                    borderRadius: 10,
                    background: "#1c1c28",
                    border: "1px solid rgba(255,255,255,0.06)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "border-color 0.15s",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(204,41,54,0.4)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.06)"; }}
                >
                  <i className={img.placeholder} style={{ fontSize: 28, color: "#3a3a50" }} />
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 7, marginTop: 8 }}>
              {["Select all", "Download all"].map((btn, i) => (
                <button
                  key={btn}
                  style={{
                    flex: 1,
                    padding: "7px 0",
                    borderRadius: 8,
                    border: `1px solid ${i === 1 ? "rgba(204,41,54,0.5)" : "rgba(255,255,255,0.08)"}`,
                    background: i === 1 ? "rgba(204,41,54,0.12)" : "transparent",
                    color: i === 1 ? "#cc2936" : "#7a7a90",
                    fontSize: 11,
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  {btn}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Performance Score */}
        {(activeTab === "All" || activeTab === "Scores") && (
          <div>
            {activeTab === "All" && (
              <p style={{ margin: "0 0 10px", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", color: "#5a5a72", textTransform: "uppercase" }}>
                Performance Prediction
              </p>
            )}
            <div
              style={{
                background: "#1c1c28",
                borderRadius: 12,
                border: "1px solid rgba(255,255,255,0.06)",
                padding: "14px",
              }}
            >
              {/* Big score */}
              <div style={{ display: "flex", alignItems: "flex-end", gap: 6, marginBottom: 14 }}>
                <span
                  style={{
                    fontSize: 52,
                    fontWeight: 900,
                    lineHeight: 1,
                    background: "linear-gradient(135deg,#22c55e,#16a34a)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    letterSpacing: "-0.04em",
                  }}
                >
                  91
                </span>
                <span style={{ fontSize: 13, color: "#5a5a72", marginBottom: 6 }}>/100</span>
              </div>
              <ScoreBar label="Visual Appeal" value={94} />
              <ScoreBar label="Message Clarity" value={89} />
              <ScoreBar label="Audience Alignment" value={92} />
              <ScoreBar label="Call to Action" value={87} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
