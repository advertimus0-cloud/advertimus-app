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
        background: "#000",
        borderRadius: 12,
        border: "1px solid transparent",
        backgroundImage: "linear-gradient(#000,#000), linear-gradient(135deg,#161142,#5d1a1b)",
        backgroundOrigin: "border-box",
        backgroundClip: "padding-box, border-box",
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
  const [isGenerating, setIsGenerating] = useState(false);
  const [genStep, setGenStep] = useState(0);
  const tabs: Tab[] = ["All", "Videos", "Images", "Scores"];

  // Mock progress simulation
  React.useEffect(() => {
    if (isGenerating) {
      if (genStep < 5) {
        const t = setTimeout(() => {
          setGenStep(s => s + 1);
        }, 1200);
        return () => clearTimeout(t);
      }
    }
  }, [isGenerating, genStep]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#000",
        borderLeft: "1px solid transparent",
        backgroundImage: "linear-gradient(#000,#000), linear-gradient(180deg,#161142,#5d1a1b)",
        backgroundOrigin: "border-box",
        backgroundClip: "padding-box, border-box",
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
          <h2 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#fff" }}>
            {isGenerating ? "Workflow active" : "Generated assets"}
          </h2>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Mock Toggle for Presentation */}
            <button 
              onClick={() => { setIsGenerating(!isGenerating); setGenStep(0); }}
              style={{
                fontSize: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                color: "#9090a8", padding: "3px 8px", borderRadius: 9, cursor: "pointer"
              }}
            >
              Toggle Demo
            </button>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: isGenerating ? "#f59e0b" : "#22c55e",
                background: isGenerating ? "rgba(245,158,11,0.1)" : "rgba(34,197,94,0.1)",
                border: isGenerating ? "1px solid rgba(245,158,11,0.25)" :"1px solid rgba(34,197,94,0.25)",
                padding: "3px 8px",
                borderRadius: 9,
              }}
            >
              {isGenerating ? "Processing" : "6 assets ready"}
            </span>
          </div>
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
                background: activeTab === tab ? "rgba(22,17,66,0.45)" : "transparent",
                color: activeTab === tab ? "#fff" : "#5a5a72",
                fontSize: 12,
                fontWeight: activeTab === tab ? 600 : 400,
                cursor: "pointer",
                borderBottom: activeTab === tab ? "2px solid transparent" : "2px solid transparent",
                backgroundImage: activeTab === tab
                  ? "none"
                  : "none",
                boxShadow: activeTab === tab ? "inset 0 -2px 0 0 rgba(93,26,27,0.9)" : "none",
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

        {isGenerating ? (
          <div style={{ padding: "10px 4px" }}>
            <div style={{ 
              background: "rgba(255,255,255,0.02)", 
              border: "1px solid rgba(255,255,255,0.05)", 
              borderRadius: 16, 
              padding: 24,
              boxShadow: "0 4px 20px rgba(0,0,0,0.5)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <i className="bx bx-loader-alt bx-spin" style={{ color: "#cc2936", fontSize: 24 }} />
                <h3 style={{ margin: 0, fontSize: 16, color: "#fff", fontWeight: 600 }}>Generating your content</h3>
              </div>
              
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 12, color: "#9090a8" }}>
                  <span>Status: {genStep === 0 ? "Analyzing" : genStep === 1 ? "Strategy" : genStep === 2 ? "Storyboard" : genStep === 3 ? "Video" : "Finalizing"}</span>
                  <span>{Math.min(100, Math.round((genStep / 4) * 100))}%</span>
                </div>
                <div style={{ height: 6, width: "100%", background: "rgba(255,255,255,0.05)", borderRadius: 999, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${Math.min(100, (genStep / 4) * 100)}%`, background: "linear-gradient(90deg,#5d1a1b,#cc2936)", transition: "width 0.5s ease" }} />
                </div>
                <p style={{ margin: "8px 0 0", fontSize: 11, color: "#5a5a72", textAlign: "right" }}>Estimated time: ~3 min</p>
              </div>

              {/* Steps */}
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[
                  { title: "Images analyzed", active: genStep >= 1 },
                  { title: "Understanding brand & strategy", active: genStep >= 2 },
                  { title: "Creating video storyboard frames", active: genStep >= 3 },
                  { title: "Generating video via Runway AI", active: genStep >= 4 },
                  { title: "Creating product images & posters", active: genStep >= 5 },
                ].map((step, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "center", gap: 10, opacity: genStep >= idx ? 1 : 0.4 }}>
                    <div style={{
                      width: 20, height: 20, borderRadius: "50%",
                      background: step.active ? "#22c55e" : (genStep === idx ? "rgba(204,41,54,0.2)" : "rgba(255,255,255,0.1)"),
                      border: "1px solid transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#fff", fontSize: 12
                    }}>
                      {step.active ? <i className="bx bx-check" /> : (genStep === idx ? <i className="bx bx-loader-alt bx-spin" style={{ color: "#cc2936" }} /> : null)}
                    </div>
                    <span style={{ fontSize: 13, color: step.active ? "#fff" : (genStep === idx ? "#c0c0d0" : "#7a7a90"), fontWeight: genStep === idx ? 600 : 400 }}>
                      {step.title}
                    </span>
                  </div>
                ))}
              </div>

            </div>
          </div>
        ) : (
          <>
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
                    background: "#000",
                    border: "1px solid transparent",
                    backgroundImage: "linear-gradient(#000,#000), linear-gradient(135deg,#161142,#5d1a1b)",
                    backgroundOrigin: "border-box",
                    backgroundClip: "padding-box, border-box",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "box-shadow 0.15s",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "0 0 18px rgba(93,26,27,0.35)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}
                >
                  <i className={img.placeholder} style={{ fontSize: 28, color: "#2a2a40" }} />
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
                background: "#000",
                borderRadius: 12,
                border: "1px solid transparent",
                backgroundImage: "linear-gradient(#000,#000), linear-gradient(135deg,#161142,#5d1a1b)",
                backgroundOrigin: "border-box",
                backgroundClip: "padding-box, border-box",
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
        </>
        )}
      </div>
    </div>
  );
}
