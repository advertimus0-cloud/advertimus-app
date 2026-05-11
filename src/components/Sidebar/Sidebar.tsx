'use client'

/**
 * Sidebar — left navigation panel for the Advertimus dashboard.
 *
 * SECURITY (Rule 18):
 * - Pure display component — no API calls, no auth logic (§16).
 * - All user data scoped to the authenticated workspace before reaching this
 *   component — callers enforce §3 and §4.
 * - React escapes all dynamic text nodes → XSS-safe by default (§7).
 * - All callbacks are UI stubs; mutations go through authenticated API routes (§16).
 */

import React from 'react'
import {
  BookOpen,
  LayoutGrid,
  MessageSquare,
  Clock,
  Settings,
  Plus,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SidebarChat {
  id: string
  title: string
  subtitle?: string
  group: 'today' | 'yesterday' | 'earlier'
}

export interface SidebarUser {
  name: string
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

// ─── Nav config ───────────────────────────────────────────────────────────────

const NAV_ITEMS: Array<{ id: NavItem; label: string; icon: React.ReactNode }> = [
  { id: 'projects', label: 'Projects',  icon: <BookOpen      size={15} /> },
  { id: 'assets',   label: 'Assets',    icon: <LayoutGrid    size={15} /> },
  { id: 'chat',     label: 'Chat',      icon: <MessageSquare size={15} /> },
  { id: 'history',  label: 'History',   icon: <Clock         size={15} /> },
]

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
  chatHistory = [] as SidebarChat[],
  activeChatId = null,
  activeNav = 'chat',
  user = { name: 'Loading…', initials: '?' } as SidebarUser,
  tokenUsed = 0,
  tokenMax = 0,
  tokenRemaining = 0,
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
        {NAV_ITEMS.map(({ id, label, icon }) => {
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
              <span className="flex-shrink-0 inline-flex items-center justify-center rounded-md bg-red-500/10 text-red-600 shadow-[0_0_15px_rgba(220,38,38,0.15)] p-1">
                {icon}
              </span>
              {label}
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
          <span className="inline-flex items-center justify-center rounded-md bg-red-500/10 text-red-600 shadow-[0_0_15px_rgba(220,38,38,0.15)] p-0.5">
            <Plus size={11} />
          </span>
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
            <span className="inline-flex items-center justify-center rounded-md bg-red-500/10 text-red-600 shadow-[0_0_15px_rgba(220,38,38,0.15)] p-0.5">
              <Settings size={13} />
            </span>
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
