'use client'

/**
 * Sidebar — left navigation panel for the Advertimus dashboard.
 *
 * Renders two layouts:
 *  isCollapsed=true  → 64px mini (icons + bot avatar only, no text)
 *  isCollapsed=false → 280px full (icons + labels + history + footer)
 *
 * SECURITY (Rule 18):
 * - Pure display component — no API calls, no auth logic (§16).
 * - All dynamic text nodes are React-escaped → XSS-safe (§7).
 * - All callbacks are UI stubs; mutations go through authenticated API routes (§16).
 */

import React from 'react'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import {
  Layers,
  ImageIcon,
  MessageSquare,
  History,
  Settings,
  Plus,
  ChevronLeft,
  ChevronRight,
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
  /** Desktop mini mode — renders 64px icon-only column */
  isCollapsed?: boolean
  /** Called by both mini and full toggle buttons */
  onToggle?: () => void
  /** Called on mobile after navigation to close the overlay */
  onMobileClose?: () => void
  onNavigate?: (item: NavItem) => void
  onSelectChat?: (id: string) => void
  onNewChat?: () => void
  onSettings?: () => void
}

// ─── Nav config ───────────────────────────────────────────────────────────────

const NAV_ITEMS: Array<{
  id: NavItem
  label: string
  icon: React.ReactNode
  href: string
  description: string
}> = [
  { id: 'projects', label: 'Projects',  icon: <Layers        size={15} />, href: '/projects', description: 'Manage ad campaigns'    },
  { id: 'assets',   label: 'Assets',    icon: <ImageIcon     size={15} />, href: '/assets',   description: 'Creative assets & uploads' },
  { id: 'chat',     label: 'Chat',      icon: <MessageSquare size={15} />, href: '/',         description: 'AI campaign builder'      },
  { id: 'history',  label: 'History',   icon: <History       size={15} />, href: '/history',  description: 'Past conversations'       },
]

// ─── Bot avatar (shared between mini + full) ──────────────────────────────────
// mix-blend-mode: multiply on a dark-red container makes the white JPG
// background blend into the container colour, showing only the icon content.

function BotAvatar({ size = 40 }: { size?: number }) {
  return (
    <div
      className="rounded-full overflow-hidden flex-shrink-0"
      style={{ width: size, height: size }}
    >
      <Image
        src="/advernewicon.jpg"
        alt="Advertimus"
        width={size}
        height={size}
        quality={100}
        className="w-full h-full object-cover scale-[1.08]"
        priority
      />
    </div>
  )
}

// ─── Icon badge ───────────────────────────────────────────────────────────────

function IconBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center justify-center rounded-md bg-red-500/10 text-red-600 shadow-[0_0_15px_rgba(220,38,38,0.15)] p-1 flex-shrink-0">
      {children}
    </span>
  )
}

// ─── Chat group (full sidebar only) ──────────────────────────────────────────

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
                'w-full text-left py-2.5 rounded-xl transition-all duration-150 group',
                isActive ? '' : 'hover:bg-white/[0.03]',
              ].join(' ')}
              style={
                isActive
                  ? {
                      background: 'linear-gradient(90deg, rgba(93,26,27,0.3) 0%, transparent 100%)',
                      borderLeft: '2px solid rgba(93,26,27,0.8)',
                      paddingLeft: '10px',
                      paddingRight: '12px',
                    }
                  : { borderLeft: '2px solid transparent', paddingLeft: '10px', paddingRight: '12px' }
              }
              aria-current={isActive ? 'true' : undefined}
            >
              <p className={['text-xs font-medium truncate leading-snug',
                isActive ? 'text-white' : 'text-white/55 group-hover:text-white/80'].join(' ')}>
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
  chatHistory = [],
  activeChatId = null,
  activeNav = 'chat',
  user = { name: 'Loading…', initials: '?' },
  tokenUsed = 0,
  tokenMax = 0,
  tokenRemaining = 0,
  isCollapsed = false,
  onToggle,
  onMobileClose,
  onNavigate,
  onSelectChat,
  onNewChat,
  onSettings,
}: SidebarProps) {
  const router   = useRouter()
  const pathname = usePathname()

  function handleNav(item: typeof NAV_ITEMS[0]) {
    onNavigate?.(item.id)
    router.push(item.href)
    onMobileClose?.()
  }

  const BORDER = '1px solid rgba(93,26,27,0.14)'

  // ── MINI SIDEBAR (64px, icon-only) ────────────────────────────────────────
  if (isCollapsed) {
    return (
      // Clicking anywhere on the mini sidebar expands it
      <div
        className="h-full flex flex-col items-center py-3 gap-1 cursor-pointer"
        style={{ width: 64, borderRight: BORDER, background: '#252525' }}
        onClick={onToggle}
        role="button"
        aria-label="Expand sidebar"
      >
        {/* Expand toggle — stopPropagation so it doesn't double-fire onToggle */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggle?.(); }}
          className="w-10 h-10 flex items-center justify-center rounded-xl mb-1
                     text-white/35 hover:text-white/72 hover:bg-white/[0.06]
                     transition-all duration-150"
          aria-label="Expand sidebar"
        >
          <ChevronRight size={16} />
        </button>

        {/* Bot avatar */}
        <div className="mb-2">
          <BotAvatar size={40} />
        </div>

        {/* Divider */}
        <div className="w-8 h-px my-1" style={{ background: 'rgba(93,26,27,0.2)' }} />

        {/* Nav icons */}
        <nav className="flex flex-col items-center gap-1 w-full px-2" aria-label="Main navigation">
          {NAV_ITEMS.map(item => {
            const isActive = activeNav === item.id || pathname === item.href
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item)}
                title={`${item.label} — ${item.description}`}
                className="w-full h-10 flex items-center justify-center rounded-xl
                           transition-all duration-150"
                style={
                  isActive
                    ? {
                        background: 'rgba(93,26,27,0.28)',
                        border: '1px solid rgba(93,26,27,0.5)',
                      }
                    : { border: '1px solid transparent' }
                }
                aria-current={isActive ? 'page' : undefined}
              >
                <IconBadge>{item.icon}</IconBadge>
              </button>
            )
          })}
        </nav>

        <div className="flex-1" />

        {/* User initials */}
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center
                     text-white text-[11px] font-bold select-none mb-1"
          style={{ background: '#5d1a1b' }}
          aria-hidden="true"
        >
          {user.initials}
        </div>
      </div>
    )
  }

  // ── FULL SIDEBAR (280px) ──────────────────────────────────────────────────
  const todayChats     = chatHistory.filter(c => c.group === 'today')
  const yesterdayChats = chatHistory.filter(c => c.group === 'yesterday')
  const earlierChats   = chatHistory.filter(c => c.group === 'earlier')

  const tokenPct = tokenMax > 0 ? Math.min(100, (tokenUsed / tokenMax) * 100) : 0
  const barColor =
    tokenPct > 75 ? 'linear-gradient(90deg, #ef4444, #dc2626)'
    : tokenPct > 45 ? 'linear-gradient(90deg, #eab308, #ca8a04)'
    : 'linear-gradient(90deg, #22c55e, #16a34a)'

  return (
    // Clicking empty background area in full sidebar collapses it
    <aside
      className="h-full w-full flex flex-col overflow-hidden"
      style={{ borderRight: BORDER, background: '#252525' }}
      aria-label="Sidebar navigation"
      onClick={onToggle}
    >
      {/* ── Logo row — clicking logo row also collapses ─────────────────── */}
      <div className="flex-shrink-0 flex items-center gap-3 px-4 py-4 cursor-pointer select-none">
        <BotAvatar size={38} />
        <Image
          src="/advertimus-logo.PNG"
          alt="Advertimus"
          width={130}
          height={30}
          quality={100}
          className="object-contain select-none flex-1 min-w-0"
          priority
        />
        <div className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-lg
                     text-white/28 hover:text-white/60 hover:bg-white/[0.05]
                     transition-all duration-150">
          <ChevronLeft size={15} />
        </div>
      </div>

      {/* ── Primary nav ──────────────────────────────────────────────────── */}
      <nav
        className="flex-shrink-0 px-3 pb-3 space-y-0.5"
        aria-label="Main navigation"
      >
        {NAV_ITEMS.map(item => {
          const isActive = activeNav === item.id || pathname === item.href
          return (
            <button
              key={item.id}
              onClick={() => handleNav(item)}
              title={item.description}
              className={[
                'w-full flex items-center gap-3 py-2.5 rounded-xl text-sm font-medium',
                'transition-all duration-200 text-left',
                isActive ? 'text-white' : 'text-white/40 hover:text-white/80 hover:bg-white/[0.04]',
              ].join(' ')}
              style={
                isActive
                  ? {
                      background: 'rgba(93,26,27,0.22)',
                      borderLeft: '2px solid rgba(93,26,27,0.85)',
                      paddingLeft: '10px',
                      paddingRight: '12px',
                    }
                  : { borderLeft: '2px solid transparent', paddingLeft: '10px', paddingRight: '12px' }
              }
              aria-current={isActive ? 'page' : undefined}
            >
              <IconBadge>{item.icon}</IconBadge>
              <span>{item.label}</span>
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
                     font-medium text-white/26 hover:text-white/55 hover:bg-white/[0.025]
                     transition-all duration-150"
          style={{ border: '1px dashed rgba(93,26,27,0.22)' }}
        >
          <IconBadge><Plus size={11} /></IconBadge>
          New conversation
        </button>
      </div>

      {/* Divider */}
      <div className="mx-4 h-px flex-shrink-0" style={{ background: 'rgba(93,26,27,0.12)' }} />

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 px-3 pt-3 pb-4 space-y-3">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
                       text-white text-[11px] font-bold select-none"
            style={{ background: '#5d1a1b' }}
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
            <IconBadge><Settings size={13} /></IconBadge>
          </button>
        </div>

        {/* Token meter */}
        <div
          className="rounded-xl px-3 py-2.5"
          style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(93,26,27,0.14)' }}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[9px] font-bold uppercase tracking-[0.13em] text-white/28">Token usage</span>
            <span className="text-[10px] font-bold text-white/42 tabular-nums">{tokenUsed}/{tokenMax}</span>
          </div>
          <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
            <div className="h-full rounded-full transition-all duration-500"
              style={{ width: `${tokenPct}%`, background: barColor }} />
          </div>
          <p className="text-[9px] text-white/20 mt-1.5">
            {tokenRemaining.toLocaleString()} tokens remaining this month
          </p>
        </div>
      </div>
    </aside>
  )
}
