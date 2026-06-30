'use client'

/**
 * MessageItem — renders a single chat turn (user | agent | system | interactive).
 *
 * Design: flat / no-bubble style inspired by manus.im.
 *  - Agent messages: avatar + plain text, no background box
 *  - User messages: right-aligned plain text, no background box
 *  - Interactive cards (MCQ, concept approval, summary) retain card styling
 *    since they must look clickable/distinct.
 *
 * SECURITY (Rule 18):
 * - All content rendered as plain React text — no dangerouslySetInnerHTML.
 *   Real LLM output must be sanitized via DOMPurify + marked before reaching
 *   ChatMessage.content (§7).
 * - `images[]` must contain Supabase signed URLs generated server-side (§8).
 * - Callbacks are UI-only; mutations go through authenticated API routes (§16).
 */

import React from 'react'
import Image from 'next/image'
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
  icon: React.ReactNode
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

// ─── Agent avatar ─────────────────────────────────────────────────────────────

function AgentAvatar() {
  return (
    <div
      className="w-9 h-9 rounded-full flex-shrink-0 overflow-hidden"
      aria-hidden="true"
    >
      <Image
        src="/advernewicon.jpg"
        alt="Advertimus AI"
        width={36}
        height={36}
        quality={100}
        className="w-full h-full object-cover scale-[1.08]"
        priority
      />
    </div>
  )
}

// ─── Image thumbnails ─────────────────────────────────────────────────────────

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

// ─── Typing indicator ─────────────────────────────────────────────────────────

export function TypingIndicator() {
  return (
    <div className="mb-6 adv-msg-in" role="status" aria-label="Advertimus is thinking">
      <div className="flex items-center gap-2.5">
        {/* Spinning gradient ring around bot avatar */}
        <div className="relative flex-shrink-0" style={{ width: 40, height: 40 }}>
          {/* Outer conic-gradient disc — spins */}
          <div
            className="absolute inset-0 rounded-full animate-spin"
            style={{
              background: 'conic-gradient(from 0deg, rgba(93,26,27,0) 0%, #5d1a1b 35%, #7c3aed 58%, rgba(93,26,27,0) 75%)',
              animationDuration: '1.6s',
            }}
          />
          {/* Inner mask creates the visual ring gap */}
          <div className="absolute rounded-full" style={{ inset: '3px', background: '#1a1a1a' }} />
          {/* Bot avatar */}
          <div className="absolute rounded-full overflow-hidden" style={{ inset: '3px' }}>
            <Image
              src="/advernewicon.jpg"
              alt="Advertimus"
              width={34}
              height={34}
              quality={100}
              className="w-full h-full object-cover scale-[1.08]"
              priority
            />
          </div>
        </div>

        <span className="text-[11px] font-semibold tracking-wide select-none"
          style={{ color: 'rgba(255,255,255,0.38)' }}>
          Advertimus
        </span>
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
      <div className="flex items-center gap-1.5 mt-3 text-[11px] font-medium" style={{ color: '#22c55e' }}>
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
        style={{ background: '#cc2936' }}
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
        background: 'rgba(22,17,66,0.4)',
        border: '1px solid rgba(93,26,27,0.28)',
      }}
    >
      <div className="px-4 py-2.5 flex items-center justify-between"
        style={{ borderBottom: '1px solid rgba(93,26,27,0.14)' }}>
        <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/40">
          Campaign Summary
        </span>
        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded-full tabular-nums"
          style={{
            background: 'rgba(93,26,27,0.22)',
            color: 'rgba(255,255,255,0.65)',
            border: '1px solid rgba(93,26,27,0.35)',
          }}
        >
          {summary.creditCost} credits
        </span>
      </div>

      <div className="px-4 py-3 space-y-1.5">
        {rows.map(({ label, value }) => (
          <div key={label} className="flex items-start justify-between gap-3">
            <span className="text-[11px] text-white/35 flex-shrink-0 w-[90px]">{label}</span>
            <span className="text-[11px] text-white/75 text-right min-w-0 font-medium">{value}</span>
          </div>
        ))}
      </div>

      <div className="px-4 py-2 flex items-center justify-between"
        style={{ borderTop: '1px solid rgba(93,26,27,0.1)' }}>
        <span className="text-[10px] text-white/28">Credits remaining after</span>
        <span className="text-[10px] font-bold text-white/50 tabular-nums">{summary.creditsRemaining}</span>
      </div>

      <div className="px-4 pb-4 pt-3 flex flex-col gap-2"
        style={{ borderTop: '1px solid rgba(93,26,27,0.1)' }}>
        <button
          onClick={() => onSummaryAction?.(messageId, 'start')}
          className="w-full py-2.5 rounded-xl text-sm font-semibold text-white
                     transition-all duration-150 hover:opacity-90 active:scale-[0.98]"
          style={{ background: '#cc2936' }}
        >
          Start Generation
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => onSummaryAction?.(messageId, 'edit')}
            className="flex-1 py-2 rounded-xl text-xs font-medium text-white/45
                       hover:text-white/75 transition-all duration-150"
            style={{ border: '1px solid rgba(93,26,27,0.25)' }}
          >
            Edit Choices
          </button>
          <button
            onClick={() => onSummaryAction?.(messageId, 'cancel')}
            className="flex-1 py-2 rounded-xl text-xs font-medium text-white/28
                       hover:text-white/50 transition-all duration-150"
            style={{ border: '1px solid rgba(255,255,255,0.07)' }}
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

  // ── System / status ───────────────────────────────────────────────────────
  if (role === 'system') {
    return (
      <div className="flex justify-center py-2.5 adv-msg-fade" aria-live="polite">
        <div className="flex items-center gap-2 text-xs text-white/28">
          <Loader2 size={11} className="animate-spin flex-shrink-0" aria-hidden="true" />
          <span>{content}</span>
        </div>
      </div>
    )
  }

  // ── Agent message — stacked: avatar+label on top, text below ────────────
  if (role === 'agent') {
    const showConceptButtons = type === 'concept_approval'
    const showSummary = type === 'summary' && summary != null

    return (
      <div
        className="mb-7 adv-msg-in"
        role="article"
        aria-label={`Advertimus at ${timestamp}`}
      >
        {/* Avatar + name row */}
        <div className="flex items-center gap-2 mb-2">
          <AgentAvatar />
          <span className="text-[11px] font-semibold tracking-wide select-none"
            style={{ color: 'rgba(255,255,255,0.38)' }}>
            Advertimus
          </span>
        </div>

        {/* Text — starts at left edge, under avatar */}
        <p
          className="text-[15px] leading-relaxed whitespace-pre-wrap"
          style={{ color: 'rgba(255,255,255,0.88)' }}
        >
          {content}
        </p>

        {/* MCQ options */}
        {hasOptions && (
          <div className="mt-3">
            <MultiChoiceOptions
              options={options!}
              selectedId={selectedOptionId ?? null}
              onSelect={(optionId) => onOptionSelect?.(message.id, optionId, questionId)}
            />
          </div>
        )}

        {/* Concept approval */}
        {showConceptButtons && (
          <ConceptApprovalCard
            messageId={message.id}
            approvalState={conceptApprovalState ?? 'pending'}
            onConceptApproval={onConceptApproval}
          />
        )}

        {/* Campaign summary */}
        {showSummary && (
          <CampaignSummaryCard
            summary={summary!}
            messageId={message.id}
            onSummaryAction={onSummaryAction}
          />
        )}

        <time className="block mt-2 text-xs text-white/28" dateTime={timestamp}>
          {timestamp}
        </time>
      </div>
    )
  }

  // ── User message — flat, no bubble, right-aligned ─────────────────────────
  return (
    <div
      className="flex justify-end mb-7 adv-msg-in-right"
      role="article"
      aria-label={`You at ${timestamp}`}
    >
      <div className="max-w-[70%] md:max-w-[60%]">
        <p
          className="text-[15px] leading-relaxed text-right whitespace-pre-wrap"
          style={{ color: 'rgba(255,255,255,0.68)' }}
        >
          {content}
        </p>
        {images && images.length > 0 && <ImageThumbnails images={images} />}
        <time className="block mt-2 text-xs text-white/28 text-right" dateTime={timestamp}>
          {timestamp}
        </time>
      </div>
    </div>
  )
}
