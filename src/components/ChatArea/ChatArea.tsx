'use client'

/**
 * ChatArea — center column of the Advertimus dashboard.
 *
 * Empty state: large centered headline + quick-action suggestion chips.
 * Active state: scrollable message list.
 * Input bar (always visible):
 *   Row 1 — textarea ("Assign a task or ask anything...")
 *   Row 2 — [+ attach] [canvas] [screen] ··· [history] [mic] [▶ send]
 *
 * SECURITY (Rule 18):
 * - User input is trimmed and length-validated client-side before dispatch.
 *   Server MUST re-validate length, type, and auth on every API call (§5).
 * - onSendMessage is a UI callback only; the actual POST goes through an
 *   authenticated API route — never call Supabase directly from here (§16).
 * - Image previews (Object URLs) are display-only. Real uploads go to
 *   POST /api/chat/upload-references with server-side MIME/size validation (§8).
 * - Agent responses are rendered as plain text in MessageItem — never
 *   dangerouslySetInnerHTML with raw LLM output (§7).
 * - No secrets, tokens, or Supabase calls in this component.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { MessageList } from './MessageList'
import { ChatMessage } from './MessageItem'
import { AD_TYPE_OPTIONS } from './MultiChoiceOptions'
import { ImageUploader, ImageUploaderHandle, UploadedFile } from './ImageUploader'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ChatAreaProps {
  projectName?: string
  /** Large centered headline shown in the empty state */
  headline?: string
  initialMessages?: ChatMessage[]
  isGenerating?: boolean
  onSendMessage?: (content: string) => void
}

// ─── Demo messages ────────────────────────────────────────────────────────────

const DEMO_MESSAGES: ChatMessage[] = [
  {
    id: 'demo-1',
    role: 'agent',
    content:
      "Hi! I'm Advertimus. Tell me about your product and what you want to promote. You can also upload reference images using the [+] button so I can match your brand's look and feel.",
    timestamp: '2:00 PM',
  },
  {
    id: 'demo-2',
    role: 'user',
    content: 'I sell leather wallets',
    timestamp: '2:01 PM',
  },
  {
    id: 'demo-3',
    role: 'agent',
    content:
      "Great! Leather wallets are a timeless product with serious appeal. Based on what you've shared, I think a storytelling or problem→solution approach would work really well. First, let me ask — what type of ad would you like to create?",
    timestamp: '2:01 PM',
  },
  {
    id: 'demo-4',
    role: 'agent',
    content: 'What type of ad do you want to create?',
    timestamp: '2:02 PM',
    type: 'options',
    options: AD_TYPE_OPTIONS,
    selectedOptionId: null,
  },
]

// ─── Quick action chips (shown in empty state) ────────────────────────────────

const QUICK_ACTIONS = [
  'Create Instagram ad',
  'Write ad copy',
  'YouTube Shorts script',
  'Predict performance',
]

// ─── Constants ────────────────────────────────────────────────────────────────

const MAX_INPUT_LENGTH = 2000

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconAttach() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

function IconCanvas() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" />
    </svg>
  )
}

function IconScreen() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  )
}

function IconHistory() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function IconMic() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  )
}

function IconSend() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  )
}

// ─── ChatArea ─────────────────────────────────────────────────────────────────

export function ChatArea({
  projectName = 'New Chat',
  headline = 'lets make the best marketing campaign',
  initialMessages = DEMO_MESSAGES,
  isGenerating: controlledGenerating,
  onSendMessage,
}: ChatAreaProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [inputValue, setInputValue] = useState('')
  const [localGenerating, setLocalGenerating] = useState(false)
  const [attachedFiles, setAttachedFiles] = useState<UploadedFile[]>([])
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const uploaderRef = useRef<ImageUploaderHandle>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const isGenerating = controlledGenerating ?? localGenerating
  const isEmpty = messages.length === 0
  const hasContent = inputValue.trim().length > 0 || attachedFiles.length > 0
  const canSend = hasContent && !isGenerating

  // ── Auto-resize textarea ────────────────────────────────────────────────────
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`
  }, [inputValue])

  // ── Cleanup mock timer ──────────────────────────────────────────────────────
  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current)
  }, [])

  // ── Option select ───────────────────────────────────────────────────────────
  const handleOptionSelect = useCallback((messageId: string, optionId: string) => {
    setMessages(prev =>
      prev.map(msg => msg.id === messageId ? { ...msg, selectedOptionId: optionId } : msg)
    )
  }, [])

  // ── Send ────────────────────────────────────────────────────────────────────
  const handleSend = useCallback(() => {
    const trimmed = inputValue.trim()
    const hasImages = attachedFiles.length > 0
    if ((!trimmed && !hasImages) || trimmed.length > MAX_INPUT_LENGTH || isGenerating) return

    const now = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: trimmed || (hasImages ? `${attachedFiles.length} image${attachedFiles.length > 1 ? 's' : ''} uploaded` : ''),
      timestamp: now,
      images: hasImages ? attachedFiles.map(f => f.previewUrl) : undefined,
    }

    setMessages(prev => [...prev, userMsg])
    setInputValue('')
    uploaderRef.current?.clearFiles()
    onSendMessage?.(trimmed)

    // Mock response — replace with real API
    setLocalGenerating(true)
    timerRef.current = setTimeout(() => {
      setLocalGenerating(false)
      setMessages(prev => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: 'agent',
          content: 'Got it! The AI generation pipeline will be connected in the next step. Your message was received.',
          timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }),
        },
      ])
    }, 2200)
  }, [inputValue, attachedFiles, isGenerating, onSendMessage])

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    if (e.target.value.length <= MAX_INPUT_LENGTH) setInputValue(e.target.value)
  }

  function handleQuickAction(text: string) {
    setInputValue(text)
    textareaRef.current?.focus()
  }

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">

      {/* ── Message area ─────────────────────────────────────────────────── */}
      {isEmpty ? (
        /* Empty state — centered headline */
        <div className="flex-1 flex flex-col items-center justify-center px-6 select-none">
          <h1
            className="text-center font-semibold leading-tight max-w-xl"
            style={{
              fontSize: 'clamp(24px, 4vw, 40px)',
              color: 'rgba(255,255,255,0.88)',
              letterSpacing: '-0.02em',
            }}
          >
            {headline}
          </h1>
          <p className="mt-3 text-white/28 text-sm text-center max-w-sm">
            Assign a task or describe your product to get started
          </p>
        </div>
      ) : (
        <MessageList
          messages={messages}
          isGenerating={isGenerating}
          onOptionSelect={handleOptionSelect}
        />
      )}

      {/* ── Input area ───────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 px-4 pb-4 pt-0">

        {/* Image uploader panel */}
        <ImageUploader
          ref={uploaderRef}
          onFilesChange={setAttachedFiles}
          maxFiles={12}
          maxSizeMB={20}
          disabled={isGenerating}
        />

        {/* Input container */}
        <div
          className="max-w-3xl mx-auto rounded-2xl overflow-hidden transition-all duration-200"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: `1px solid ${attachedFiles.length > 0 ? 'rgba(168,85,247,0.3)' : 'rgba(93,26,27,0.3)'}`,
            boxShadow: '0 4px 24px rgba(0,0,0,0.35)',
          }}
        >
          {/* Textarea row */}
          <div className="px-4 pt-3.5 pb-1">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Assign a task or ask anything..."
              rows={1}
              disabled={isGenerating}
              className="w-full bg-transparent text-white text-sm leading-relaxed
                         placeholder-white/22 resize-none outline-none"
              style={{ maxHeight: '120px' }}
              aria-label="Message input"
              aria-multiline="true"
            />
          </div>

          {/* Bottom icon row */}
          <div className="flex items-center justify-between px-3 pb-3 pt-1">
            {/* Left tools */}
            <div className="flex items-center gap-0.5">
              {/* Attach / open uploader */}
              <button
                onClick={() => uploaderRef.current?.openPicker()}
                disabled={isGenerating}
                className={[
                  'w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150',
                  'disabled:opacity-35 disabled:cursor-not-allowed',
                  attachedFiles.length > 0
                    ? 'text-purple-400/80 hover:text-purple-300 hover:bg-white/[0.06]'
                    : 'text-white/28 hover:text-white/60 hover:bg-white/[0.05]',
                ].join(' ')}
                aria-label={`Attach images${attachedFiles.length > 0 ? ` (${attachedFiles.length})` : ''}`}
              >
                <IconAttach />
              </button>

              {/* Canvas — placeholder */}
              <button
                disabled={isGenerating}
                className="w-8 h-8 rounded-lg flex items-center justify-center
                           text-white/22 hover:text-white/50 hover:bg-white/[0.05]
                           transition-all duration-150 disabled:opacity-35 disabled:cursor-not-allowed"
                aria-label="Canvas (coming soon)"
              >
                <IconCanvas />
              </button>

              {/* Screen — placeholder */}
              <button
                disabled={isGenerating}
                className="w-8 h-8 rounded-lg flex items-center justify-center
                           text-white/22 hover:text-white/50 hover:bg-white/[0.05]
                           transition-all duration-150 disabled:opacity-35 disabled:cursor-not-allowed"
                aria-label="Screen share (coming soon)"
              >
                <IconScreen />
              </button>
            </div>

            {/* Right tools */}
            <div className="flex items-center gap-0.5">
              {/* History — placeholder */}
              <button
                disabled={isGenerating}
                className="w-8 h-8 rounded-lg flex items-center justify-center
                           text-white/22 hover:text-white/50 hover:bg-white/[0.05]
                           transition-all duration-150 disabled:opacity-35 disabled:cursor-not-allowed"
                aria-label="History (coming soon)"
              >
                <IconHistory />
              </button>

              {/* Mic — placeholder */}
              <button
                disabled={isGenerating}
                className="w-8 h-8 rounded-lg flex items-center justify-center
                           text-white/22 hover:text-white/50 hover:bg-white/[0.05]
                           transition-all duration-150 disabled:opacity-35 disabled:cursor-not-allowed"
                aria-label="Voice input (coming soon)"
              >
                <IconMic />
              </button>

              {/* Send */}
              <button
                onClick={handleSend}
                disabled={!canSend}
                className={[
                  'w-8 h-8 rounded-xl flex items-center justify-center ml-1',
                  'transition-all duration-200',
                  canSend
                    ? 'text-white hover:scale-105 active:scale-95'
                    : 'text-white/18 cursor-not-allowed',
                ].join(' ')}
                style={
                  canSend
                    ? { background: 'linear-gradient(135deg, #5d1a1b 0%, #161142 100%)' }
                    : { background: 'rgba(255,255,255,0.05)' }
                }
                aria-label="Send message"
              >
                <IconSend />
              </button>
            </div>
          </div>
        </div>

        {/* Quick action chips — shown only in empty state */}
        {isEmpty && (
          <div className="max-w-3xl mx-auto mt-3 flex flex-wrap gap-2 justify-center">
            {QUICK_ACTIONS.map(action => (
              <button
                key={action}
                onClick={() => handleQuickAction(action)}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full
                           text-xs font-medium text-white/45 hover:text-white/75
                           transition-all duration-150 hover:bg-white/[0.04]"
                style={{ border: '1px solid rgba(93,26,27,0.25)' }}
              >
                {/* Sparkle icon */}
                <span
                  className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, rgba(93,26,27,0.5) 0%, rgba(22,17,66,0.5) 100%)' }}
                  aria-hidden="true"
                >
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none"
                    stroke="rgba(255,255,255,0.6)" strokeWidth="2.5" strokeLinecap="round"
                    aria-hidden="true">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </span>
                {action}
              </button>
            ))}
          </div>
        )}

        {/* Keyboard hint */}
        <p className="text-center mt-2 text-[10px] text-white/12 select-none">
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  )
}
