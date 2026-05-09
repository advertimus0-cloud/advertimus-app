'use client'

import React from 'react';

interface HeaderProps {
  onMenuToggle: () => void;
  isSidebarOpen: boolean;
}

// Placeholder — full implementation coming in a later step
export function Header({ onMenuToggle, isSidebarOpen }: HeaderProps) {
  return (
    <header className="h-16 flex-shrink-0 flex items-center px-4 bg-background border-b border-accent1/30">
      {/* Hamburger button — mobile only */}
      <button
        className="md:hidden mr-4 text-white p-2 rounded-8 hover:bg-accent1/20 transition-colors duration-300"
        onClick={onMenuToggle}
        aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
        aria-expanded={isSidebarOpen}
      >
        <span className="text-xl">{isSidebarOpen ? '✕' : '☰'}</span>
      </button>

      {/* Brand */}
      <span className="text-white font-bold text-lg tracking-wide">Advertimus</span>
    </header>
  );
}
