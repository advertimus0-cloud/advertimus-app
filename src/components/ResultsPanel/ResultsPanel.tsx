'use client'

/**
 * ResultsPanel — right-side panel that appears when generation begins.
 *
 * Layout (top → bottom):
 *   [Generation Status / Progress]    ← always visible when open
 *   ─────────────────────────────────
 *   Scrollable content:
 *     [Video Section]
 *     [Image Gallery]
 *     [Design Templates]
 *     [Marketing Copy]
 *     [Performance Score]
 *   ─────────────────────────────────
 *   [Action Buttons]                  ← sticky footer
 *
 * BEHAVIOR: Hidden (returns null) when showResults={false}.
 * Slides in from the right on first mount (adv-panel-in CSS animation).
 *
 * SECURITY (Rule 18):
 * - Pure display component — no API calls, no auth logic (§16).
 * - Media URLs in generationData MUST be Supabase signed URLs produced
 *   server-side; never expose raw storage paths to the client (§8).
 * - Download/share actions must invoke authenticated backend endpoints that
 *   re-validate ownership before issuing signed URLs — never direct storage
 *   links (§2, §8, §16).
 * - All text values from generationData rendered as plain React text nodes
 *   (no dangerouslySetInnerHTML) — LLM-generated copy must be sanitized
 *   server-side before storage (§7).
 * - No secrets, tokens, or Supabase calls in this component.
 */

import React, { useState } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface GenerationScore {
  overall: number
  visual: number
  clarity: number
  alignment: number
  cta: number
}

export interface GenerationCopy {
  headline?: string
  captions?: string[]
  strategy?: string
  cta?: string
}

export interface GenerationData {
  /** Supabase signed URL for the generated video (§8) */
  videoUrl?: string
  /** Supabase signed URLs for up to 4 storyboard / product images */
  imagePreviews?: string[]
  /** Which social templates were generated */
  templatePlatforms?: Array<'instagram' | 'facebook' | 'pinterest'>
  copy?: GenerationCopy
  score?: GenerationScore
  /** Human-readable time string — e.g. "3 minutes remaining" */
  estimatedTimeRemaining?: string
  /** Credit cost deducted for this generation */
  creditCost?: number
}

export interface ResultsPanelProps {
  /** When false, panel renders nothing (parent should zero its width or hide the aside) */
  showResults: boolean
  isGenerating: boolean
  /** 0–100 */
  progress?: number
  /** 1–7 matching the n8n phases in the implementation guide */
  currentPhase?: number
  generationData?: GenerationData
}

// ─── Phase definitions ────────────────────────────────────────────────────────

const PHASES = [
  'Analyzing your images',
  'Building brand strategy',
  'Creating storyboard',
  'Generating storyboard visuals',
  'Rendering video',
  'Adding finishing touches',
  'Finalizing your content',
] as const

// ─── Primitives ───────────────────────────────────────────────────────────────

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`rounded-lg adv-skeleton ${className}`} />
}

function SectionDivider() {
  return (
    <div
      className="my-0 h-px"
      style={{ background: 'rgba(93,26,27,0.15)' }}
      aria-hidden="true"
    />
  )
}

// Reusable inline progress bar
function ProgressBar({
  value,
  max = 100,
  color = 'gradient',
  height = 'h-1.5',
}: {
  value: number
  max?: number
  color?: 'gradient' | 'green' | 'amber'
  height?: string
}) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  const bg =
    color === 'green'
      ? '#22c55e'
      : color === 'amber'
      ? '#eab308'
      : 'linear-gradient(90deg, #EC4899 0%, #A855F7 100%)'

  return (
    <div
      className={`w-full ${height} rounded-full overflow-hidden`}
      style={{ background: 'rgba(255,255,255,0.07)' }}
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full rounded-full transition-all duration-700 ease-out"
        style={{ width: `${pct}%`, background: bg }}
      />
    </div>
  )
}

// Section card wrapper — consistent padding, bg, border
function SectionCard({
  title,
  icon,
  children,
  badge,
}: {
  title: string
  icon: string
  children: React.ReactNode
  badge?: string
}) {
  return (
    <section className="px-4 py-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-base select-none" aria-hidden="true">{icon}</span>
          <h3 className="text-sm font-semibold text-white/80 tracking-wide">{title}</h3>
        </div>
        {badge && (
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{
              background: 'rgba(93,26,27,0.3)',
              color: 'rgba(255,255,255,0.5)',
              border: '1px solid rgba(93,26,27,0.3)',
            }}
          >
            {badge}
          </span>
        )}
      </div>
      {children}
    </section>
  )
}

// ─── Generation Status ────────────────────────────────────────────────────────

function GenerationStatus({
  isGenerating,
  progress = 0,
  currentPhase = 1,
  estimatedTime,
}: {
  isGenerating: boolean
  progress?: number
  currentPhase?: number
  estimatedTime?: string
}) {
  if (!isGenerating && progress >= 100) {
    // Complete state
    return (
      <div
        className="px-4 py-4"
        style={{ borderBottom: '1px solid rgba(93,26,27,0.15)' }}
      >
        <div className="flex items-center gap-2.5 mb-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Your content is ready!</p>
            <p className="text-[11px] text-white/35 mt-0.5">All assets generated successfully</p>
          </div>
        </div>
        <ProgressBar value={100} color="green" />
      </div>
    )
  }

  // Generating state
  return (
    <div
      className="px-4 py-4"
      style={{ borderBottom: '1px solid rgba(93,26,27,0.15)' }}
    >
      {/* Title row */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          {/* Spinning ring */}
          <div
            className="w-5 h-5 rounded-full border-2 border-transparent animate-spin flex-shrink-0"
            style={{
              borderTopColor: '#EC4899',
              borderRightColor: 'rgba(168,85,247,0.4)',
            }}
            aria-hidden="true"
          />
          <p className="text-sm font-semibold text-white">
            Creating your content
          </p>
        </div>
        <span
          className="text-sm font-bold tabular-nums"
          style={{ color: '#EC4899' }}
        >
          {Math.round(progress)}%
        </span>
      </div>

      {/* Progress bar */}
      <ProgressBar value={progress} height="h-2" />

      {/* Time estimate */}
      {estimatedTime && (
        <p className="text-[11px] text-white/30 mt-1.5">
          Est. {estimatedTime} remaining
        </p>
      )}

      {/* Phase list */}
      <div className="mt-4 space-y-1.5" role="list" aria-label="Generation phases">
        {PHASES.map((phase, i) => {
          const num = i + 1
          const isDone = num < currentPhase
          const isCurrent = num === currentPhase
          const isPending = num > currentPhase

          return (
            <div
              key={phase}
              className="flex items-center gap-2.5"
              role="listitem"
              aria-label={`Phase ${num}: ${phase}${isDone ? ' — complete' : isCurrent ? ' — in progress' : ' — pending'}`}
            >
              {/* Status icon */}
              <span className="w-4 flex-shrink-0 flex items-center justify-center">
                {isDone && (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                    stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
                {isCurrent && (
                  <div
                    className="w-2.5 h-2.5 rounded-full animate-pulse"
                    style={{ background: '#EC4899' }}
                    aria-hidden="true"
                  />
                )}
                {isPending && (
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: 'rgba(255,255,255,0.12)' }}
                    aria-hidden="true"
                  />
                )}
              </span>

              {/* Phase name */}
              <span
                className={[
                  'text-xs leading-tight',
                  isDone ? 'text-white/55' : isCurrent ? 'text-white font-medium' : 'text-white/25',
                ].join(' ')}
              >
                {phase}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Video Section ────────────────────────────────────────────────────────────

function VideoSection({
  isGenerating,
  videoUrl,
}: {
  isGenerating: boolean
  videoUrl?: string
}) {
  return (
    <SectionCard title="Video Ad" icon="🎬" badge={videoUrl ? undefined : isGenerating ? 'Generating...' : undefined}>
      {isGenerating ? (
        <div className="space-y-2">
          {/* Skeleton video area */}
          <Skeleton className="w-full aspect-video" />
          <div className="flex items-center gap-2 px-1">
            <Skeleton className="w-6 h-6 rounded-full" />
            <Skeleton className="flex-1 h-1.5" />
            <Skeleton className="w-10 h-3" />
          </div>
        </div>
      ) : (
        <div>
          {/* Placeholder video player shell */}
          <div
            className="w-full aspect-video rounded-xl flex flex-col items-center justify-center relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(22,17,66,0.9) 0%, rgba(93,26,27,0.4) 100%)',
              border: '1px solid rgba(93,26,27,0.3)',
            }}
          >
            {/* Play button */}
            <button
              className="w-14 h-14 rounded-full flex items-center justify-center transition-transform
                         duration-200 hover:scale-105 active:scale-95"
              style={{ background: 'linear-gradient(135deg, #EC4899 0%, #A855F7 100%)' }}
              aria-label="Play video (placeholder)"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white" aria-hidden="true">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </button>
            <p className="text-white/25 text-xs mt-3">0:30 · 1920×1080</p>
          </div>

          {/* Controls row */}
          <div className="flex items-center gap-2 mt-2.5">
            <button
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs
                         font-medium text-white/70 hover:text-white transition-colors duration-150"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(93,26,27,0.25)' }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download
            </button>
            <button
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs
                         font-medium text-white/70 hover:text-white transition-colors duration-150"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(93,26,27,0.25)' }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
              Share
            </button>
          </div>
        </div>
      )}
    </SectionCard>
  )
}

// ─── Image Gallery ────────────────────────────────────────────────────────────

function ImageGallerySection({
  isGenerating,
  images,
}: {
  isGenerating: boolean
  images?: string[]
}) {
  return (
    <SectionCard title="Product Images" icon="📸" badge="4 images">
      {isGenerating ? (
        <div className="grid grid-cols-2 gap-2">
          {[0, 1, 2, 3].map(i => (
            <Skeleton key={i} className="aspect-square w-full" />
          ))}
        </div>
      ) : (
        <div>
          {/* 2×2 placeholder grid */}
          <div className="grid grid-cols-2 gap-2">
            {[0, 1, 2, 3].map(i => (
              <div
                key={i}
                className="aspect-square rounded-lg flex items-center justify-center cursor-pointer
                           group transition-all duration-150 hover:brightness-110"
                style={{
                  background: 'linear-gradient(135deg, rgba(22,17,66,0.8) 0%, rgba(93,26,27,0.3) 100%)',
                  border: '1px solid rgba(93,26,27,0.25)',
                }}
                role="img"
                aria-label={`Product image ${i + 1} (placeholder)`}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                  stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round"
                  aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <polyline points="21 15 16 10 5 21" />
                </svg>
              </div>
            ))}
          </div>

          {/* Download all */}
          <button
            className="mt-2.5 w-full flex items-center justify-center gap-1.5 py-2 rounded-lg
                       text-xs font-medium text-white/60 hover:text-white/85 transition-colors duration-150"
            style={{ border: '1px dashed rgba(93,26,27,0.3)' }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download All as ZIP
          </button>
        </div>
      )}
    </SectionCard>
  )
}

// ─── Design Templates ─────────────────────────────────────────────────────────

function DesignTemplatesSection({ isGenerating }: { isGenerating: boolean }) {
  const [activeTab, setActiveTab] = useState<'instagram' | 'facebook' | 'pinterest'>('instagram')
  const tabs = ['instagram', 'facebook', 'pinterest'] as const

  return (
    <SectionCard title="Design Templates" icon="🎨">
      {isGenerating ? (
        <div className="space-y-2.5">
          <div className="flex gap-2">
            {[0, 1, 2].map(i => <Skeleton key={i} className="h-7 flex-1 rounded-lg" />)}
          </div>
          <Skeleton className="h-36 w-full" />
        </div>
      ) : (
        <div>
          {/* Platform tabs */}
          <div className="flex gap-1.5 mb-3" role="tablist" aria-label="Design template platform">
            {tabs.map(tab => (
              <button
                key={tab}
                role="tab"
                aria-selected={activeTab === tab}
                onClick={() => setActiveTab(tab)}
                className={[
                  'flex-1 py-1.5 rounded-lg text-[11px] font-medium capitalize transition-all duration-150',
                  activeTab === tab
                    ? 'text-white'
                    : 'text-white/35 hover:text-white/60',
                ].join(' ')}
                style={
                  activeTab === tab
                    ? {
                        background: 'linear-gradient(135deg, rgba(93,26,27,0.5) 0%, rgba(22,17,66,0.5) 100%)',
                        border: '1px solid rgba(93,26,27,0.5)',
                      }
                    : {
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(93,26,27,0.18)',
                      }
                }
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Template preview placeholder */}
          <div
            className="rounded-xl flex items-center justify-center"
            style={{
              aspectRatio: activeTab === 'instagram' ? '1 / 1' : activeTab === 'facebook' ? '16 / 9' : '2 / 3',
              background: 'linear-gradient(135deg, rgba(22,17,66,0.7) 0%, rgba(93,26,27,0.3) 100%)',
              border: '1px solid rgba(93,26,27,0.25)',
            }}
            role="img"
            aria-label={`${activeTab} template preview (placeholder)`}
          >
            <p className="text-white/20 text-xs capitalize">{activeTab} template</p>
          </div>

          {/* Edit in Canva button */}
          <button
            className="mt-2.5 w-full flex items-center justify-center gap-1.5 py-2 rounded-lg
                       text-xs font-medium text-white/60 hover:text-white/85 transition-colors duration-150"
            style={{ border: '1px solid rgba(93,26,27,0.28)' }}
          >
            🎨 Edit in Canva
          </button>
        </div>
      )}
    </SectionCard>
  )
}

// ─── Marketing Copy ───────────────────────────────────────────────────────────

function MarketingCopySection({
  isGenerating,
  copy,
}: {
  isGenerating: boolean
  copy?: GenerationCopy
}) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    // Placeholder — real copy will use navigator.clipboard with sanitized text
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <SectionCard title="Marketing Copy" icon="📝">
      {isGenerating ? (
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
          <Skeleton className="h-3 w-5/6 mt-2" />
        </div>
      ) : (
        <div className="space-y-3">
          {/* Headline */}
          <div
            className="rounded-lg p-3"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(93,26,27,0.2)' }}
          >
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-1">
              Headline
            </p>
            <p className="text-sm font-semibold text-white leading-snug">
              {copy?.headline ?? 'Timeless craftsmanship in every stitch'}
            </p>
          </div>

          {/* Caption */}
          <div
            className="rounded-lg p-3"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(93,26,27,0.2)' }}
          >
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-1">
              Caption
            </p>
            <p className="text-xs text-white/65 leading-relaxed">
              {copy?.captions?.[0] ?? 'Crafted for those who appreciate the details. Our leather wallets are built to last a lifetime — and look better with every year.'}
            </p>
          </div>

          {/* CTA */}
          {copy?.cta && (
            <div
              className="rounded-lg p-3"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(93,26,27,0.2)' }}
            >
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-1">CTA</p>
              <p className="text-xs text-white/65">{copy.cta}</p>
            </div>
          )}

          {/* Copy button */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70
                       transition-colors duration-150"
          >
            {copied ? (
              <>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#22c55e"
                  strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span style={{ color: '#22c55e' }}>Copied!</span>
              </>
            ) : (
              <>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                Copy all to clipboard
              </>
            )}
          </button>
        </div>
      )}
    </SectionCard>
  )
}

// ─── Performance Score ────────────────────────────────────────────────────────

function ScoreBar({
  label,
  value,
}: {
  label: string
  value: number
}) {
  const color =
    value >= 88 ? 'green' : value >= 75 ? 'gradient' : 'amber'

  return (
    <div className="flex items-center gap-3">
      <span className="text-[11px] text-white/45 w-[110px] flex-shrink-0 leading-tight">{label}</span>
      <div className="flex-1">
        <ProgressBar value={value} color={color} height="h-1.5" />
      </div>
      <span
        className="text-[11px] font-semibold w-[38px] text-right tabular-nums flex-shrink-0"
        style={{
          color:
            value >= 88 ? '#22c55e' : value >= 75 ? '#EC4899' : '#eab308',
        }}
      >
        {value}/100
      </span>
    </div>
  )
}

function PerformanceSection({
  isGenerating,
  score,
}: {
  isGenerating: boolean
  score?: GenerationScore
}) {
  const s = score ?? {
    overall: 0,
    visual: 0,
    clarity: 0,
    alignment: 0,
    cta: 0,
  }

  const metrics = [
    { label: 'Overall', value: s.overall },
    { label: 'Visual Appeal', value: s.visual },
    { label: 'Message Clarity', value: s.clarity },
    { label: 'Audience Alignment', value: s.alignment },
    { label: 'Call to Action', value: s.cta },
  ]

  return (
    <SectionCard title="Performance Score" icon="📊">
      {isGenerating ? (
        <div className="space-y-3">
          {metrics.map(({ label }) => (
            <div key={label} className="flex items-center gap-3">
              <Skeleton className="w-[110px] h-3 flex-shrink-0" />
              <Skeleton className="flex-1 h-1.5" />
              <Skeleton className="w-8 h-3 flex-shrink-0" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {metrics.map(({ label, value }) => (
            <ScoreBar key={label} label={label} value={value} />
          ))}
        </div>
      )}
    </SectionCard>
  )
}

// ─── Action Buttons ───────────────────────────────────────────────────────────

function ActionButtons({
  isGenerating,
  creditCost,
}: {
  isGenerating: boolean
  creditCost?: number
}) {
  return (
    <div
      className="flex-shrink-0 px-4 py-4 space-y-2"
      style={{ borderTop: '1px solid rgba(93,26,27,0.15)' }}
    >
      {/* Primary: Download All */}
      <button
        disabled={isGenerating}
        className={[
          'w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold',
          'text-white transition-all duration-200',
          isGenerating ? 'opacity-35 cursor-not-allowed' : 'hover:opacity-90 active:scale-[0.99]',
        ].join(' ')}
        style={{ background: 'linear-gradient(135deg, #EC4899 0%, #A855F7 100%)' }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        Download All
      </button>

      {/* Secondary row */}
      <div className="grid grid-cols-3 gap-1.5">
        {[
          { label: 'Save', icon: '💾' },
          { label: 'Share', icon: '🔗' },
          { label: 'Edit Style', icon: '🎨' },
        ].map(({ label, icon }) => (
          <button
            key={label}
            disabled={isGenerating}
            className={[
              'flex flex-col items-center gap-1 py-2.5 rounded-xl text-[11px] font-medium',
              'text-white/50 transition-all duration-150',
              isGenerating ? 'opacity-35 cursor-not-allowed' : 'hover:text-white/80 hover:bg-white/[0.05]',
            ].join(' ')}
            style={{ border: '1px solid rgba(93,26,27,0.22)' }}
          >
            <span className="text-base select-none" aria-hidden="true">{icon}</span>
            {label}
          </button>
        ))}
      </div>

      {/* Regenerate */}
      <button
        disabled={isGenerating}
        className={[
          'w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium',
          'text-white/35 transition-all duration-150',
          isGenerating ? 'opacity-35 cursor-not-allowed' : 'hover:text-white/60 hover:bg-white/[0.04]',
        ].join(' ')}
        style={{ border: '1px dashed rgba(93,26,27,0.25)' }}
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
          <polyline points="23 4 23 10 17 10" />
          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
        </svg>
        Regenerate
        {creditCost && (
          <span className="text-[10px] text-white/22 ml-0.5">
            ({creditCost} credits)
          </span>
        )}
      </button>
    </div>
  )
}

// ─── ResultsPanel ─────────────────────────────────────────────────────────────

export function ResultsPanel({
  showResults,
  isGenerating,
  progress = 0,
  currentPhase = 1,
  generationData,
}: ResultsPanelProps) {
  if (!showResults) return null

  const isComplete = !isGenerating && progress >= 100

  return (
    <div
      className="h-full flex flex-col bg-background overflow-hidden adv-panel-in"
      aria-label="Generation results"
      role="complementary"
    >
      {/* ── Generation status (sticky top) ──────────────────────────────── */}
      <GenerationStatus
        isGenerating={isGenerating}
        progress={progress}
        currentPhase={currentPhase}
        estimatedTime={generationData?.estimatedTimeRemaining}
      />

      {/* ── Scrollable sections ──────────────────────────────────────────── */}
      <div
        className="flex-1 overflow-y-auto divide-y"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(93,26,27,0.25) transparent',
          borderColor: 'rgba(93,26,27,0.12)',
        }}
      >
        <VideoSection isGenerating={isGenerating} videoUrl={generationData?.videoUrl} />
        <SectionDivider />
        <ImageGallerySection isGenerating={isGenerating} images={generationData?.imagePreviews} />
        <SectionDivider />
        <DesignTemplatesSection isGenerating={isGenerating} />
        <SectionDivider />
        <MarketingCopySection isGenerating={isGenerating} copy={generationData?.copy} />
        <SectionDivider />
        <PerformanceSection isGenerating={isGenerating} score={isComplete ? generationData?.score : undefined} />
      </div>

      {/* ── Action buttons (sticky footer) ──────────────────────────────── */}
      <ActionButtons isGenerating={isGenerating} creditCost={20} />
    </div>
  )
}
