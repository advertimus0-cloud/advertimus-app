"use client";

import React from "react";
import Sidebar from "./Sidebar";
import ChatArea from "./ChatArea";
import ResultsPanel from "./ResultsPanel";

/**
 * MainLayout — the 3-column SaaS shell for the Advertimus chat interface.
 *
 * Column widths:
 *   Left  (Sidebar)      : 220px  fixed
 *   Center (ChatArea)    : flex-1 (takes remaining space)
 *   Right  (ResultsPanel): 320px  fixed
 *
 * The right panel collapses below 1100px.
 */
export default function MainLayout() {
  return (
    <>
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          overflow: "hidden",
        }}
      >
        {/* ── Left: Sidebar ──────────────────────────────────────── */}
        <div
          style={{
            width: 220,
            flexShrink: 0,
            height: "100%",
            overflow: "hidden",
          }}
        >
          <Sidebar />
        </div>

        {/* ── Center: Chat ────────────────────────────────────────── */}
        <div style={{ flex: 1, minWidth: 0, height: "100%", overflow: "hidden" }}>
          <ChatArea />
        </div>

        {/* ── Right: Results ──────────────────────────────────────── */}
        <div
          className="results-col"
          style={{
            width: 320,
            flexShrink: 0,
            height: "100%",
            overflow: "hidden",
          }}
        >
          <ResultsPanel />
        </div>
      </div>

      {/* Responsive: hide results panel on narrow screens */}
      <style>{`
        @media (max-width: 1100px) {
          .results-col { display: none; }
        }
        @media (max-width: 700px) {
          /* On mobile, sidebar overlays — handled later */
        }
      `}</style>
    </>
  );
}
