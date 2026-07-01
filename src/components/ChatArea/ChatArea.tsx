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
import { Paperclip, PenTool, Monitor, Clock, Mic, ArrowUp, Zap, Lightbulb, Type } from 'lucide-react'
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
  { label: 'Create professional ready ad', icon: <Zap size={9} /> },
  { label: 'Get an ad idea',               icon: <Lightbulb size={9} /> },
  { label: 'Get ad caption',               icon: <Type size={9} /> },
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

// ─── Rotating headline ──────────────────────────────────────────────────────────

const HEADLINES = [
  "Let's make the best marketing campaign.",
  'Turn conversations into conversions.',
  'One chat. Complete campaign.',
  'Your AI marketing strategist.',
]

function RotatingHeadline() {
  const [idx, setIdx] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    let swapTimer: ReturnType<typeof setTimeout>
    const cycle = setInterval(() => {
      setVisible(false)
      swapTimer = setTimeout(() => {
        setIdx(i => (i + 1) % HEADLINES.length)
        setVisible(true)
      }, 650)
    }, 4200)
    return () => { clearInterval(cycle); clearTimeout(swapTimer) }
  }, [])

  return (
    <h1
      className="leading-tight"
      style={{
        fontFamily: 'var(--font-heading, Georgia, "Times New Roman", serif)',
        fontSize: 'clamp(27px, 3.6vw, 46px)',
        color: 'rgba(255,255,255,0.95)',
        letterSpacing: '-0.005em',
        fontWeight: 600,
        margin: 0,
        minHeight: '2.4em',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(10px)',
        transition: 'opacity 0.65s ease, transform 0.65s ease',
      }}
    >
      {HEADLINES[idx]}
    </h1>
  )
}

// ─── ChatArea ─────────────────────────────────────────────────────────────────

export function ChatArea({
  projectName: _projectName = 'New Chat',
  creditsAvailable = 0,
  onGenerationStart,
  onSendMessage,
}: ChatAreaProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([createGreeting()])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [attachedFiles, setAttachedFiles] = useState<UploadedFile[]>([])

  const messagesRef = useRef<ChatMessage[]>([])
  const stageRef = useRef<FlowStage>('idle')
  const campaignRef = useRef<CampaignConfig>({ ...EMPTY_CAMPAIGN })
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const uploaderRef = useRef<ImageUploaderHandle>(null)

  useEffect(() => { messagesRef.current = messages }, [messages])

  const hasContent = inputValue.trim().length > 0 || attachedFiles.length > 0
  const isBlocked = isTyping || stageRef.current === 'generating' || stageRef.current === 'complete'
  const canSend = hasContent && !isBlocked
  const isEmpty = messages.length <= 1 && stageRef.current === 'idle'

  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }, [inputValue])

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current)
  }, [])

  function appendMessages(newMsgs: ChatMessage[]) {
    setMessages(prev => [...prev, ...newMsgs])
  }

  function updateMessage(id: string, patch: Partial<ChatMessage>) {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, ...patch } : m))
  }

  function withTyping(delayMs: number, cb: () => void) {
    setIsTyping(true)
    timerRef.current = setTimeout(() => {
      setIsTyping(false)
      cb()
    }, delayMs)
  }

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

  function showSummary() {
    stageRef.current = 'summary'
    const c = campaignRef.current
    const totalCost = c.videoLengthCredits + c.imagesCredits
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

  function handleProductDescription(_text: string) {
    stageRef.current = 'analyzing'
    appendMessages([systemMsg('Analyzing your product…')])

    withTyping(1400, () => {
      stageRef.current = 'concept'
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
        appendMessages([agentMsg("Let's go through the choices again. You can change any option.")])
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

  // ─── Shared UI pieces ─────────────────────────────────────────────────────

  const toolbarIconClass = (active?: boolean) =>
    [
      'w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-150',
      'disabled:opacity-35 disabled:cursor-not-allowed',
      active
        ? 'text-red-500/80 hover:text-red-400 hover:bg-white/[0.08]'
        : 'text-white/30 hover:text-white/60 hover:bg-white/[0.08]',
    ].join(' ')

  const iconBadge = (children: React.ReactNode) => (
    <span className="inline-flex items-center justify-center rounded-md bg-red-500/10 text-red-600 shadow-[0_0_15px_rgba(220,38,38,0.15)] p-1">
      {children}
    </span>
  )

  const sendButton = (
    <button
      onClick={handleSend}
      disabled={!canSend}
      className={[
        'w-9 h-9 rounded-xl flex items-center justify-center ml-1 flex-shrink-0',
        'transition-all duration-200',
        canSend
          ? 'text-white hover:scale-105 active:scale-95'
          : 'text-white/20 cursor-not-allowed',
      ].join(' ')}
      style={
        canSend
          ? {
              background: 'rgba(93,26,27,0.9)',
              boxShadow: '0 0 18px rgba(93,26,27,0.6), 0 2px 8px rgba(93,26,27,0.4)',
            }
          : { background: 'rgba(255,255,255,0.06)' }
      }
      aria-label="Send message"
    >
      <ArrowUp size={15} strokeWidth={2.5} />
    </button>
  )

  const toolbarLeft = (
    <div className="flex items-center gap-0.5">
      <button
        onClick={() => uploaderRef.current?.openPicker()}
        disabled={isBlocked}
        className={toolbarIconClass(attachedFiles.length > 0)}
        aria-label={`Attach images${attachedFiles.length > 0 ? ` (${attachedFiles.length})` : ''}`}
      >
        {iconBadge(<Paperclip size={14} />)}
      </button>
      <button disabled={isBlocked} className={toolbarIconClass()} aria-label="Canvas (coming soon)">
        {iconBadge(<PenTool size={14} />)}
      </button>
      <button disabled={isBlocked} className={toolbarIconClass()} aria-label="Screen share (coming soon)">
        {iconBadge(<Monitor size={14} />)}
      </button>
    </div>
  )

  const toolbarRight = (
    <div className="flex items-center gap-0.5">
      <button disabled={isBlocked} className={toolbarIconClass()} aria-label="History (coming soon)">
        {iconBadge(<Clock size={14} />)}
      </button>
      <button disabled={isBlocked} className={toolbarIconClass()} aria-label="Voice input (coming soon)">
        {iconBadge(<Mic size={14} />)}
      </button>
      {sendButton}
    </div>
  )

  const disclaimer = (
    <p className="text-center mt-4 mb-2 text-[11px] select-none"
       style={{ color: 'rgba(150,150,165,0.55)', letterSpacing: '0.01em' }}>
      Advertimus is AI and can make mistakes. Please double-check responses.
    </p>
  )

  const quickChips = (
    <div className="mt-6 flex flex-wrap gap-3 justify-center">
      {QUICK_ACTIONS.map(({ label, icon }) => (
        <button
          key={label}
          onClick={() => handleQuickAction(label)}
          className="flex items-center gap-2.5 px-5 py-2.5 rounded-full
                     text-sm font-medium text-white/55 hover:text-white/85
                     transition-all duration-150 hover:bg-white/[0.05]"
          style={{ border: '1px solid rgba(93,26,27,0.3)' }}
        >
          <span
            className="inline-flex items-center justify-center rounded-md bg-red-500/10 text-red-600 shadow-[0_0_12px_rgba(220,38,38,0.12)] p-1 flex-shrink-0"
            aria-hidden="true"
          >
            {icon}
          </span>
          {label}
        </button>
      ))}
    </div>
  )

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-full overflow-hidden bg-background">

      {isEmpty ? (

        // ── EMPTY STATE: centered on desktop, top-aligned (below toolbar) on mobile ─
        <div className="flex-1 flex flex-col items-center justify-start sm:justify-center overflow-y-auto px-4 pt-20 sm:pt-0">
          <div className="w-full max-w-2xl py-4 sm:py-8">

            {/* Headline — rotates through campaign taglines */}
            <div className="text-center mb-8 sm:mb-10 select-none">
              <RotatingHeadline />
              <p className="mt-4 text-[13px] sm:text-sm px-4" style={{ color: 'rgba(255,255,255,0.36)' }}>
                Describe your product or idea to get started
              </p>
            </div>

            {/* Image uploader */}
            <ImageUploader
              ref={uploaderRef}
              onFilesChange={setAttachedFiles}
              maxFiles={12}
              maxSizeMB={20}
              disabled={isBlocked}
            />

            {/* Spotlight border — single light chases around the edge when idle */}
            <div className={!isBlocked ? 'chat-border-chase' : ''}
              style={isBlocked ? { borderRadius: 16, border: `1.5px solid rgba(93,26,27,0.3)` } : undefined}
            >
            <div
              className="rounded-2xl overflow-hidden transition-all duration-200"
              style={{
                position: 'relative', zIndex: 1,
                background: '#252525',
                boxShadow: '0 8px 40px rgba(0,0,0,0.55), 0 1px 0 rgba(255,255,255,0.05) inset',
              }}
            >
              <div className="px-5 pt-5 pb-2">
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Describe your product, idea or campaign..."
                  rows={2}
                  disabled={isBlocked}
                  className="w-full bg-transparent text-white text-[15px] leading-relaxed
                             placeholder-white/30 resize-none outline-none"
                  style={{ maxHeight: '160px', minHeight: '52px' }}
                  aria-label="Message input"
                  aria-multiline="true"
                />
              </div>
              <div className="flex items-center justify-between px-4 pb-4 pt-1">
                {toolbarLeft}
                {toolbarRight}
              </div>
            </div>
            </div>{/* /chat-border-chase */}

            {quickChips}
            {disclaimer}
          </div>
        </div>

      ) : (

        // ── ACTIVE STATE: messages list + input pinned at bottom ──────────
        <>
          <MessageList
            messages={messages}
            isTyping={isTyping}
            onOptionSelect={handleOptionSelect}
            onConceptApproval={handleConceptApproval}
            onSummaryAction={handleSummaryAction}
          />

          <div className="flex-shrink-0 px-6 pb-5 pt-0">
            <div className="max-w-2xl mx-auto">
              <ImageUploader
                ref={uploaderRef}
                onFilesChange={setAttachedFiles}
                maxFiles={12}
                maxSizeMB={20}
                disabled={isBlocked}
              />

              {/* Spotlight chases border when agent is typing; plain border otherwise */}
              <div
                className={isTyping ? 'chat-border-chase w-full' : 'w-full'}
                style={!isTyping ? { borderRadius: 16, border: `1px solid ${attachedFiles.length > 0 ? 'rgba(204,41,54,0.4)' : 'rgba(93,26,27,0.4)'}` } : undefined}
              >
                <div
                  className="w-full rounded-2xl overflow-hidden transition-all duration-200"
                  style={{ position: 'relative', zIndex: 1, background: '#252525', boxShadow: '0 4px 24px rgba(0,0,0,0.45)' }}
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
                      className="w-full bg-transparent text-white text-[15px] leading-relaxed
                                 placeholder-white/30 resize-none outline-none"
                      style={{ maxHeight: '120px' }}
                      aria-label="Message input"
                      aria-multiline="true"
                    />
                  </div>
                  <div className="flex items-center justify-between px-3 pb-3 pt-1">
                    {toolbarLeft}
                    {toolbarRight}
                  </div>
                </div>
              </div>{/* /chat-border-chase */}

              {disclaimer}
            </div>
          </div>
        </>

      )}

    </div>
  )
}
