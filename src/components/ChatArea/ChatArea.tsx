'use client'

/**
 * ChatArea — center column of the Advertimus dashboard.
 *
 * State machine: idle → analyzing → concept → mcq_1..7 → summary → generating → complete
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
import { ChatMessage, CampaignSummary, QuestionId } from './MessageItem'
import {
  AD_TYPE_OPTIONS,
  STYLE_OPTIONS,
  FORMAT_OPTIONS,
  COUNTRY_OPTIONS,
  RATIO_OPTIONS,
  LENGTH_OPTIONS,
  IMAGES_OPTIONS,
} from './MultiChoiceOptions'
import { ImageUploader, ImageUploaderHandle, UploadedFile } from './ImageUploader'

// ─── Types ────────────────────────────────────────────────────────────────────

export type FlowStage =
  | 'idle'
  | 'analyzing'
  | 'concept'
  | 'mcq_1'
  | 'mcq_2'
  | 'mcq_3'
  | 'mcq_4'
  | 'mcq_5'
  | 'mcq_6'
  | 'mcq_7'
  | 'summary'
  | 'generating'
  | 'complete'

interface CampaignConfig {
  adTypeId: string | null; adTypeLabel: string | null
  styleId: string | null; styleLabel: string | null
  formatId: string | null; formatLabel: string | null
  countryId: string | null; countryLabel: string | null
  ratioId: string | null; ratioLabel: string | null
  videoLengthId: string | null; videoLengthLabel: string | null; videoLengthCredits: number
  imagesId: string | null; imagesLabel: string | null; imagesCredits: number
}

export interface ChatAreaProps {
  projectName?: string
  headline?: string
  creditsAvailable?: number
  onGenerationStart?: (config: CampaignConfig) => void
  onSendMessage?: (content: string) => void
}

// ─── Constants ────────────────────────────────────────────────────────────────

const MAX_INPUT_LENGTH = 2000

const EMPTY_CAMPAIGN: CampaignConfig = {
  adTypeId: null, adTypeLabel: null,
  styleId: null, styleLabel: null,
  formatId: null, formatLabel: null,
  countryId: null, countryLabel: null,
  ratioId: null, ratioLabel: null,
  videoLengthId: null, videoLengthLabel: null, videoLengthCredits: 0,
  imagesId: null, imagesLabel: null, imagesCredits: 0,
}

const MCQ_SEQUENCE: Array<{
  stage: FlowStage
  questionId: QuestionId
  question: string
}> = [
  { stage: 'mcq_1', questionId: 'ad_type',      question: 'What type of ad do you want to create?' },
  { stage: 'mcq_2', questionId: 'style',         question: 'What style should the ad have?' },
  { stage: 'mcq_3', questionId: 'format',        question: 'What format works best for you?' },
  { stage: 'mcq_4', questionId: 'country',       question: 'Which market are you targeting?' },
  { stage: 'mcq_5', questionId: 'ratio',         question: 'What video ratio do you need?' },
  { stage: 'mcq_6', questionId: 'video_length',  question: 'How long should the ad be?' },
  { stage: 'mcq_7', questionId: 'images',        question: 'Do you want to include additional images?' },
]

const MCQ_OPTIONS: Record<QuestionId, typeof AD_TYPE_OPTIONS> = {
  ad_type:      AD_TYPE_OPTIONS,
  style:        STYLE_OPTIONS,
  format:       FORMAT_OPTIONS,
  country:      COUNTRY_OPTIONS,
  ratio:        RATIO_OPTIONS,
  video_length: LENGTH_OPTIONS,
  images:       IMAGES_OPTIONS,
}

const QUICK_ACTIONS = [
  'Create Instagram ad',
  'Write ad copy',
  'YouTube Shorts script',
  'Predict performance',
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function nowTime() {
  return new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function agentMsg(content: string, extra?: Partial<ChatMessage>): ChatMessage {
  return { id: makeId('a'), role: 'agent', content, timestamp: nowTime(), ...extra }
}

function systemMsg(content: string): ChatMessage {
  return { id: makeId('s'), role: 'system', content, timestamp: nowTime() }
}

function createGreeting(): ChatMessage {
  return agentMsg(
    "Hi! I'm Advertimus. Tell me about your product and what you want to promote. " +
    "You can also upload reference images using the [+] button so I can match your brand's look and feel."
  )
}

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
  projectName: _projectName = 'New Chat',
  headline = 'lets make the best marketing campaign',
  creditsAvailable = 0,
  onGenerationStart,
  onSendMessage,
}: ChatAreaProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([createGreeting()])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [attachedFiles, setAttachedFiles] = useState<UploadedFile[]>([])

  // Refs keep current values accessible inside setTimeout callbacks (stale closure prevention)
  const messagesRef = useRef<ChatMessage[]>([])
  const stageRef = useRef<FlowStage>('idle')
  const campaignRef = useRef<CampaignConfig>({ ...EMPTY_CAMPAIGN })
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const uploaderRef = useRef<ImageUploaderHandle>(null)

  // Keep refs in sync with state
  useEffect(() => { messagesRef.current = messages }, [messages])

  const hasContent = inputValue.trim().length > 0 || attachedFiles.length > 0
  const isBlocked = isTyping || stageRef.current === 'generating' || stageRef.current === 'complete'
  const canSend = hasContent && !isBlocked
  const isEmpty = messages.length <= 1 && stageRef.current === 'idle'

  // ── Auto-resize textarea ──────────────────────────────────────────────────
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`
  }, [inputValue])

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current)
  }, [])

  // ── Append helpers ────────────────────────────────────────────────────────
  function appendMessages(newMsgs: ChatMessage[]) {
    setMessages(prev => [...prev, ...newMsgs])
  }

  function updateMessage(id: string, patch: Partial<ChatMessage>) {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, ...patch } : m))
  }

  // ── Typing simulation (replace with real streaming in production) ─────────
  function withTyping(delayMs: number, cb: () => void) {
    setIsTyping(true)
    timerRef.current = setTimeout(() => {
      setIsTyping(false)
      cb()
    }, delayMs)
  }

  // ── Ask next MCQ ──────────────────────────────────────────────────────────
  function askMcq(stage: FlowStage) {
    const mcq = MCQ_SEQUENCE.find(m => m.stage === stage)
    if (!mcq) return
    stageRef.current = stage
    withTyping(900, () => {
      appendMessages([
        agentMsg(mcq.question, {
          type: 'options',
          questionId: mcq.questionId,
          options: MCQ_OPTIONS[mcq.questionId],
          selectedOptionId: null,
        }),
      ])
    })
  }

  // ── Build and show campaign summary ──────────────────────────────────────
  function showSummary() {
    stageRef.current = 'summary'
    const c = campaignRef.current
    const baseCost = c.videoLengthCredits
    const imagesCost = c.imagesCredits
    const totalCost = baseCost + imagesCost
    const remaining = Math.max(0, creditsAvailable - totalCost)

    const summary: CampaignSummary = {
      adType:       c.adTypeLabel      ?? '—',
      style:        c.styleLabel       ?? '—',
      format:       c.formatLabel      ?? '—',
      country:      c.countryLabel     ?? '—',
      ratio:        c.ratioLabel       ?? '—',
      videoLength:  c.videoLengthLabel ?? '—',
      images:       c.imagesLabel      ?? '—',
      creditCost:   totalCost,
      creditsRemaining: remaining,
      estimatedTime: '5–12 min',
    }

    withTyping(800, () => {
      appendMessages([
        agentMsg(
          "Here's a summary of your campaign configuration. Review the details and start generation when you're ready.",
          { type: 'summary', summary }
        ),
      ])
    })
  }

  // ── Handle first user message (product description) ───────────────────────
  function handleProductDescription(_text: string) {
    stageRef.current = 'analyzing'
    appendMessages([systemMsg('Analyzing your product…')])

    withTyping(1400, () => {
      stageRef.current = 'concept'
      // Remove the system message, add concept proposal
      setMessages(prev => [
        ...prev.filter(m => m.role !== 'system'),
        agentMsg(
          `Great! Based on what you've shared, here's the campaign concept I'd suggest for your product:\n\n` +
          `The campaign will focus on the core value proposition of your product, using authentic storytelling ` +
          `to connect with your target audience. We'll create content that highlights what makes your product ` +
          `unique and drives conversions.\n\n` +
          `Does this direction work for you?`,
          {
            type: 'concept_approval',
            conceptApprovalState: 'pending',
          }
        ),
      ])
    })
  }

  // ── Handle send ───────────────────────────────────────────────────────────
  const handleSend = useCallback(() => {
    const trimmed = inputValue.trim()
    const hasImages = attachedFiles.length > 0
    if ((!trimmed && !hasImages) || trimmed.length > MAX_INPUT_LENGTH || isBlocked) return

    const userMsg: ChatMessage = {
      id: makeId('u'),
      role: 'user',
      content: trimmed || `${attachedFiles.length} image${attachedFiles.length > 1 ? 's' : ''} uploaded`,
      timestamp: nowTime(),
      images: hasImages ? attachedFiles.map(f => f.previewUrl) : undefined,
    }

    setMessages(prev => [...prev, userMsg])
    setInputValue('')
    uploaderRef.current?.clearFiles()
    onSendMessage?.(trimmed)

    const stage = stageRef.current

    if (stage === 'idle') {
      handleProductDescription(trimmed)
      return
    }

    // Free-text during concept / summary stages — treat as revision request
    if (stage === 'concept' || stage === 'summary') {
      withTyping(1000, () => {
        appendMessages([
          agentMsg("Got it! Let me adjust the concept based on your feedback.", {
            type: 'concept_approval',
            conceptApprovalState: 'pending',
          }),
        ])
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue, attachedFiles, isBlocked, onSendMessage])

  // ── Concept approval ──────────────────────────────────────────────────────
  const handleConceptApproval = useCallback((messageId: string, action: 'approve' | 'revise') => {
    if (action === 'approve') {
      updateMessage(messageId, { conceptApprovalState: 'approved' })
      stageRef.current = 'mcq_1'
      withTyping(600, () => {
        appendMessages([agentMsg("Perfect! Let's set up your campaign. I'll walk you through a few quick choices.")])
        askMcq('mcq_1')
      })
    } else {
      updateMessage(messageId, { conceptApprovalState: 'revising' })
      withTyping(1200, () => {
        appendMessages([
          agentMsg(
            "No problem! Here's an alternative direction — focusing more on the emotional connection your product creates with its users. Would this work better?",
            { type: 'concept_approval', conceptApprovalState: 'pending' }
          ),
        ])
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Option select ─────────────────────────────────────────────────────────
  const handleOptionSelect = useCallback((messageId: string, optionId: string, questionId?: QuestionId) => {
    updateMessage(messageId, { selectedOptionId: optionId })

    const c = campaignRef.current
    const stage = stageRef.current

    if (questionId === 'ad_type') {
      const opt = AD_TYPE_OPTIONS.find(o => o.id === optionId)
      campaignRef.current = { ...c, adTypeId: optionId, adTypeLabel: opt?.title ?? optionId }
    } else if (questionId === 'style') {
      const opt = STYLE_OPTIONS.find(o => o.id === optionId)
      campaignRef.current = { ...c, styleId: optionId, styleLabel: opt?.title ?? optionId }
    } else if (questionId === 'format') {
      const opt = FORMAT_OPTIONS.find(o => o.id === optionId)
      campaignRef.current = { ...c, formatId: optionId, formatLabel: opt?.title ?? optionId }
    } else if (questionId === 'country') {
      const opt = COUNTRY_OPTIONS.find(o => o.id === optionId)
      campaignRef.current = { ...c, countryId: optionId, countryLabel: opt?.title ?? optionId }
    } else if (questionId === 'ratio') {
      const opt = RATIO_OPTIONS.find(o => o.id === optionId)
      campaignRef.current = { ...c, ratioId: optionId, ratioLabel: opt?.title ?? optionId }
    } else if (questionId === 'video_length') {
      const opt = LENGTH_OPTIONS.find(o => o.id === optionId)
      campaignRef.current = {
        ...c,
        videoLengthId: optionId,
        videoLengthLabel: opt?.title ?? optionId,
        videoLengthCredits: opt?.creditCost ?? 0,
      }
    } else if (questionId === 'images') {
      const opt = IMAGES_OPTIONS.find(o => o.id === optionId)
      campaignRef.current = {
        ...c,
        imagesId: optionId,
        imagesLabel: opt?.title ?? optionId,
        imagesCredits: opt?.creditCost ?? 0,
      }
    }

    // Advance to next stage
    const nextStageMap: Partial<Record<FlowStage, FlowStage>> = {
      mcq_1: 'mcq_2', mcq_2: 'mcq_3', mcq_3: 'mcq_4',
      mcq_4: 'mcq_5', mcq_5: 'mcq_6', mcq_6: 'mcq_7',
    }

    if (stage === 'mcq_7') {
      showSummary()
    } else if (nextStageMap[stage]) {
      askMcq(nextStageMap[stage]!)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Summary action ────────────────────────────────────────────────────────
  const handleSummaryAction = useCallback((_messageId: string, action: 'start' | 'edit' | 'cancel') => {
    if (action === 'start') {
      stageRef.current = 'generating'
      appendMessages([systemMsg('Preparing your campaign for generation…')])
      onGenerationStart?.(campaignRef.current)
      withTyping(800, () => {
        appendMessages([
          agentMsg('Your campaign is being generated. You can track the progress in the Results panel on the right.'),
        ])
        stageRef.current = 'complete'
      })
    } else if (action === 'edit') {
      stageRef.current = 'mcq_1'
      campaignRef.current = { ...EMPTY_CAMPAIGN }
      withTyping(600, () => {
        appendMessages([
          agentMsg("Let's go through the choices again. You can change any option."),
        ])
        askMcq('mcq_1')
      })
    } else {
      stageRef.current = 'idle'
      campaignRef.current = { ...EMPTY_CAMPAIGN }
      appendMessages([agentMsg('Campaign cancelled. Feel free to start a new one whenever you\'re ready.')])
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onGenerationStart])

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

  const showEmptyHeadline = isEmpty && messages.length === 1

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">

      {/* ── Message area ─────────────────────────────────────────────────── */}
      {showEmptyHeadline ? (
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
          isTyping={isTyping}
          onOptionSelect={handleOptionSelect}
          onConceptApproval={handleConceptApproval}
          onSummaryAction={handleSummaryAction}
        />
      )}

      {/* ── Input area ───────────────────────────────────────────────────── */}
      <div className="flex-shrink-0 px-4 pb-4 pt-0">

        <ImageUploader
          ref={uploaderRef}
          onFilesChange={setAttachedFiles}
          maxFiles={12}
          maxSizeMB={20}
          disabled={isBlocked}
        />

        <div
          className="max-w-3xl mx-auto rounded-2xl overflow-hidden transition-all duration-200"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: `1px solid ${attachedFiles.length > 0 ? 'rgba(168,85,247,0.3)' : 'rgba(93,26,27,0.3)'}`,
            boxShadow: '0 4px 24px rgba(0,0,0,0.35)',
          }}
        >
          <div className="px-4 pt-3.5 pb-1">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Assign a task or ask anything..."
              rows={1}
              disabled={isBlocked}
              className="w-full bg-transparent text-white text-sm leading-relaxed
                         placeholder-white/22 resize-none outline-none"
              style={{ maxHeight: '120px' }}
              aria-label="Message input"
              aria-multiline="true"
            />
          </div>

          <div className="flex items-center justify-between px-3 pb-3 pt-1">
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => uploaderRef.current?.openPicker()}
                disabled={isBlocked}
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

              <button
                disabled={isBlocked}
                className="w-8 h-8 rounded-lg flex items-center justify-center
                           text-white/22 hover:text-white/50 hover:bg-white/[0.05]
                           transition-all duration-150 disabled:opacity-35 disabled:cursor-not-allowed"
                aria-label="Canvas (coming soon)"
              >
                <IconCanvas />
              </button>

              <button
                disabled={isBlocked}
                className="w-8 h-8 rounded-lg flex items-center justify-center
                           text-white/22 hover:text-white/50 hover:bg-white/[0.05]
                           transition-all duration-150 disabled:opacity-35 disabled:cursor-not-allowed"
                aria-label="Screen share (coming soon)"
              >
                <IconScreen />
              </button>
            </div>

            <div className="flex items-center gap-0.5">
              <button
                disabled={isBlocked}
                className="w-8 h-8 rounded-lg flex items-center justify-center
                           text-white/22 hover:text-white/50 hover:bg-white/[0.05]
                           transition-all duration-150 disabled:opacity-35 disabled:cursor-not-allowed"
                aria-label="History (coming soon)"
              >
                <IconHistory />
              </button>

              <button
                disabled={isBlocked}
                className="w-8 h-8 rounded-lg flex items-center justify-center
                           text-white/22 hover:text-white/50 hover:bg-white/[0.05]
                           transition-all duration-150 disabled:opacity-35 disabled:cursor-not-allowed"
                aria-label="Voice input (coming soon)"
              >
                <IconMic />
              </button>

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

        {/* Quick action chips — shown only in initial empty state */}
        {showEmptyHeadline && (
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

        <p className="text-center mt-2 text-[10px] text-white/12 select-none">
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  )
}
