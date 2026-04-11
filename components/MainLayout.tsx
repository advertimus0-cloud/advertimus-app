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
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [isResultsOpen, setIsResultsOpen] = React.useState(true);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsMobile(true);
        setIsSidebarOpen(false); // default closed on mobile
        setIsResultsOpen(false);
      } else {
        setIsMobile(false);
        setIsSidebarOpen(true);
        setIsResultsOpen(true);
      }
    };
    handleResize(); // Initialize
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* ── Left: Sidebar ──────────────────────────────────────── */}
        <div
          style={{
            width: isSidebarOpen ? (isMobile ? "100%" : 220) : 0,
            transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s",
            flexShrink: 0,
            height: "100%",
            overflow: "hidden",
            position: isMobile ? "absolute" : "relative",
            zIndex: isMobile ? 50 : 1,
            left: 0,
            background: "#000",
            transform: isMobile && !isSidebarOpen ? "translateX(-100%)" : "translateX(0)",
          }}
        >
          <div style={{ width: isMobile ? "100%" : 220, height: "100%" }}>
            <Sidebar />
          </div>
        </div>

        {/* ── Center: Chat ────────────────────────────────────────── */}
        <div style={{ flex: 1, minWidth: 0, height: "100%", overflow: "hidden" }}>
          <ChatArea 
            isSidebarOpen={isSidebarOpen} 
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
            isResultsOpen={isResultsOpen}
            onToggleResults={() => setIsResultsOpen(!isResultsOpen)}
          />
        </div>

        {/* ── Right: Results ──────────────────────────────────────── */}
        <div
          style={{
            width: isResultsOpen ? (isMobile ? "100%" : 320) : 0,
            transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s",
            flexShrink: 0,
            height: "100%",
            overflow: "hidden",
            position: isMobile ? "absolute" : "relative",
            zIndex: isMobile ? 40 : 1,
            right: 0,
            background: "#0a0a0a",
            transform: isMobile && !isResultsOpen ? "translateX(100%)" : "translateX(0)",
          }}
        >
          <div style={{ width: isMobile ? "100%" : 320, height: "100%" }}>
            <ResultsPanel />
          </div>
        </div>
      </div>
    </>
  );
}
