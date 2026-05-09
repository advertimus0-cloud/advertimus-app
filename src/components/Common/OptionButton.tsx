'use client'

/**
 * OptionButton — one selectable card in a multiple-choice step.
 *
 * Used by: MultiChoiceOptions (ChatArea MCQ flow)
 *
 * SECURITY (Rule 18):
 * - Pure display component — no API calls, no auth (§16).
 * - `option.title`, `option.description`, `option.lockedLabel` are rendered as
 *   plain React text nodes (no dangerouslySetInnerHTML) → XSS-safe (§7).
 * - `option.icon` is an emoji string — safe to render as text.
 * - `onSelect` is a UI callback; actual mutations must go through authenticated
 *   API routes, not here (§5).
 * - `locked` options are visually disabled and the button is aria-disabled;
 *   plan enforcement is also enforced server-side — never trust UI alone (§16).
 */

import React from 'react'
import { MCQOption } from '../ChatArea/MessageItem'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface OptionButtonProps {
  option: MCQOption
  /** 1-based display index shown in the number badge */
  index: number
  isSelected: boolean
  /** Grays out the button — plan gate or already-answered step */
  disabled?: boolean
  onSelect?: (id: string) => void
}

// ─── Lock icon ────────────────────────────────────────────────────────────────

function LockIcon() {
  return (
    <svg
      width="9" height="9" viewBox="0 0 24 24" fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2
               2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6
               9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-
               1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
    </svg>
  )
}

// ─── OptionButton ─────────────────────────────────────────────────────────────

export function OptionButton({
  option,
  index,
  isSelected,
  disabled = false,
  onSelect,
}: OptionButtonProps) {
  const isLocked = option.locked ?? false
  const isDisabled = isLocked || disabled

  function handleClick() {
    if (!isDisabled) onSelect?.(option.id)
  }

  // ── Border / background per state ─────────────────────────────────────────
  const containerStyle: React.CSSProperties = isSelected
    ? {
        background: 'linear-gradient(135deg, rgba(93,26,27,0.35) 0%, rgba(22,17,66,0.35) 100%)',
        border: '1px solid #EC4899',
        boxShadow: '0 0 18px rgba(236,72,153,0.18), inset 0 0 0 1px rgba(168,85,247,0.12)',
      }
    : {
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(93,26,27,0.28)',
      }

  // ── Number badge per state ────────────────────────────────────────────────
  const badgeStyle: React.CSSProperties = isSelected
    ? { background: 'linear-gradient(135deg, #EC4899 0%, #A855F7 100%)', color: '#fff' }
    : isLocked
    ? { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.3)' }
    : { background: 'rgba(93,26,27,0.45)', color: 'rgba(255,255,255,0.7)' }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isDisabled}
      aria-pressed={isSelected}
      aria-label={`Option ${index}: ${option.title}${isLocked ? ' — upgrade required' : ''}`}
      className={[
        'w-full flex items-start gap-3 px-4 py-3 rounded-xl text-left',
        'transition-all duration-200 group',
        isSelected
          ? 'scale-[1.005]'
          : isDisabled
          ? 'opacity-40 cursor-not-allowed'
          : 'hover:-translate-y-0.5 hover:border-accent1/60 cursor-pointer',
      ].join(' ')}
      style={containerStyle}
    >
      {/* ── Number / lock badge ──────────────────────────────────────────── */}
      <span
        className="flex-shrink-0 w-[22px] h-[22px] rounded-full flex items-center
                   justify-center text-[10px] font-bold mt-[1px]"
        style={badgeStyle}
        aria-hidden="true"
      >
        {isLocked ? <LockIcon /> : index}
      </span>

      {/* ── Emoji icon ───────────────────────────────────────────────────── */}
      <span
        className="flex-shrink-0 text-[18px] leading-none mt-[1px] select-none"
        aria-hidden="true"
      >
        {option.icon}
      </span>

      {/* ── Text ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-[3px] min-w-0 flex-1">
        <span
          className={[
            'text-sm font-semibold leading-snug',
            isSelected
              ? 'text-white'
              : 'text-white/82 group-hover:text-white transition-colors duration-150',
          ].join(' ')}
        >
          {option.title}
        </span>

        <span className="text-[12px] text-white/38 leading-relaxed">
          {option.description}
        </span>

        {/* Locked label (e.g. "🔒 Upgrade to Dominance") */}
        {isLocked && option.lockedLabel && (
          <span
            className="text-[11px] font-medium mt-0.5"
            style={{ color: 'rgba(236,72,153,0.7)' }}
          >
            {option.lockedLabel}
          </span>
        )}

        {/* Selected checkmark confirmation */}
        {isSelected && (
          <span className="text-[11px] font-medium mt-0.5 flex items-center gap-1"
            style={{ color: '#EC4899' }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Selected
          </span>
        )}
      </div>
    </button>
  )
}
