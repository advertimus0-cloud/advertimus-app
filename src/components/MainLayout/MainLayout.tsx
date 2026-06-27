'use client'

import React, { useState, useEffect } from 'react';
import { Header } from '../Header/Header';
import { Sidebar } from '../Sidebar/Sidebar';
import { ChatArea } from '../ChatArea/ChatArea';
import { ResultsPanel } from '../ResultsPanel/ResultsPanel';

/**
 * MainLayout — 3-column application shell.
 *
 * Sidebar behaviour:
 *  Desktop (md+) : starts open; toggle collapses width 280px → 0 (300ms)
 *  Mobile (<md)  : starts closed; toggle slides in as fixed overlay (300ms)
 *
 * SECURITY (Rule 18): pure layout — no API calls, no auth logic (§16).
 */

interface MainLayoutProps {
  showResults?: boolean;
  isGenerating?: boolean;
}

export function MainLayout({ showResults = false, isGenerating = false }: MainLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Close sidebar by default on mobile after hydration
  useEffect(() => {
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="flex flex-col h-screen text-white overflow-hidden bg-background">

      <Header onMenuToggle={toggleSidebar} isSidebarOpen={isSidebarOpen} />

      <div className="flex flex-1 overflow-hidden relative">

        {/* Mobile overlay backdrop */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-20 md:hidden"
            onClick={closeSidebar}
            aria-hidden="true"
          />
        )}

        {/*
          SIDEBAR
          ─────────────────────────────────────────────────────────────────
          Mobile  : fixed + translate (-100% ↔ 0)  — always w-[280px]
          Desktop : in-flow + width collapse (0 ↔ 280px) via md: override
          transition-all covers both transform and width transitions
        */}
        <aside
          className={[
            // Positioning
            'fixed md:relative top-0 left-0 h-full md:top-auto md:h-auto',
            // Stacking & clipping
            'overflow-hidden z-30 md:z-auto flex-shrink-0',
            // Smooth animation (width + transform)
            'transition-all duration-300 ease-in-out',
            // Open state: visible everywhere
            // Closed state: mobile → slide out  |  desktop → collapse width
            isSidebarOpen
              ? 'w-[280px] translate-x-0'
              : 'w-[280px] -translate-x-full md:translate-x-0 md:w-0',
          ].join(' ')}
          style={{ borderRight: '1px solid rgba(93,26,27,0.14)' }}
          aria-label="Sidebar navigation"
          aria-hidden={!isSidebarOpen}
        >
          {/* Inner div: stays 280px during desktop width collapse (parent clips) */}
          <div className="w-[280px] h-full bg-background">
            <Sidebar />
          </div>
        </aside>

        {/* Chat Area */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <ChatArea />
        </main>

        {/* Results Panel */}
        {showResults && (
          <aside
            className={[
              'fixed bottom-0 left-0 right-0 h-[50vh]',
              'md:relative md:bottom-auto md:left-auto md:right-auto md:h-auto',
              'md:w-[400px] flex-shrink-0 bg-background z-10 md:z-auto',
              'transition-all duration-300 ease-in-out',
            ].join(' ')}
            aria-label="Results panel"
          >
            <ResultsPanel showResults={showResults} isGenerating={isGenerating} />
          </aside>
        )}

      </div>
    </div>
  );
}
