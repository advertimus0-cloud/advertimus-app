'use client'

/**
 * Sidebar — left navigation panel for the Advertimus dashboard.
 *
 * Layout (top → bottom):
 *   [Logo mark + wordmark]
 *   [Nav: Projects | Assets | Chat | History]
 *   ─────────────────────────────────────────
 *   [Scrollable chat history: TODAY / YESTERDAY / EARLIER]
 *   ─────────────────────────────────────────
 *   [User avatar + name + settings icon]
 *   [Token usage meter]
 *
 * SECURITY (Rule 18):
 * - Pure display component — no API calls, no auth logic (§16).
 * - All user data scoped to the authenticated workspace before reaching this
 *   component — callers enforce §3 and §4.
 * - React escapes all dynamic text nodes → XSS-safe by default (§7).
 * - All callbacks (onSelectChat, onNewChat, onSettings) are UI stubs; mutations
 *   go through authenticated API routes, not here (§16).
 */

import React from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SidebarChat {
  id: string
  title: string
  /** e.g. "5 videos generated", "Just started" */
  subtitle?: string
  group: 'today' | 'yesterday' | 'earlier'
}

export interface SidebarUser {
  name: string
  /** 2-character initials shown in the avatar circle */
  initials: string
}

export type NavItem = 'projects' | 'assets' | 'chat' | 'history'

export interface SidebarProps {
  chatHistory?: SidebarChat[]
  activeChatId?: string | null
  activeNav?: NavItem
  user?: SidebarUser
  tokenUsed?: number
  tokenMax?: number
  tokenRemaining?: number
  onNavigate?: (item: NavItem) => void
  onSelectChat?: (id: string) => void
  onNewChat?: () => void
  onSettings?: () => void
}

// ─── Demo data ────────────────────────────────────────────────────────────────

const DEFAULT_CHATS: SidebarChat[] = [
  { id: 'c1', title: 'New conversation',   subtitle: 'Just started',          group: 'today'     },
  { id: 'c2', title: 'Leather wallet ads', subtitle: '5 videos generated',    group: 'yesterday' },
  { id: 'c3', title: 'Seasonal posts design', subtitle: '3 designs · 2 copy sets', group: 'yesterday' },
  { id: 'c4', title: 'Product photography', subtitle: 'Mar 10 · 4 images',   group: 'earlier'   },
  { id: 'c5', title: 'Summer campaign',    subtitle: 'Mar 7 · 6 assets',      group: 'earlier'   },
]

const DEFAULT_USER: SidebarUser = { name: 'Sarah K.', initials: 'SK' }

// ─── Icons ────────────────────────────────────────────────────────────────────

const NAV_ICONS: Record<NavItem, React.ReactNode> = {
  projects: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  ),
  assets: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  ),
  chat: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  history: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
}

const NAV_LABELS: Record<NavItem, string> = {
  projects: 'Projects',
  assets: 'Assets',
  chat: 'Chat',
  history: 'History',
}

// ─── Chat group ───────────────────────────────────────────────────────────────

function ChatGroup({
  label,
  chats,
  activeChatId,
  onSelect,
}: {
  label: string
  chats: SidebarChat[]
  activeChatId?: string | null
  onSelect?: (id: string) => void
}) {
  if (chats.length === 0) return null

  return (
    <div>
      <p className="px-1 mb-1.5 text-[9px] font-bold tracking-[0.14em] uppercase"
        style={{ color: 'rgba(255,255,255,0.18)' }}>
        {label}
      </p>
      <div className="space-y-0.5">
        {chats.map(chat => {
          const isActive = chat.id === activeChatId
          return (
            <button
              key={chat.id}
              onClick={() => onSelect?.(chat.id)}
              className={[
                'w-full text-left px-3 py-2.5 rounded-xl transition-all duration-150 group',
                isActive ? '' : 'hover:bg-white/[0.03]',
              ].join(' ')}
              style={
                isActive
                  ? {
                      background: 'rgba(93,26,27,0.22)',
                      border: '1px solid rgba(93,26,27,0.38)',
                    }
                  : { border: '1px solid transparent' }
              }
              aria-current={isActive ? 'true' : undefined}
            >
              <p className={[
                'text-xs font-medium truncate leading-snug',
                isActive ? 'text-white' : 'text-white/55 group-hover:text-white/80',
              ].join(' ')}>
                {chat.title}
              </p>
              {chat.subtitle && (
                <p className="text-[10px] text-white/26 mt-0.5 truncate leading-tight">
                  {chat.subtitle}
                </p>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

export function Sidebar({
  chatHistory = DEFAULT_CHATS,
  activeChatId = 'c1',
  activeNav = 'chat',
  user = DEFAULT_USER,
  tokenUsed = 200,
  tokenMax = 400,
  tokenRemaining = 320,
  onNavigate,
  onSelectChat,
  onNewChat,
  onSettings,
}: SidebarProps) {
  const todayChats     = chatHistory.filter(c => c.group === 'today')
  const yesterdayChats = chatHistory.filter(c => c.group === 'yesterday')
  const earlierChats   = chatHistory.filter(c => c.group === 'earlier')

  const tokenPct = tokenMax > 0 ? Math.min(100, (tokenUsed / tokenMax) * 100) : 0
  const barColor =
    tokenPct > 75
      ? 'linear-gradient(90deg, #ef4444, #dc2626)'
      : tokenPct > 45
      ? 'linear-gradient(90deg, #eab308, #ca8a04)'
      : 'linear-gradient(90deg, #22c55e, #16a34a)'

  return (
    <aside
      className="h-full w-full flex flex-col bg-background overflow-hidden"
      style={{ borderRight: '1px solid rgba(93,26,27,0.14)' }}
      aria-label="Sidebar navigation"
    >
      {/* ── Logo ─────────────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 flex items-center gap-3 px-5 py-5">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 select-none"
          style={{
            background: 'linear-gradient(135deg, #5d1a1b 0%, #161142 100%)',
            boxShadow: '0 0 16px rgba(93,26,27,0.55)',
          }}
          aria-hidden="true"
        >
          <span className="text-white text-xs font-black">A</span>
        </div>
        <span
          className="font-bold text-sm tracking-[0.18em] uppercase select-none"
          style={{
            background: 'linear-gradient(135deg, #5d1a1b 0%, #161142 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
          aria-label="Advertimus"
        >
          Advertimus
        </span>
      </div>

      {/* ── Primary nav ──────────────────────────────────────────────────── */}
      <nav className="flex-shrink-0 px-3 pb-3 space-y-0.5" aria-label="Main navigation">
        {(['projects', 'assets', 'chat', 'history'] as NavItem[]).map(id => {
          const isActive = activeNav === id
          return (
            <button
              key={id}
              onClick={() => onNavigate?.(id)}
              className={[
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium',
                'transition-all duration-150 text-left',
                isActive
                  ? 'text-white'
                  : 'text-white/40 hover:text-white/72 hover:bg-white/[0.03]',
              ].join(' ')}
              style={
                isActive
                  ? {
                      background:
                        'linear-gradient(135deg, rgba(93,26,27,0.36) 0%, rgba(22,17,66,0.36) 100%)',
                      border: '1px solid rgba(93,26,27,0.42)',
                    }
                  : { border: '1px solid transparent' }
              }
              aria-current={isActive ? 'page' : undefined}
            >
              <span className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-white/28'}`}>
                {NAV_ICONS[id]}
              </span>
              {NAV_LABELS[id]}
            </button>
          )
        })}
      </nav>

      {/* Divider */}
      <div className="mx-4 h-px flex-shrink-0" style={{ background: 'rgba(93,26,27,0.12)' }} />

      {/* ── Chat history ─────────────────────────────────────────────────── */}
      <div
        className="flex-1 overflow-y-auto px-3 py-3 space-y-4 min-h-0"
        style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(93,26,27,0.18) transparent' }}
      >
        <ChatGroup label="Today"     chats={todayChats}     activeChatId={activeChatId} onSelect={onSelectChat} />
        <ChatGroup label="Yesterday" chats={yesterdayChats} activeChatId={activeChatId} onSelect={onSelectChat} />
        <ChatGroup label="Earlier"   chats={earlierChats}   activeChatId={activeChatId} onSelect={onSelectChat} />

        <button
          onClick={onNewChat}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[11px]
                     font-medium text-white/26 hover:text-white/48 hover:bg-white/[0.025]
                     transition-all duration-150"
          style={{ border: '1px dashed rgba(93,26,27,0.2)' }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New conversation
        </button>
      </div>

      {/* Divider */}
      <div className="mx-4 h-px flex-shrink-0" style={{ background: 'rgba(93,26,27,0.12)' }} />

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 px-3 pt-3 pb-4 space-y-3">
        {/* User row */}
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                       text-white text-[11px] font-bold select-none"
            style={{ background: 'linear-gradient(135deg, #5d1a1b 0%, #161142 100%)' }}
            aria-hidden="true"
          >
            {user.initials}
          </div>
          <span className="flex-1 text-sm font-medium text-white/60 truncate min-w-0">
            {user.name}
          </span>
          <button
            onClick={onSettings}
            className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center
                       text-white/20 hover:text-white/50 hover:bg-white/[0.05]
                       transition-all duration-150"
            aria-label="Settings"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
        </div>

        {/* Token meter */}
        <div
          className="rounded-xl px-3 py-2.5"
          style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(93,26,27,0.14)',
          }}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[9px] font-bold uppercase tracking-[0.13em] text-white/28">
              Token usage
            </span>
            <span className="text-[10px] font-bold text-white/42 tabular-nums">
              {tokenUsed}/{tokenMax}
            </span>
          </div>
          <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${tokenPct}%`, background: barColor }}
            />
          </div>
          <p className="text-[9px] text-white/20 mt-1.5">
            {tokenRemaining.toLocaleString()} tokens remaining this month
          </p>
        </div>
      </div>
    </aside>
  )
}
