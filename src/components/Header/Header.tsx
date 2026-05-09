'use client'

import React, { useState, useRef, useEffect } from 'react';

/**
 * Dashboard Header — design tokens from ADVERTIMUS_TECHNICAL_PLAN_V2.md
 *
 * Layout:  [Logo] ─────── [Page Title] ─────── [🔔] [Avatar ▾]
 * Height:  70px
 * BG:      #000000  (bg-background)
 * Border:  1px bottom, accent1/20
 *
 * SECURITY (Rule 18):
 * - No secrets, no API calls — pure UI
 * - User data comes from props; React escapes all text → XSS-safe
 * - Logout is a no-op placeholder; real impl must invalidate the server-side
 *   Supabase session via a secure API route, never from client-side only
 * - Dropdown closes on outside click to prevent stale open state
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export interface HeaderUser {
  name: string;
  email?: string;
}

export interface HeaderProps {
  /** Controls mobile sidebar visibility */
  onMenuToggle: () => void;
  isSidebarOpen: boolean;
  /** Context label shown in the center (e.g. "My Projects") */
  pageTitle?: string;
  /** Authenticated user — pass null when not yet loaded */
  user?: HeaderUser | null;
  /** Called when user clicks a dropdown action */
  onProfileAction?: (action: DropdownAction) => void;
}

export type DropdownAction = 'profile' | 'settings' | 'billing' | 'logout';

// ─── Constants ────────────────────────────────────────────────────────────────

interface DropdownItem {
  label: string;
  action: DropdownAction;
  icon: React.ReactNode;
  danger?: boolean;
}

const DROPDOWN_ITEMS: DropdownItem[] = [
  {
    label: 'Profile',
    action: 'profile',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    label: 'Settings',
    action: 'settings',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>
    ),
  },
  {
    label: 'Billing',
    action: 'billing',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    ),
  },
  {
    label: 'Logout',
    action: 'logout',
    danger: true,
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <polyline points="16 17 21 12 16 7" />
        <line x1="21" y1="12" x2="9" y2="12" />
      </svg>
    ),
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function Header({
  onMenuToggle,
  isSidebarOpen,
  pageTitle = 'My Projects',
  user = null,
  onProfileAction,
}: HeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!isDropdownOpen) return;

    function handleOutsideClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isDropdownOpen]);

  // Close dropdown on Escape
  useEffect(() => {
    if (!isDropdownOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsDropdownOpen(false);
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isDropdownOpen]);

  const displayName = user?.name ?? 'User';
  const avatarLetter = displayName.trim().charAt(0).toUpperCase();

  function handleDropdownAction(action: DropdownAction) {
    setIsDropdownOpen(false);
    onProfileAction?.(action);
  }

  return (
    <header
      className="h-[70px] flex-shrink-0 flex items-center justify-between px-6 bg-background border-b border-accent1/20 relative z-10"
      role="banner"
    >

      {/* ── LEFT: Logo + mobile hamburger ────────────────────────────────── */}
      <div className="flex items-center gap-4">

        {/* Hamburger — mobile only */}
        <button
          className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg text-white/60 hover:text-white hover:bg-accent1/10 transition-all duration-200"
          onClick={onMenuToggle}
          aria-label={isSidebarOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={isSidebarOpen}
        >
          {isSidebarOpen ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>

        {/* Logo — gradient text: pink → purple per design spec */}
        <span
          className="font-bold text-base tracking-[0.2em] uppercase select-none"
          style={{
            background: 'linear-gradient(135deg, #EC4899 0%, #A855F7 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
          aria-label="Advertimus"
        >
          Advertimus
        </span>
      </div>

      {/* ── CENTER: Page title ────────────────────────────────────────────── */}
      <div className="absolute left-1/2 -translate-x-1/2 pointer-events-none hidden sm:block">
        <p className="text-white/50 text-sm font-medium tracking-wide whitespace-nowrap">
          {pageTitle}
        </p>
      </div>

      {/* ── RIGHT: Notifications + Profile dropdown ───────────────────────── */}
      <div className="flex items-center gap-2">

        {/* Notification bell */}
        <button
          className="relative flex items-center justify-center w-9 h-9 rounded-lg text-white/40 hover:text-white/80 hover:bg-accent1/10 transition-all duration-200"
          aria-label="Notifications"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          {/* Unread dot */}
          <span
            className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full"
            style={{ background: '#EC4899' }}
            aria-hidden="true"
          />
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-accent1/20 mx-1" aria-hidden="true" />

        {/* ── Profile dropdown ──────────────────────────────────────────── */}
        <div className="relative" ref={dropdownRef}>
          <button
            className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg hover:bg-accent1/10 transition-all duration-200 group"
            onClick={() => setIsDropdownOpen(prev => !prev)}
            aria-label="Open user menu"
            aria-expanded={isDropdownOpen}
            aria-haspopup="menu"
          >
            {/* Avatar circle — gradient maroon → purple */}
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white font-semibold text-sm"
              style={{ background: 'linear-gradient(135deg, #5d1a1b 0%, #161142 100%)' }}
              aria-hidden="true"
            >
              {avatarLetter}
            </div>

            {/* Username */}
            <span className="hidden md:block text-white/70 text-sm font-medium group-hover:text-white/90 transition-colors duration-200 max-w-[120px] truncate">
              {displayName}
            </span>

            {/* Chevron */}
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              className={`hidden md:block text-white/30 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
              aria-hidden="true"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {/* ── Dropdown panel ─────────────────────────────────────────── */}
          {isDropdownOpen && (
            <div
              className="absolute right-0 top-[calc(100%+6px)] w-52 bg-accent2 border border-accent1/30 rounded-lg shadow-2xl overflow-hidden"
              role="menu"
              aria-label="User menu"
            >
              {/* User info */}
              <div className="px-4 py-3 border-b border-accent1/20">
                <p className="text-white text-sm font-semibold truncate">{displayName}</p>
                {user?.email && (
                  <p className="text-text-secondary text-xs truncate mt-0.5">{user.email}</p>
                )}
              </div>

              {/* Menu items */}
              <nav className="py-1.5" role="none">
                {DROPDOWN_ITEMS.map(item => (
                  <button
                    key={item.action}
                    role="menuitem"
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-150 ${
                      item.danger
                        ? 'text-red-400 hover:bg-red-500/10 hover:text-red-300'
                        : 'text-text-secondary hover:bg-accent1/20 hover:text-white'
                    }`}
                    onClick={() => handleDropdownAction(item.action)}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
