"use client";

import React from "react";
import { Header } from "../src/components/Header";
import { Sidebar } from "../src/components/Sidebar";
import ChatArea from "./ChatArea";
import ResultsPanel from "./ResultsPanel";
import { ChatProvider } from "../context/ChatContext";

export default function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isResultsOpen, setIsResultsOpen] = React.useState(false);

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
          <main className="flex-1 flex flex-col min-w-0 overflow-hidden border-l border-accent1/20">
            <ChatArea
              isSidebarOpen={isSidebarOpen}
              onToggleSidebar={() => setIsSidebarOpen(o => !o)}
              isResultsOpen={isResultsOpen}
              onToggleResults={() => setIsResultsOpen(o => !o)}
            />
          </main>

          {/* Results panel */}
          {isResultsOpen && (
            <aside className="w-[380px] flex-shrink-0 h-full border-l border-accent1/20 hidden md:block">
              <ResultsPanel />
            </aside>
          )}
        </div>
      </div>
    </ChatProvider>
  );
}
