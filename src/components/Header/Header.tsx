'use client'

/**
 * Header — top bar of the Advertimus dashboard.
 *
 * Layout:
 *   LEFT:   [≡ menu] [● avatar] ["Project title" · subtitle]
 *   RIGHT:  [Export] [Share] [⊞ Panel]
 *
 * SECURITY (Rule 18):
 * - Pure display component — no API calls, no auth logic (§16).
 * - All text is rendered as plain React text nodes → XSS-safe (§7).
 * - Export / Share / Panel callbacks are UI stubs; real export/share must
 *   invoke authenticated backend endpoints (§16).
 * - onMenuToggle is passed from parent — no sensitive logic here.
 * - No secrets, tokens, or Supabase calls in this component.
 */

import React from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface HeaderProps {
  onMenuToggle: () => void
  isSidebarOpen: boolean
  /** Main title shown in the center-left — e.g. "New conversation" */
  projectTitle?: string
  /** Subtitle below title — e.g. "AI marketing assistant · ready to generate" */
  projectSubtitle?: string
  /** UI stub — wire to authenticated export endpoint in production (§16) */
  onExport?: () => void
  /** UI stub — wire to authenticated share flow in production (§16) */
  onShare?: () => void
  /** Toggles the results panel */
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
        {/* Mobile hamburger */}
        <button
          onClick={onMenuToggle}
          className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg
                     text-white/40 hover:text-white/75 hover:bg-white/[0.05]
                     transition-all duration-150 md:hidden"
          aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isSidebarOpen}
        >
          {isSidebarOpen ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>

        {/* Desktop hamburger / menu icon */}
        <button
          onClick={onMenuToggle}
          className="flex-shrink-0 w-7 h-7 hidden md:flex items-center justify-center
                     rounded-lg text-white/28 hover:text-white/55 hover:bg-white/[0.04]
                     transition-all duration-150"
          aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          aria-expanded={isSidebarOpen}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
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
        {/* Export — UI stub */}
        <button
          onClick={onExport}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                     text-xs font-medium text-white/55 hover:text-white/85
                     transition-all duration-150 hover:bg-white/[0.05]"
          style={{ border: '1px solid rgba(93,26,27,0.28)' }}
          aria-label="Export assets"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          Export
        </button>

        {/* Share — UI stub */}
        <button
          onClick={onShare}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                     text-xs font-medium text-white/55 hover:text-white/85
                     transition-all duration-150 hover:bg-white/[0.05]"
          style={{ border: '1px solid rgba(93,26,27,0.28)' }}
          aria-label="Share project"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
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
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <line x1="15" y1="3" x2="15" y2="21" />
          </svg>
          Panel
        </button>
      </div>
    </header>
  )
}
