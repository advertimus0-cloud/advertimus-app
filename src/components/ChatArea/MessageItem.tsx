'use client'

/**
 * MessageItem — renders a single chat bubble (user | agent | system | options |
 * concept_approval | summary).
 *
 * SECURITY (Rule 18):
 * - All content rendered as plain React text — no dangerouslySetInnerHTML.
 *   Real agent output MUST be passed through DOMPurify + marked before being
 *   placed in ChatMessage.content (§7 — LLM output is untrusted).
 * - `images[]` must contain Supabase signed URLs generated server-side (§8).
 * - Callbacks are UI-only; actual mutations go through authenticated API routes (§16).
 * - Pure display component — no API calls, no auth logic (§16).
 */

import React from 'react'
import { Loader2, Check, RefreshCw } from 'lucide-react'
import { MultiChoiceOptions } from './MultiChoiceOptions'

// ─── Types ────────────────────────────────────────────────────────────────────

export type MessageRole = 'user' | 'agent' | 'system'
export type MessageType = 'text' | 'options' | 'concept_approval' | 'summary'

export type QuestionId =
  | 'ad_type'
  | 'style'
  | 'format'
  | 'country'
  | 'ratio'
  | 'video_length'
  | 'images'

export interface MCQOption {
  id: string
  title: string
  description: string
  icon: string
  locked?: boolean
  lockedLabel?: string
  creditCost?: number
}

export interface CampaignSummary {
  adType: string
  style: string
  format: string
  country: string
  ratio: string
  videoLength: string
  images: string
  creditCost: number
  creditsRemaining: number
  estimatedTime: string
}

export interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  timestamp: string
  images?: string[]
  type?: MessageType
  options?: MCQOption[]
  selectedOptionId?: string | null
  questionId?: QuestionId
  conceptApprovalState?: 'pending' | 'approved' | 'revising'
  summary?: CampaignSummary
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

// ─── Concept approval card ────────────────────────────────────────────────────

function ConceptApprovalCard({
  messageId,
  approvalState,
  onConceptApproval,
}: {
  messageId: string
  approvalState: 'pending' | 'approved' | 'revising'
  onConceptApproval?: (messageId: string, action: 'approve' | 'revise') => void
}) {
  if (approvalState === 'approved') {
    return (
      <div className="flex items-center gap-1.5 mt-3 text-[11px] font-medium"
        style={{ color: '#22c55e' }}>
        <Check size={11} />
        Concept approved
      </div>
    )
  }

  if (approvalState === 'revising') {
    return (
      <div className="flex items-center gap-1.5 mt-3 text-[11px] font-medium text-white/45">
        <RefreshCw size={11} />
        Revising concept…
      </div>
    )
  }

  return (
    <div className="flex gap-2 mt-3">
      <button
        onClick={() => onConceptApproval?.(messageId, 'approve')}
        className="flex-1 py-2 rounded-xl text-xs font-semibold text-white
                   transition-all duration-150 hover:opacity-90 active:scale-[0.98]"
        style={{ background: 'linear-gradient(135deg, #5d1a1b 0%, #161142 100%)' }}
      >
        Yes, looks great
      </button>
      <button
        onClick={() => onConceptApproval?.(messageId, 'revise')}
        className="flex-1 py-2 rounded-xl text-xs font-medium text-white/55
                   hover:text-white/85 transition-all duration-150"
        style={{ border: '1px solid rgba(93,26,27,0.35)' }}
      >
        Revise it
      </button>
    </div>
  )
}

// ─── Campaign summary card ────────────────────────────────────────────────────

function CampaignSummaryCard({
  summary,
  messageId,
  onSummaryAction,
}: {
  summary: CampaignSummary
  messageId: string
  onSummaryAction?: (messageId: string, action: 'start' | 'edit' | 'cancel') => void
}) {
  const rows: Array<{ label: string; value: string }> = [
    { label: 'Ad Type',    value: summary.adType       },
    { label: 'Style',      value: summary.style        },
    { label: 'Format',     value: summary.format       },
    { label: 'Market',     value: summary.country      },
    { label: 'Ratio',      value: summary.ratio        },
    { label: 'Length',     value: summary.videoLength  },
    { label: 'Images',     value: summary.images       },
    { label: 'Est. Time',  value: summary.estimatedTime },
  ]

  return (
    <div
      className="mt-3 rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(22,17,66,0.5)',
        border: '1px solid rgba(93,26,27,0.32)',
      }}
    >
      <div
        className="px-4 py-2.5 flex items-center justify-between"
        style={{ borderBottom: '1px solid rgba(93,26,27,0.18)' }}
      >
        <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/40">
          Campaign Summary
        </span>
        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded-full tabular-nums"
          style={{
            background: 'rgba(93,26,27,0.25)',
            color: 'rgba(255,255,255,0.7)',
            border: '1px solid rgba(93,26,27,0.4)',
          }}
        >
          {summary.creditCost} credits
        </span>
      </div>

      <div className="px-4 py-3 space-y-1.5">
        {rows.map(({ label, value }) => (
          <div key={label} className="flex items-start justify-between gap-3">
            <span className="text-[11px] text-white/38 flex-shrink-0 w-[90px]">{label}</span>
            <span className="text-[11px] text-white/80 text-right min-w-0 font-medium">{value}</span>
          </div>
        ))}
      </div>

      <div
        className="px-4 py-2 flex items-center justify-between"
        style={{ borderTop: '1px solid rgba(93,26,27,0.14)' }}
      >
        <span className="text-[10px] text-white/30">Credits remaining after</span>
        <span className="text-[10px] font-bold text-white/55 tabular-nums">
          {summary.creditsRemaining}
        </span>
      </div>

      <div
        className="px-4 pb-4 pt-3 flex flex-col gap-2"
        style={{ borderTop: '1px solid rgba(93,26,27,0.12)' }}
      >
        <button
          onClick={() => onSummaryAction?.(messageId, 'start')}
          className="w-full py-2.5 rounded-xl text-sm font-semibold text-white
                     transition-all duration-150 hover:opacity-90 active:scale-[0.98]"
          style={{ background: 'linear-gradient(135deg, #5d1a1b 0%, #161142 100%)' }}
        >
          Start Generation
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => onSummaryAction?.(messageId, 'edit')}
            className="flex-1 py-2 rounded-xl text-xs font-medium text-white/50
                       hover:text-white/80 transition-all duration-150"
            style={{ border: '1px solid rgba(93,26,27,0.28)' }}
          >
            Edit Choices
          </button>
          <button
            onClick={() => onSummaryAction?.(messageId, 'cancel')}
            className="flex-1 py-2 rounded-xl text-xs font-medium text-white/30
                       hover:text-white/55 transition-all duration-150"
            style={{ border: '1px solid rgba(255,255,255,0.08)' }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── MessageItem ──────────────────────────────────────────────────────────────

interface MessageItemProps {
  message: ChatMessage
  onOptionSelect?: (messageId: string, optionId: string, questionId?: QuestionId) => void
  onConceptApproval?: (messageId: string, action: 'approve' | 'revise') => void
  onSummaryAction?: (messageId: string, action: 'start' | 'edit' | 'cancel') => void
}

export function MessageItem({
  message,
  onOptionSelect,
  onConceptApproval,
  onSummaryAction,
}: MessageItemProps) {
  const { role, content, timestamp, images, type, options, selectedOptionId,
    conceptApprovalState, summary, questionId } = message
  const hasOptions = type === 'options' && options && options.length > 0

  // ── System / status message ───────────────────────────────────────────────
  if (role === 'system') {
    return (
      <div className="flex justify-center py-2 adv-msg-fade" aria-live="polite">
        <div className="flex items-center gap-2 text-xs text-white/30">
          <Loader2 size={12} className="animate-spin flex-shrink-0" aria-hidden="true" />
          <span>{content}</span>
        </div>
      </div>
    )
  }

  // ── Agent message ─────────────────────────────────────────────────────────
  if (role === 'agent') {
    const showConceptButtons = type === 'concept_approval'
    const showSummary = type === 'summary' && summary != null
    const hasExtras = hasOptions || showConceptButtons || showSummary

    return (
      <div
        className="mb-5 adv-msg-in"
        role="article"
        aria-label={`Advertimus at ${timestamp}`}
      >
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
            {!hasExtras && (
              <time className="mt-1.5 ml-1 text-[10px] text-white/22" dateTime={timestamp}>
                {timestamp}
              </time>
            )}
          </div>
        </div>

        {hasOptions && (
          <div className="ml-[38px]">
            <MultiChoiceOptions
              options={options!}
              selectedId={selectedOptionId ?? null}
              onSelect={(optionId) => onOptionSelect?.(message.id, optionId, questionId)}
            />
            <time className="block mt-2 ml-1 text-[10px] text-white/22" dateTime={timestamp}>
              {timestamp}
            </time>
          </div>
        )}

        {showConceptButtons && (
          <div className="ml-[38px]">
            <ConceptApprovalCard
              messageId={message.id}
              approvalState={conceptApprovalState ?? 'pending'}
              onConceptApproval={onConceptApproval}
            />
            <time className="block mt-2 ml-1 text-[10px] text-white/22" dateTime={timestamp}>
              {timestamp}
            </time>
          </div>
        )}

        {showSummary && (
          <div className="ml-[38px]">
            <CampaignSummaryCard
              summary={summary!}
              messageId={message.id}
              onSummaryAction={onSummaryAction}
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
