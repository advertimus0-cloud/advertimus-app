'use client'

/**
 * MessageList — scrollable container for the chat conversation.
 *
 * SECURITY (Rule 18):
 * - Renders MessageItem components which handle all display-only logic.
 * - No data fetching or API calls in this component (§16).
 * - The `aria-live="polite"` region announces new messages accessibly
 *   without triggering XSS — content is plain text from MessageItem (§7).
 */

import React, { useEffect, useRef } from 'react'
import { MessageItem, TypingIndicator, ChatMessage, QuestionId } from './MessageItem'

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-6 py-16 select-none">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 text-white font-bold text-xl"
        style={{
          background: 'linear-gradient(135deg, #5d1a1b 0%, #161142 100%)',
          boxShadow: '0 0 40px rgba(93,26,27,0.3)',
        }}
        aria-hidden="true"
      >
        A
      </div>

      <h3 className="text-white font-semibold text-base mb-2">
        Start a conversation
      </h3>
      <p className="text-white/35 text-sm leading-relaxed max-w-xs">
        Tell me about your product. Upload reference images using the{' '}
        <span
          className="inline-flex items-center justify-center w-4 h-4 rounded text-[9px] font-bold text-white/50 align-middle"
          style={{ border: '1px solid rgba(255,255,255,0.2)' }}
          aria-label="plus"
        >
          +
        </span>{' '}
        button to give me visual context.
      </p>

      <div className="mt-6 flex flex-wrap gap-2 justify-center">
        {[
          'I sell leather wallets',
          'I run a skincare brand',
          'I have an online clothing store',
        ].map(prompt => (
          <span
            key={prompt}
            className="px-3 py-1.5 rounded-full text-xs text-white/40"
            style={{ border: '1px solid rgba(93,26,27,0.25)' }}
          >
            {prompt}
          </span>
        ))}
      </div>
    </div>
  )
}

// ─── MessageList ──────────────────────────────────────────────────────────────

interface MessageListProps {
  messages: ChatMessage[]
  isTyping?: boolean
  onOptionSelect?: (messageId: string, optionId: string, questionId?: QuestionId) => void
  onConceptApproval?: (messageId: string, action: 'approve' | 'revise') => void
  onSummaryAction?: (messageId: string, action: 'start' | 'edit' | 'cancel') => void
}

export function MessageList({
  messages,
  isTyping = false,
  onOptionSelect,
  onConceptApproval,
  onSummaryAction,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length, isTyping])

  return (
    <div
      className="flex-1 overflow-y-auto"
      style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(93,26,27,0.25) transparent' }}
      role="log"
      aria-label="Chat conversation"
      aria-live="polite"
    >
      {messages.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="max-w-3xl mx-auto px-4 pt-6 pb-2">
          {messages.map(message => (
            <MessageItem
              key={message.id}
              message={message}
              onOptionSelect={onOptionSelect}
              onConceptApproval={onConceptApproval}
              onSummaryAction={onSummaryAction}
            />
          ))}

          {isTyping && <TypingIndicator />}

          <div ref={bottomRef} aria-hidden="true" />
        </div>
      )}
    </div>
  )
}
