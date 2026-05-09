'use client'

import React, { useState } from 'react';
import { Header } from '../Header/Header';
import { Sidebar } from '../Sidebar/Sidebar';
import { ChatArea } from '../ChatArea/ChatArea';
import { ResultsPanel } from '../ResultsPanel/ResultsPanel';

/**
 * MainLayout
 *
 * Renders the full 3-column application shell:
 *
 *  ┌──────────────────────────────────────────────────────┐
 *  │                     HEADER (full width)              │
 *  ├──────────────┬──────────────────────┬────────────────┤
 *  │   SIDEBAR    │     CHAT AREA        │  RESULTS PANEL │
 *  │   280px      │     flex-1           │  400px         │
 *  │   (fixed)    │     (main content)   │  (collapsible) │
 *  └──────────────┴──────────────────────┴────────────────┘
 *
 * Mobile behaviour:
 *  - Sidebar: hidden by default, shown as overlay via hamburger toggle
 *  - Results Panel: fixed bottom sheet (50vh) instead of right column
 *  - Chat Area: fills full width
 *
 * Design tokens (from tailwind.config.js):
 *  - bg-background  → #000000
 *  - bg-accent1     → #5d1a1b
 *  - bg-accent2     → #161142
 *  - border-accent1 → #5d1a1b
 *  - text-white     → #FFFFFF
 */

interface MainLayoutProps {
  /** Show the Results Panel — only true after generation has started */
  showResults?: boolean;
  /** Whether generation is currently in progress — forwarded to ResultsPanel */
  isGenerating?: boolean;
}

export function MainLayout({ showResults = false, isGenerating = false }: MainLayoutProps) {
  // Controls the mobile sidebar slide-in state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    // Root container: full viewport height, black background, no scroll on the shell itself
    <div className="flex flex-col h-screen bg-background text-white overflow-hidden">

      {/* ── HEADER ── full-width top bar */}
      <Header onMenuToggle={toggleSidebar} isSidebarOpen={isSidebarOpen} />

      {/* ── CONTENT ROW ── fills remaining height */}
      <div className="flex flex-1 overflow-hidden relative">

        {/* ── MOBILE OVERLAY ── dims content when sidebar is open on small screens */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-20 md:hidden"
            onClick={closeSidebar}
            aria-hidden="true"
          />
        )}

        {/* ── LEFT COLUMN: SIDEBAR ──
            Desktop : always visible, 280px fixed width
            Mobile  : off-screen (-translate-x-full), slides in when isSidebarOpen */}
        <aside
          className={[
            'fixed md:relative',          // fixed on mobile so it overlays; relative on desktop
            'top-0 left-0 h-full',        // full height on mobile (covers header too on mobile)
            'md:top-auto md:h-auto',      // reset on desktop — inherits parent height
            'w-[280px] flex-shrink-0',
            'bg-background border-r border-accent1/30',
            'z-30 md:z-auto',             // above overlay on mobile
            'transition-transform duration-300 ease-in-out',
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
          ].join(' ')}
          aria-label="Sidebar navigation"
        >
          <Sidebar />
        </aside>

        {/* ── CENTER COLUMN: CHAT AREA ──
            Always visible; flex-1 so it fills all remaining horizontal space */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <ChatArea />
        </main>

        {/* ── RIGHT COLUMN: RESULTS PANEL ──
            Hidden until showResults=true (i.e., generation has started).
            Desktop : 400px right column
            Mobile  : fixed bottom sheet at 50vh */}
        {showResults && (
          <aside
            className={[
              // Mobile: fixed bottom sheet
              'fixed bottom-0 left-0 right-0 h-[50vh]',
              // Desktop: static right column
              'md:relative md:bottom-auto md:left-auto md:right-auto md:h-auto',
              'md:w-[400px] flex-shrink-0',
              'bg-background',
              'z-10 md:z-auto',
              'transition-all duration-300 ease-in-out',
            ].join(' ')}
            aria-label="Results panel"
          >
            <ResultsPanel isGenerating={isGenerating} />
          </aside>
        )}

      </div>
    </div>
  );
}
