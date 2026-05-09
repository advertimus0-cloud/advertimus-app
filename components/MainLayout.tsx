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

  return (
    <ChatProvider>
      <div className="flex flex-col w-full h-screen bg-background text-white overflow-hidden">

        {/* ── Global header ── */}
        <Header
          onMenuToggle={() => setIsSidebarOpen(o => !o)}
          isSidebarOpen={isSidebarOpen}
          projectTitle="New conversation"
          projectSubtitle="AI marketing assistant · ready to generate"
          onPanelToggle={() => setIsResultsOpen(o => !o)}
          isPanelOpen={isResultsOpen}
        />

        {/* ── Body ── */}
        <div className="flex flex-1 overflow-hidden relative">

          {/* Mobile backdrop */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black/60 z-20 md:hidden"
              onClick={() => setIsSidebarOpen(false)}
              aria-hidden="true"
            />
          )}

          {/* Sidebar */}
          <aside
            className={[
              "w-[260px] flex-shrink-0 h-full z-30",
              "fixed md:relative md:translate-x-0",
              "transition-transform duration-200 ease-in-out",
              isSidebarOpen ? "translate-x-0" : "-translate-x-full",
            ].join(" ")}
          >
            <Sidebar />
          </aside>

          {/* Chat column */}
          <main
            className="flex-1 flex flex-col min-w-0 overflow-hidden"
            style={{ borderLeft: '1px solid rgba(93,26,27,0.14)' }}
          >
            <ChatArea
              projectName="New conversation"
              onSendMessage={handleSendMessage}
            />
          </main>

          {/* Results panel */}
          {isResultsOpen && (
            <aside
              className="w-[380px] flex-shrink-0 h-full hidden md:block overflow-hidden"
              style={{ borderLeft: '1px solid rgba(93,26,27,0.14)' }}
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
