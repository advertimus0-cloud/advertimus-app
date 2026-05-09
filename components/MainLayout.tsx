"use client";

import React from "react";
import { Header } from "../src/components/Header";
import { Sidebar } from "../src/components/Sidebar";
import { ChatArea } from "../src/components/ChatArea";
import { ResultsPanel } from "../src/components/ResultsPanel";
import { ChatProvider } from "../context/ChatContext";

export default function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isResultsOpen, setIsResultsOpen] = React.useState(false);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [generationProgress, setGenerationProgress] = React.useState(0);
  const [currentPhase, setCurrentPhase] = React.useState(1);

  function handleSendMessage(_content: string) {
    // Reveal results panel and start mock generation progress
    setIsResultsOpen(true);
    setIsGenerating(true);
    setGenerationProgress(0);
    setCurrentPhase(1);

    // Mock phase progression — replace with real SSE/websocket events
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

  return (
    <ChatProvider>
      <div className="flex flex-col w-full h-screen bg-background text-white overflow-hidden">

        {/* ── Top header bar ── */}
        <Header
          onMenuToggle={() => setIsSidebarOpen(o => !o)}
          isSidebarOpen={isSidebarOpen}
        />

        {/* ── Body: Sidebar | Chat | Results ── */}
        <div className="flex flex-1 overflow-hidden relative">

          {/* Mobile overlay backdrop */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black/60 z-20 md:hidden"
              onClick={() => setIsSidebarOpen(false)}
              aria-hidden="true"
            />
          )}

          {/* Sidebar — fixed on mobile, static on desktop */}
          <aside
            className={[
              "w-[280px] flex-shrink-0 h-full z-30",
              "fixed md:relative md:translate-x-0",
              "transition-transform duration-200 ease-in-out",
              isSidebarOpen ? "translate-x-0" : "-translate-x-full",
            ].join(" ")}
          >
            <Sidebar />
          </aside>

          {/* Main chat column */}
          <main
            className="flex-1 flex flex-col min-w-0 overflow-hidden"
            style={{ borderLeft: '1px solid rgba(93,26,27,0.2)' }}
          >
            <ChatArea
              projectName="New Chat"
              onSendMessage={handleSendMessage}
            />
          </main>

          {/* Results panel — revealed on first send */}
          {isResultsOpen && (
            <aside
              className="w-[400px] flex-shrink-0 h-full hidden md:block overflow-y-auto"
              style={{ borderLeft: '1px solid rgba(93,26,27,0.2)' }}
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
