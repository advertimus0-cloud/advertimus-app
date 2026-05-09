'use client'

/**
 * Sidebar component — dashboard left panel
 *
 * Design tokens: bg-background (#000000), accent1 (#5d1a1b), accent2 (#161142)
 * Source of truth: ADVERTIMUS_TECHNICAL_PLAN_V2.md, ADVERTIMUS_CHAT_UI_IMPLEMENTATION_GUIDE.md
 *
 * SECURITY (Rule 18):
 * - Pure display component — no API calls, no auth logic (Rule 16)
 * - All data flows in via props; callers are responsible for scoping data to the
 *   authenticated user's workspace before passing it here (Rules 3 & 4)
 * - React escapes all dynamic string values → XSS-safe by default
 * - onUpgrade / onNewProject / onSelectProject are no-op callbacks —
 *   actual mutations must go through authenticated API routes, not here
 * - "Upgrade" CTA is UI-only; credit enforcement is backend-only (Rule 16)
 */

import React, { useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SidebarProject {
  id: string;
  name: string;
}

export interface SidebarChat {
  id: string;
  title: string;
  time: string;
  group: 'today' | 'yesterday' | 'earlier';
}

export type NavSection = 'projects' | 'assets' | 'settings' | 'account' | 'history' | 'support';

export interface SidebarProps {
  projects?: SidebarProject[];
  activeProjectId?: string | null;
  chatHistory?: SidebarChat[];
  activeChatId?: string | null;
  /** Credits remaining (not used) */
  creditsRemaining?: number;
  creditsTotal?: number;
  activeSection?: NavSection;
  onNewProject?: () => void;
  onSelectProject?: (id: string) => void;
  onSelectChat?: (id: string) => void;
  onNavigate?: (section: NavSection) => void;
  onUpgrade?: () => void;
}

// ─── Default placeholder data ─────────────────────────────────────────────────
// Used only during UI development. Replace with real data from context/API.

const DEFAULT_PROJECTS: SidebarProject[] = [
  { id: 'p1', name: 'Project 1' },
  { id: 'p2', name: 'Project 2' },
];

const DEFAULT_CHATS: SidebarChat[] = [
  { id: 'c1', title: 'New conversation', time: '2:30 PM', group: 'today' },
  { id: 'c2', title: 'New conversation', time: '11:15 AM', group: 'today' },
  { id: 'c3', title: 'New conversation', time: '4:50 PM', group: 'yesterday' },
  { id: 'c4', title: 'New conversation', time: '9:20 AM', group: 'earlier' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-3 mb-1 text-[10px] font-bold tracking-widest uppercase"
      style={{ color: 'rgba(93,26,27,0.7)' }}>
      {children}
    </p>
  );
}

function NavItem({
  icon,
  label,
  active,
  onClick,
  right,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
  right?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium',
        'transition-all duration-150 text-left group relative',
        active
          ? 'text-white'
          : 'text-white/50 hover:text-white/80 hover:bg-white/[0.04]',
      ].join(' ')}
      style={active ? {
        background: 'linear-gradient(135deg, rgba(93,26,27,0.35) 0%, rgba(22,17,66,0.35) 100%)',
        borderLeft: '2px solid #5d1a1b',
        paddingLeft: '10px',
      } : {}}
    >
      <span className={`flex-shrink-0 transition-colors duration-150 ${active ? 'text-white' : 'text-white/35 group-hover:text-white/60'}`}>
        {icon}
      </span>
      <span className="flex-1 truncate">{label}</span>
      {right && <span className="flex-shrink-0 ml-auto">{right}</span>}
    </button>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="12" height="12" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
      className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function Divider() {
  return <div className="my-3 h-px" style={{ background: 'rgba(93,26,27,0.15)' }} />;
}

// ─── Credit Meter ─────────────────────────────────────────────────────────────

function CreditMeter({
  remaining,
  total,
  onUpgrade,
}: {
  remaining: number;
  total: number;
  onUpgrade?: () => void;
}) {
  const pct = total > 0 ? (remaining / total) * 100 : 0;
  const used = total - remaining;

  // Color based on remaining %: green > 50%, yellow 20-50%, red < 20%
  const barColor =
    pct > 50
      ? 'linear-gradient(90deg, #22c55e 0%, #16a34a 100%)'
      : pct > 20
      ? 'linear-gradient(90deg, #eab308 0%, #ca8a04 100%)'
      : 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)';

  const labelColor = pct > 50 ? '#22c55e' : pct > 20 ? '#eab308' : '#ef4444';

  const showUpgrade = pct <= 20;

  return (
    <div className="px-3 py-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(93,26,27,0.18)' }}>
      {/* Header row */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-semibold text-white/60 tracking-wide uppercase">Credits</span>
        <span className="text-[11px] font-bold" style={{ color: labelColor }}>
          {remaining.toLocaleString()} / {total.toLocaleString()}
        </span>
      </div>

      {/* Bar track */}
      <div className="h-1.5 rounded-full mb-2" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${Math.min(pct, 100)}%`, background: barColor }}
        />
      </div>

      {/* Label */}
      <p className="text-[11px] text-white/40 mb-3">
        {used.toLocaleString()} credits used
      </p>

      {/* Upgrade CTA — shown when credits are critical */}
      {showUpgrade && (
        <button
          onClick={onUpgrade}
          className="w-full py-2 rounded-lg text-xs font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
          style={{ background: 'linear-gradient(135deg, #EC4899 0%, #A855F7 100%)' }}
        >
          Upgrade Plan
        </button>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function Sidebar({
  projects = DEFAULT_PROJECTS,
  activeProjectId = null,
  chatHistory = DEFAULT_CHATS,
  activeChatId = null,
  creditsRemaining = 3200,
  creditsTotal = 8000,
  activeSection,
  onNewProject,
  onSelectProject,
  onSelectChat,
  onNavigate,
  onUpgrade,
}: SidebarProps) {
  const [projectsOpen, setProjectsOpen] = useState(true);
  const [historyOpen, setHistoryOpen] = useState(true);

  // Group chat history
  const todayChats = chatHistory.filter(c => c.group === 'today');
  const yesterdayChats = chatHistory.filter(c => c.group === 'yesterday');
  const earlierChats = chatHistory.filter(c => c.group === 'earlier');

  return (
    <aside
      className="h-full w-full bg-background flex flex-col overflow-hidden"
      style={{ borderRight: '1px solid rgba(93,26,27,0.2)' }}
      aria-label="Sidebar navigation"
    >
      {/* ── Scrollable content ── */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 space-y-1 px-2"
        style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(93,26,27,0.3) transparent' }}>

        {/* ── PROJECTS ─────────────────────────────────────────────────── */}
        <SectionLabel>Workspace</SectionLabel>

        {/* Projects toggle */}
        <NavItem
          icon={
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
          }
          label="Projects"
          active={activeSection === 'projects'}
          onClick={() => { setProjectsOpen(o => !o); onNavigate?.('projects'); }}
          right={<Chevron open={projectsOpen} />}
        />

        {/* Projects list */}
        {projectsOpen && (
          <div className="ml-4 pl-3 space-y-0.5" style={{ borderLeft: '1px solid rgba(93,26,27,0.2)' }}>
            {projects.map(project => (
              <button
                key={project.id}
                onClick={() => onSelectProject?.(project.id)}
                className={[
                  'w-full flex items-center gap-2 px-2 py-2 rounded-lg text-sm transition-all duration-150 text-left',
                  activeProjectId === project.id
                    ? 'text-white font-medium'
                    : 'text-white/45 hover:text-white/75 hover:bg-white/[0.04]',
                ].join(' ')}
              >
                {/* Active dot */}
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors duration-150"
                  style={{
                    background: activeProjectId === project.id
                      ? 'linear-gradient(135deg, #EC4899, #A855F7)'
                      : 'rgba(255,255,255,0.15)',
                  }}
                />
                <span className="truncate">{project.name}</span>
              </button>
            ))}

            {/* New project */}
            <button
              onClick={onNewProject}
              className="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-white/30 hover:text-white/60 transition-all duration-150 hover:bg-white/[0.03]"
              style={{ border: '1px dashed rgba(93,26,27,0.3)' }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              New Project
            </button>
          </div>
        )}

        <Divider />

        {/* ── MAIN NAV ─────────────────────────────────────────────────── */}
        <SectionLabel>Library</SectionLabel>

        <NavItem
          icon={
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
            </svg>
          }
          label="Assets"
          active={activeSection === 'assets'}
          onClick={() => onNavigate?.('assets')}
        />

        <NavItem
          icon={
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
            </svg>
          }
          label="Settings"
          active={activeSection === 'settings'}
          onClick={() => onNavigate?.('settings')}
        />

        <NavItem
          icon={
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          }
          label="Account"
          active={activeSection === 'account'}
          onClick={() => onNavigate?.('account')}
        />

        <Divider />

        {/* ── CHAT HISTORY ─────────────────────────────────────────────── */}
        <SectionLabel>History</SectionLabel>

        <NavItem
          icon={
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          }
          label="Chat History"
          active={activeSection === 'history'}
          onClick={() => { setHistoryOpen(o => !o); onNavigate?.('history'); }}
          right={<Chevron open={historyOpen} />}
        />

        {historyOpen && (
          <div className="ml-4 pl-3 space-y-0.5" style={{ borderLeft: '1px solid rgba(93,26,27,0.15)' }}>

            {/* Today */}
            {todayChats.length > 0 && (
              <>
                <p className="px-2 py-1 text-[10px] font-bold tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.2)' }}>
                  Today
                </p>
                {todayChats.map(chat => (
                  <ChatRow key={chat.id} chat={chat} active={activeChatId === chat.id} onClick={() => onSelectChat?.(chat.id)} />
                ))}
              </>
            )}

            {/* Yesterday */}
            {yesterdayChats.length > 0 && (
              <>
                <p className="px-2 pt-2 pb-1 text-[10px] font-bold tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.2)' }}>
                  Yesterday
                </p>
                {yesterdayChats.map(chat => (
                  <ChatRow key={chat.id} chat={chat} active={activeChatId === chat.id} onClick={() => onSelectChat?.(chat.id)} />
                ))}
              </>
            )}

            {/* Earlier */}
            {earlierChats.length > 0 && (
              <>
                <p className="px-2 pt-2 pb-1 text-[10px] font-bold tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.2)' }}>
                  Earlier
                </p>
                {earlierChats.map(chat => (
                  <ChatRow key={chat.id} chat={chat} active={activeChatId === chat.id} onClick={() => onSelectChat?.(chat.id)} />
                ))}
              </>
            )}
          </div>
        )}

        <Divider />

        {/* ── SUPPORT ──────────────────────────────────────────────────── */}
        <NavItem
          icon={
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          }
          label="Support"
          active={activeSection === 'support'}
          onClick={() => onNavigate?.('support')}
        />
      </div>

      {/* ── Credit meter — pinned to bottom ── */}
      <div className="flex-shrink-0 p-3" style={{ borderTop: '1px solid rgba(93,26,27,0.15)' }}>
        <CreditMeter
          remaining={creditsRemaining}
          total={creditsTotal}
          onUpgrade={onUpgrade}
        />
      </div>
    </aside>
  );
}

// ─── Chat row ─────────────────────────────────────────────────────────────────

function ChatRow({
  chat,
  active,
  onClick,
}: {
  chat: SidebarChat;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        'w-full flex items-center justify-between gap-2 px-2 py-2 rounded-lg text-left transition-all duration-150',
        active
          ? 'text-white'
          : 'text-white/45 hover:text-white/70 hover:bg-white/[0.04]',
      ].join(' ')}
      style={active ? {
        background: 'rgba(93,26,27,0.2)',
      } : {}}
    >
      <span className="truncate text-sm">{chat.title}</span>
      <span className="flex-shrink-0 text-[10px] font-medium" style={{ color: 'rgba(255,255,255,0.22)' }}>
        {chat.time}
      </span>
    </button>
  );
}
