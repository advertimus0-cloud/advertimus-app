'use client'

/**
 * ChatArea — center column of the 3-column dashboard.
 *
 * Layout:
 *   [Project Name · Advertimus Agent]    [+ Upload]   ← header
 *   ──────────────────────────────────────────────────
 *   [         Scrollable MessageList          ]       ← flex-1
 *   ──────────────────────────────────────────────────
 *   [ + ]  [  textarea  ]  [▶ send]              ← input bar
 *
 * Design tokens: bg-background (#000000), accent1 (#5d1a1b), accent2 (#161142)
 * Source of truth: ADVERTIMUS_CHAT_UI_IMPLEMENTATION_GUIDE.md §4
 *
 * SECURITY (Rule 18):
 * - All user input is trimmed and length-validated before dispatch (§5).
 * - MAX_INPUT_LENGTH prevents oversized message payloads.
 * - Agent responses rendered as plain text here; when real LLM output arrives
 *   it MUST be sanitized with DOMPurify + marked before being placed in
 *   ChatMessage.content — never pass raw HTML strings to MessageItem (§7).
 * - onSendMessage callback is a no-op; actual API call must be an
 *   authenticated POST via a server action or API route (§16).
 * - onUploadClick is UI-only; server validates MIME type, size, and count (§8).
 * - No secrets, no tokens, no Supabase calls in this component.
 */

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { MessageList } from './MessageList'
import { ChatMessage } from './MessageItem'
import { AD_TYPE_OPTIONS } from './MultiChoiceOptions'
import { ImageUploader, ImageUploaderHandle, UploadedFile } from './ImageUploader'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ChatAreaProps {
  projectName?: string
  initialMessages?: ChatMessage[]
  /** Controlled generating state — parent can override local mock */
  isGenerating?: boolean
  /** Called with sanitized, length-checked content before API dispatch */
  onSendMessage?: (content: string) => void
}

// ─── Hardcoded demo messages (replace with real data from context/API) ────────

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

// ─── Constants ────────────────────────────────────────────────────────────────

const MAX_INPUT_LENGTH = 2000
const CHAR_WARN_THRESHOLD = 0.8 // Show counter at 80%

// ─── Send icon ────────────────────────────────────────────────────────────────

function SendIcon() {
  return (
    <svg
      width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  )
}

// ─── ChatArea ─────────────────────────────────────────────────────────────────

export function ChatArea({
  projectName = 'New Chat',
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
  const hasContent = inputValue.trim().length > 0 || attachedFiles.length > 0
  const canSend = hasContent && !isGenerating
  const showCharCount = inputValue.length > MAX_INPUT_LENGTH * CHAR_WARN_THRESHOLD

  // ── Auto-resize textarea ──────────────────────────────────────────────────
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }, [inputValue])

  // ── Cleanup mock timer on unmount ─────────────────────────────────────────
  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current)
  }, [])

  // ── Option select handler — updates selectedOptionId on the target message ──
  const handleOptionSelect = useCallback((messageId: string, optionId: string) => {
    setMessages(prev =>
      prev.map(msg =>
        msg.id === messageId ? { ...msg, selectedOptionId: optionId } : msg
      )
    )
  }, [])

  // ── Send handler ──────────────────────────────────────────────────────────
  const handleSend = useCallback(() => {
    const trimmed = inputValue.trim()
    const hasImages = attachedFiles.length > 0
    // Client-side guard — server must re-validate length and auth (§5)
    if ((!trimmed && !hasImages) || trimmed.length > MAX_INPUT_LENGTH || isGenerating) return

    const now = new Date().toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    })

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: trimmed || (hasImages ? `${attachedFiles.length} image${attachedFiles.length > 1 ? 's' : ''} uploaded` : ''),
      timestamp: now,
      // Object URLs are display-only; actual upload happens via POST /api/chat/upload-references
      images: hasImages ? attachedFiles.map(f => f.previewUrl) : undefined,
    }

    setMessages(prev => [...prev, userMsg])
    setInputValue('')
    // Clear uploader after send
    uploaderRef.current?.clearFiles()
    onSendMessage?.(trimmed)

    // ── Mock agent response (remove when wiring real API) ─────────────────
    setLocalGenerating(true)
    timerRef.current = setTimeout(() => {
      setLocalGenerating(false)
      const agentMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'agent',
        content:
          'Got it! The full AI response pipeline will be connected in the next implementation step. For now I can confirm your message was received.',
        timestamp: new Date().toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
        }),
      }
      setMessages(prev => [...prev, agentMsg])
    }, 2200)
  }, [inputValue, attachedFiles, isGenerating, onSendMessage])

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    if (e.target.value.length <= MAX_INPUT_LENGTH) {
      setInputValue(e.target.value)
    }
  }

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <header
        className="flex-shrink-0 flex items-center justify-between px-6 h-[56px]"
        style={{ borderBottom: '1px solid rgba(93,26,27,0.15)' }}
      >
        <div className="flex items-center gap-2 min-w-0">
          {/* Active session dot */}
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #EC4899, #A855F7)' }}
            aria-hidden="true"
          />
          <h2 className="text-white font-semibold text-sm truncate max-w-[180px]">
            {projectName}
          </h2>
          <span className="text-white/18 text-xs hidden sm:inline">·</span>
          <span className="text-white/28 text-xs hidden sm:inline tracking-wide">
            Advertimus Agent
          </span>
        </div>

        {/* Upload reference images — same as [+] in input bar */}
        <button
          onClick={() => uploaderRef.current?.openPicker()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                     text-white/50 hover:text-white/85 transition-all duration-150 hover:bg-white/[0.05]"
          style={{ border: '1px solid rgba(93,26,27,0.28)' }}
          aria-label="Upload reference images"
        >
          <svg
            width="12" height="12" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
            aria-hidden="true"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Upload
        </button>
      </header>

      {/* ── Message list (scrollable) ─────────────────────────────────────── */}
      <MessageList
        messages={messages}
        isGenerating={isGenerating}
        onOptionSelect={handleOptionSelect}
      />

      {/* ── Input bar ─────────────────────────────────────────────────────── */}
      <div
        className="flex-shrink-0 px-4 pb-4 pt-3"
        style={{ borderTop: '1px solid rgba(93,26,27,0.12)' }}
      >
        {/* ImageUploader panel — appears above input when open */}
        <ImageUploader
          ref={uploaderRef}
          onFilesChange={setAttachedFiles}
          maxFiles={12}
          maxSizeMB={20}
          disabled={isGenerating}
        />

        {/* Input container */}
        <div
          className="max-w-3xl mx-auto flex items-end gap-2.5 rounded-2xl px-3 py-2.5
                     transition-all duration-200"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: `1px solid ${attachedFiles.length > 0 ? 'rgba(236,72,153,0.25)' : 'rgba(93,26,27,0.22)'}`,
          }}
        >
          {/* [+] opens image uploader */}
          <button
            onClick={() => uploaderRef.current?.openPicker()}
            className={[
              'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center',
              'transition-all duration-150 hover:bg-white/[0.06] self-end mb-0.5',
              attachedFiles.length > 0
                ? 'text-pink-400/80 hover:text-pink-300'
                : 'text-white/30 hover:text-white/65',
            ].join(' ')}
            aria-label={`Upload reference images${attachedFiles.length > 0 ? ` (${attachedFiles.length} selected)` : ''}`}
          >
            <svg
              width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
              aria-hidden="true"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Describe your product or ask a question..."
            rows={1}
            className="flex-1 bg-transparent text-white text-sm leading-relaxed
                       placeholder-white/22 resize-none outline-none py-1.5"
            style={{ maxHeight: '160px' }}
            aria-label="Message input"
            aria-multiline="true"
            disabled={isGenerating}
          />

          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={!canSend}
            className={[
              'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center',
              'transition-all duration-200 self-end mb-0.5',
              canSend
                ? 'text-white hover:scale-105 active:scale-95'
                : 'text-white/20 cursor-not-allowed',
            ].join(' ')}
            style={
              canSend
                ? { background: 'linear-gradient(135deg, #EC4899 0%, #A855F7 100%)' }
                : { background: 'rgba(255,255,255,0.04)' }
            }
            aria-label="Send message"
          >
            <SendIcon />
          </button>
        </div>

        {/* Character count — shown near limit */}
        {showCharCount && (
          <p className="text-center mt-1.5 text-[10px] text-white/25 select-none">
            {inputValue.length} / {MAX_INPUT_LENGTH}
          </p>
        )}

        {/* Keyboard hint */}
        <p className="text-center mt-1.5 text-[10px] text-white/14 select-none">
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  )
}
