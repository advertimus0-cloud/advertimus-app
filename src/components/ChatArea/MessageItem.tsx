'use client'

/**
 * MessageItem — renders a single chat bubble (user | agent | system | options).
 *
 * SECURITY (Rule 18):
 * - All content rendered as plain React text — no dangerouslySetInnerHTML.
 *   Real agent output MUST be passed through DOMPurify + marked before being
 *   placed in ChatMessage.content (§7 — LLM output is untrusted).
 * - `images[]` must contain Supabase signed URLs generated server-side;
 *   never construct raw storage paths in client code (§8).
 * - `onOptionSelect` is a UI callback only; actual mutations go through
 *   authenticated API routes (§16). Locked options are UI hints — plan
 *   enforcement is also enforced server-side.
 * - Pure display component — no API calls, no auth logic (§16).
 */

import React from 'react'
import { MultiChoiceOptions } from './MultiChoiceOptions'

// ─── Types ────────────────────────────────────────────────────────────────────

export type MessageRole = 'user' | 'agent' | 'system'
export type MessageType = 'text' | 'options'

export interface MCQOption {
  id: string
  title: string
  description: string
  /** Emoji or short text symbol */
  icon: string
  /** Plan gate — grays out the option without removing it */
  locked?: boolean
  /** Shown below description when locked (e.g. "🔒 Upgrade to Dominance") */
  lockedLabel?: string
  /** Credit cost — informational, used in LENGTH_OPTIONS descriptions */
  creditCost?: number
}

export interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  timestamp: string
  images?: string[]
  /** 'options' causes agent message to render MCQ cards below the bubble */
  type?: MessageType
  options?: MCQOption[]
  /** ID of the option the user chose (null = not yet answered) */
  selectedOptionId?: string | null
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function AgentAvatar() {
  return (
    <div
      className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center
                 text-white text-[10px] font-bold tracking-wide select-none"
      style={{ background: 'linear-gradient(135deg, #5d1a1b 0%, #161142 100%)' }}
      aria-hidden="true"
    >
      A
    </div>
  )
}

function ImageThumbnails({ images }: { images: string[] }) {
  return (
    <div className="flex gap-1.5 flex-wrap mt-2.5">
      {images.map((src, i) => (
        <div
          key={i}
          className="w-16 h-16 rounded-lg overflow-hidden border border-white/10 flex-shrink-0 bg-white/5"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={`Reference image ${i + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  )
}

// ─── Typing indicator (exported for MessageList) ──────────────────────────────

export function TypingIndicator() {
  return (
    <div
      className="flex items-end gap-2.5 mb-5 adv-msg-in"
      role="status"
      aria-label="Advertimus is typing"
    >
      <AgentAvatar />
      <div
        className="px-4 py-3.5 rounded-2xl rounded-bl-sm flex items-center gap-[5px]"
        style={{
          background: 'rgba(22,17,66,0.85)',
          border: '1px solid rgba(93,26,27,0.2)',
        }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-white/50 adv-dot" aria-hidden="true" />
        <span className="w-1.5 h-1.5 rounded-full bg-white/50 adv-dot-2" aria-hidden="true" />
        <span className="w-1.5 h-1.5 rounded-full bg-white/50 adv-dot-3" aria-hidden="true" />
      </div>
    </div>
  )
}

// ─── MessageItem ──────────────────────────────────────────────────────────────

interface MessageItemProps {
  message: ChatMessage
  /**
   * Called when the user selects an MCQ option.
   * Args: (messageId, optionId) — parent updates selectedOptionId in state.
   * Display only for now; wire to API in the next step.
   */
  onOptionSelect?: (messageId: string, optionId: string) => void
}

export function MessageItem({ message, onOptionSelect }: MessageItemProps) {
  const { role, content, timestamp, images, type, options, selectedOptionId } = message
  const hasOptions = type === 'options' && options && options.length > 0

  // ── System / status message ───────────────────────────────────────────────
  if (role === 'system') {
    return (
      <div className="flex justify-center py-2 adv-msg-fade" aria-live="polite">
        <div className="flex items-center gap-2 text-xs text-white/30">
          <svg
            width="12" height="12" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round"
            className="animate-spin flex-shrink-0" aria-hidden="true"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42
                     M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
          <span>{content}</span>
        </div>
      </div>
    )
  }

  // ── Agent message (left-aligned, optionally with MCQ options below) ───────
  if (role === 'agent') {
    return (
      <div
        className="mb-5 adv-msg-in"
        role="article"
        aria-label={`Advertimus at ${timestamp}`}
      >
        {/* Row: avatar + text bubble */}
        <div className="flex items-end gap-2.5">
          <AgentAvatar />
          <div className="flex flex-col items-start max-w-[75%] md:max-w-[65%]">
            <div
              className="px-4 py-3 rounded-2xl rounded-bl-sm text-white text-sm leading-relaxed shadow-lg"
              style={{
                background: 'linear-gradient(135deg, rgba(22,17,66,0.92) 0%, rgba(22,17,66,0.78) 100%)',
                border: '1px solid rgba(93,26,27,0.22)',
              }}
            >
              {content}
            </div>

            {/* Timestamp sits under bubble when there are NO options below */}
            {!hasOptions && (
              <time className="mt-1.5 ml-1 text-[10px] text-white/22" dateTime={timestamp}>
                {timestamp}
              </time>
            )}
          </div>
        </div>

        {/* MCQ options — indented to align with text bubble (avatar 28px + gap 10px = 38px) */}
        {hasOptions && (
          <div className="ml-[38px]">
            <MultiChoiceOptions
              options={options!}
              selectedId={selectedOptionId ?? null}
              onSelect={(optionId) => onOptionSelect?.(message.id, optionId)}
            />
            <time className="block mt-2 ml-1 text-[10px] text-white/22" dateTime={timestamp}>
              {timestamp}
            </time>
          </div>
        )}
      </div>
    )
  }

  // ── User message (right-aligned) ──────────────────────────────────────────
  return (
    <div
      className="flex justify-end mb-5 adv-msg-in-right"
      role="article"
      aria-label={`You at ${timestamp}`}
    >
      <div className="flex flex-col items-end max-w-[70%] md:max-w-[60%]">
        <div
          className="px-4 py-3 rounded-2xl rounded-br-sm text-white text-sm leading-relaxed shadow-lg"
          style={{
            background: 'linear-gradient(135deg, #5d1a1b 0%, #7a2424 100%)',
            border: '1px solid rgba(93,26,27,0.5)',
          }}
        >
          {content}
          {images && images.length > 0 && <ImageThumbnails images={images} />}
        </div>
        <time className="mt-1.5 mr-1 text-[10px] text-white/22" dateTime={timestamp}>
          {timestamp}
        </time>
      </div>
    </div>
  )
}
