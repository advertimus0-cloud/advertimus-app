'use client'

/**
 * Header — minimal top bar: sidebar toggle (left) + panel toggle (right).
 *
 * SECURITY (Rule 18):
 * - Pure display component — no API calls, no auth logic (§16).
 * - All callbacks are UI stubs; real mutations go through API routes (§16).
 */

import React from 'react'
import { Menu, X, PanelRight } from 'lucide-react'

export interface HeaderProps {
  onMenuToggle: () => void
  isSidebarOpen: boolean
  onPanelToggle?: () => void
  isPanelOpen?: boolean
}

export function Header({
  onMenuToggle,
  isSidebarOpen,
  onPanelToggle,
  isPanelOpen = false,
}: HeaderProps) {
  return (
    <header
      className="h-[52px] flex-shrink-0 flex items-center justify-between px-4"
      style={{ borderBottom: '1px solid rgba(93,26,27,0.15)' }}
      role="banner"
    >
      {/* ── LEFT: sidebar toggles ─────────────────────────────────────── */}
      <div className="flex items-center">
        {/* Mobile */}
        <button
          onClick={onMenuToggle}
          className="w-8 h-8 flex items-center justify-center rounded-lg
                     text-white/40 hover:text-white/75 hover:bg-white/[0.05]
                     transition-all duration-150 md:hidden"
          aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isSidebarOpen}
        >
          {isSidebarOpen ? <X size={16} /> : <Menu size={16} />}
        </button>

        {/* Desktop */}
        <button
          onClick={onMenuToggle}
          className="w-8 h-8 hidden md:flex items-center justify-center rounded-lg
                     text-white/35 hover:text-white/65 hover:bg-white/[0.05]
                     transition-all duration-150"
          aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          aria-expanded={isSidebarOpen}
        >
          <Menu size={16} />
        </button>
      </div>

      {/* ── RIGHT: panel toggle ───────────────────────────────────────── */}
      <button
        onClick={onPanelToggle}
        className={[
          'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium',
          'transition-all duration-150',
          isPanelOpen
            ? 'text-white'
            : 'text-white/50 hover:text-white/80 hover:bg-white/[0.05]',
        ].join(' ')}
        style={
          isPanelOpen
            ? {
                background: 'linear-gradient(135deg, rgba(93,26,27,0.38) 0%, rgba(22,17,66,0.38) 100%)',
                border: '1px solid rgba(93,26,27,0.48)',
              }
            : { border: '1px solid rgba(93,26,27,0.28)' }
        }
        aria-label={isPanelOpen ? 'Close results panel' : 'Open results panel'}
        aria-pressed={isPanelOpen}
      >
        <span className="inline-flex items-center justify-center rounded-md bg-red-500/10 text-red-600 shadow-[0_0_15px_rgba(220,38,38,0.15)] p-1">
          <PanelRight size={13} />
        </span>
        Panel
      </button>
    </header>
  )
}
