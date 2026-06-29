"use client";

/**
 * MainLayout — application shell.
 *
 * Sidebar behaviour (pure JS inline styles — no Tailwind responsive class conflicts):
 *  Desktop (≥768px) : mini (64px icons-only) ↔ full (280px). Toggle lives INSIDE sidebar.
 *  Mobile  (<768px) : hidden (translate off-screen) ↔ full overlay (280px). Floating toggle.
 *
 * Panel button lives as an absolute element inside the main+results container,
 * so it automatically stays to the LEFT of the results panel when it opens.
 *
 * SECURITY (Rule 18): pure layout — no API calls, no auth logic (§16).
 */

import React, { useState, useEffect } from "react";
import { Menu, PanelRight } from "lucide-react";
import { Sidebar } from "../src/components/Sidebar";
import { ChatArea } from "../src/components/ChatArea";
import { ResultsPanel } from "../src/components/ResultsPanel";
import { ChatProvider } from "../context/ChatContext";

const SIDEBAR_FULL = 280;
const SIDEBAR_MINI = 64;
const RESULTS_WIDTH = 380;

export default function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isResultsOpen, setIsResultsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function check() {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Mobile starts closed, desktop starts open
      if (mobile) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    }
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen((o) => !o);

  function handleSendMessage(_content: string) {
    setIsResultsOpen(true);
    setIsGenerating(true);
    setGenerationProgress(0);
    setCurrentPhase(1);

    let phase = 1;
    let progress = 0;
    const interval = setInterval(() => {
      progress += 3;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setIsGenerating(false);
      }
      const newPhase = Math.min(7, Math.ceil((progress / 100) * 7));
      if (newPhase !== phase) {
        phase = newPhase;
        setCurrentPhase(newPhase);
      }
      setGenerationProgress(progress);
    }, 300);
  }

  // ── Sidebar styles ──────────────────────────────────────────────────────────
  // Desktop: mini (64px, icons-only) ↔ full (280px), animate WIDTH
  // Mobile : hidden (off-screen)    ↔ full (280px), animate TRANSFORM
  const isCollapsed = !isMobile && !isSidebarOpen; // desktop mini mode

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
        // Desktop: never collapses to 0 — always shows mini (64px) or full (280px)
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

        {/* Mobile-only floating toggle (only when sidebar is hidden off-screen) */}
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

        {/* Sidebar — toggle button lives INSIDE sidebar (no overlap with logo) */}
        <aside
          style={sidebarStyle}
          aria-label="Sidebar navigation"
          aria-hidden={isMobile && !isSidebarOpen}
        >
          <Sidebar
            isCollapsed={isCollapsed}
            onToggle={toggleSidebar}
            onMobileClose={isMobile ? () => setIsSidebarOpen(false) : undefined}
          />
        </aside>

        {/* ── Main area: chat + results, relative so Panel button is absolute inside ── */}
        <div className="flex flex-1 min-w-0 overflow-hidden relative">

          {/* Panel toggle — absolute inside this container.
              When results panel is open (380px on right), shifts left by 380+12px
              so it naturally floats at the left edge of the results panel. */}
          <button
            onClick={() => setIsResultsOpen((o) => !o)}
            className={[
              "absolute top-3 z-10 flex items-center gap-1.5 px-3 py-1.5",
              "rounded-lg text-xs font-medium transition-all duration-300",
              isResultsOpen
                ? "text-white"
                : "text-white/50 hover:text-white/80 hover:bg-white/[0.05]",
            ].join(" ")}
            style={{
              right: isResultsOpen ? RESULTS_WIDTH + 12 : 12,
              border: isResultsOpen
                ? "1px solid rgba(93,26,27,0.5)"
                : "1px solid rgba(93,26,27,0.28)",
              background: isResultsOpen ? "rgba(93,26,27,0.22)" : undefined,
              transition: "right 300ms ease-in-out, background 150ms, border-color 150ms",
            }}
            aria-label={isResultsOpen ? "Close results panel" : "Open results panel"}
            aria-pressed={isResultsOpen}
          >
            <span className="inline-flex items-center justify-center rounded-md bg-red-500/10 text-red-600 shadow-[0_0_15px_rgba(220,38,38,0.15)] p-1">
              <PanelRight size={13} />
            </span>
            Panel
          </button>

          {/* Chat column */}
          <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <ChatArea
              projectName="New conversation"
              onSendMessage={handleSendMessage}
            />
          </main>

          {/* Results panel */}
          {isResultsOpen && (
            <aside
              className="flex-shrink-0 h-full hidden md:block overflow-hidden"
              style={{
                width: RESULTS_WIDTH,
                borderLeft: "1px solid rgba(93,26,27,0.14)",
              }}
            >
              <ResultsPanel
                showResults={isResultsOpen}
                isGenerating={isGenerating}
                progress={generationProgress}
                currentPhase={currentPhase}
              />
            </aside>
          )}
        </div>
      </div>
    </ChatProvider>
  );
}
