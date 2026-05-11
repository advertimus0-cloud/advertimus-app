'use client'

/**
 * OptionButton — one selectable card in a multiple-choice step.
 *
 * SECURITY (Rule 18):
 * - Pure display component — no API calls, no auth (§16).
 * - `option.title`, `option.description`, `option.lockedLabel` are rendered as
 *   plain React text nodes (no dangerouslySetInnerHTML) → XSS-safe (§7).
 * - `option.icon` is an emoji string — safe to render as text.
 * - `onSelect` is a UI callback; actual mutations must go through authenticated
 *   API routes, not here (§5).
 * - `locked` options are visually disabled and aria-disabled; plan enforcement
 *   is also enforced server-side — never trust UI alone (§16).
 */

import React from 'react'
import { Lock, Check } from 'lucide-react'
import { MCQOption } from '../ChatArea/MessageItem'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface OptionButtonProps {
  option: MCQOption
  index: number
  isSelected: boolean
  disabled?: boolean
  onSelect?: (id: string) => void
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

  const containerStyle: React.CSSProperties = isSelected
    ? {
        background: 'linear-gradient(135deg, rgba(93,26,27,0.35) 0%, rgba(22,17,66,0.35) 100%)',
        border: '1px solid rgba(93,26,27,0.7)',
        boxShadow: '0 0 18px rgba(93,26,27,0.25), inset 0 0 0 1px rgba(22,17,66,0.2)',
      }
    : {
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(93,26,27,0.28)',
      }

  const badgeStyle: React.CSSProperties = isSelected
    ? { background: 'linear-gradient(135deg, #5d1a1b 0%, #161142 100%)', color: '#fff' }
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
        {isLocked ? <Lock size={9} /> : index}
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

        {isLocked && option.lockedLabel && (
          <span
            className="text-[11px] font-medium mt-0.5"
            style={{ color: 'rgba(255,255,255,0.45)' }}
          >
            {option.lockedLabel}
          </span>
        )}

        {isSelected && (
          <span className="text-[11px] font-medium mt-0.5 flex items-center gap-1"
            style={{ color: 'rgba(255,255,255,0.7)' }}>
            <Check size={10} aria-hidden="true" />
            Selected
          </span>
        )}
      </div>
    </button>
  )
}
