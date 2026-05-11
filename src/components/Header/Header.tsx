'use client'

/**
 * Header — top bar of the Advertimus dashboard.
 *
 * SECURITY (Rule 18):
 * - Pure display component — no API calls, no auth logic (§16).
 * - All text is rendered as plain React text nodes → XSS-safe (§7).
 * - Export / Share / Panel callbacks are UI stubs; real implementations must
 *   invoke authenticated backend endpoints (§16).
 */

import React from 'react'
import { Menu, X, Upload, Share2, PanelRight } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface HeaderProps {
  onMenuToggle: () => void
  isSidebarOpen: boolean
  projectTitle?: string
  projectSubtitle?: string
  onExport?: () => void
  onShare?: () => void
  onPanelToggle?: () => void
  isPanelOpen?: boolean
}

// ─── Header ───────────────────────────────────────────────────────────────────

export function Header({
  onMenuToggle,
  isSidebarOpen,
  projectTitle = 'New conversation',
  projectSubtitle = 'AI marketing assistant · ready to generate',
  onExport,
  onShare,
  onPanelToggle,
  isPanelOpen = false,
}: HeaderProps) {
  return (
    <header
      className="h-[56px] flex-shrink-0 flex items-center justify-between px-4 gap-4"
      style={{ borderBottom: '1px solid rgba(93,26,27,0.15)' }}
      role="banner"
    >
      {/* ── LEFT: menu + project identity ─────────────────────────────── */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile menu toggle */}
        <button
          onClick={onMenuToggle}
          className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg
                     text-white/40 hover:text-white/75 hover:bg-white/[0.05]
                     transition-all duration-150 md:hidden"
          aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isSidebarOpen}
        >
          {isSidebarOpen ? <X size={16} /> : <Menu size={16} />}
        </button>

        {/* Desktop sidebar toggle */}
        <button
          onClick={onMenuToggle}
          className="flex-shrink-0 w-7 h-7 hidden md:flex items-center justify-center
                     rounded-lg text-white/28 hover:text-white/55 hover:bg-white/[0.04]
                     transition-all duration-150"
          aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          aria-expanded={isSidebarOpen}
        >
          <Menu size={14} />
        </button>

        {/* Project avatar */}
        <div
          className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center
                     text-white text-[10px] font-bold select-none"
          style={{ background: 'linear-gradient(135deg, #5d1a1b 0%, #161142 100%)' }}
          aria-hidden="true"
        >
          {projectTitle.trim().charAt(0).toUpperCase()}
        </div>

        {/* Project title + subtitle */}
        <div className="min-w-0">
          <p className="text-white text-sm font-semibold truncate leading-tight">
            {projectTitle}
          </p>
          <p className="text-white/32 text-[10px] truncate leading-tight hidden sm:block">
            {projectSubtitle}
          </p>
        </div>
      </div>

      {/* ── RIGHT: action buttons ─────────────────────────────────────── */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Export */}
        <button
          onClick={onExport}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                     text-xs font-medium text-white/55 hover:text-white/85
                     transition-all duration-150 hover:bg-white/[0.05]"
          style={{ border: '1px solid rgba(93,26,27,0.28)' }}
          aria-label="Export assets"
        >
          <Upload size={12} />
          Export
        </button>

        {/* Share */}
        <button
          onClick={onShare}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                     text-xs font-medium text-white/55 hover:text-white/85
                     transition-all duration-150 hover:bg-white/[0.05]"
          style={{ border: '1px solid rgba(93,26,27,0.28)' }}
          aria-label="Share project"
        >
          <Share2 size={12} />
          Share
        </button>

        {/* Panel toggle */}
        <button
          onClick={onPanelToggle}
          className={[
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium',
            'transition-all duration-150',
            isPanelOpen
              ? 'text-white'
              : 'text-white/55 hover:text-white/85 hover:bg-white/[0.05]',
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
          <PanelRight size={13} />
          Panel
        </button>
      </div>
    </header>
  )
}
