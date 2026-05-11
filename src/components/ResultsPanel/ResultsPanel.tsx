'use client'

/**
 * ResultsPanel — right-side panel that reveals when generation begins.
 *
 * SECURITY (Rule 18):
 * - Pure display component — no API calls, no auth logic (§16).
 * - Media URLs must be signed, short-lived Supabase Storage URLs (§8).
 * - Download/Share invoke backend endpoints that re-validate ownership (§8, §16).
 * - All text from generationData rendered as plain React text nodes (§7).
 * - No secrets, tokens, or Supabase calls in this component.
 */

import React, { useState } from 'react'
import {
  Loader2,
  Check,
  Play,
  Eye,
  Download,
  RefreshCw,
  Save,
  Link,
  Palette,
} from 'lucide-react'
import { ImageGallery } from './ImageGallery'

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

export interface VideoCardData {
  id: string
  format: string
  duration: string
  displayTime: string
  title: string
  score: number
  resolution: string
  videoUrl?: string
  thumbnailUrl?: string
}

export interface GenerationData {
  videos?: VideoCardData[]
  imagePreviews?: string[]
  templatePlatforms?: Array<'instagram' | 'facebook' | 'pinterest'>
  copy?: GenerationCopy
  score?: GenerationScore
  estimatedTimeRemaining?: string
  creditCost?: number
}

export interface ResultsPanelProps {
  showResults: boolean
  isGenerating: boolean
  progress?: number
  currentPhase?: number
  generationData?: GenerationData
}

type TabId = 'all' | 'videos' | 'images' | 'scores'

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
      : 'linear-gradient(90deg, #5d1a1b 0%, #161142 100%)'

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
  if (!isGenerating && progress >= 100) return null

  return (
    <div className="px-4 py-4">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <Loader2
            size={16}
            className="animate-spin flex-shrink-0"
            style={{ color: 'rgba(93,26,27,0.9)' }}
            aria-hidden="true"
          />
          <p className="text-xs font-semibold text-white/80">Creating your content</p>
        </div>
        <span className="text-xs font-bold tabular-nums" style={{ color: 'rgba(255,255,255,0.75)' }}>
          {Math.round(progress)}%
        </span>
      </div>

      <ProgressBar value={progress} height="h-1.5" />

      {estimatedTime && (
        <p className="text-[10px] text-white/28 mt-1.5">Est. {estimatedTime} remaining</p>
      )}

      <div className="mt-3 space-y-1.5" role="list">
        {PHASES.map((phase, i) => {
          const num = i + 1
          const isDone = num < currentPhase
          const isCurrent = num === currentPhase

          return (
            <div key={phase} className="flex items-center gap-2" role="listitem">
              <span className="w-3.5 flex-shrink-0 flex items-center justify-center">
                {isDone && <Check size={10} color="#22c55e" aria-hidden="true" />}
                {isCurrent && (
                  <div className="w-2 h-2 rounded-full animate-pulse"
                    style={{ background: 'rgba(93,26,27,0.9)' }} aria-hidden="true" />
                )}
                {!isDone && !isCurrent && (
                  <div className="w-1.5 h-1.5 rounded-full"
                    style={{ background: 'rgba(255,255,255,0.1)' }} aria-hidden="true" />
                )}
              </span>
              <span className={[
                'text-[10px] leading-tight',
                isDone ? 'text-white/40' : isCurrent ? 'text-white/80 font-medium' : 'text-white/20',
              ].join(' ')}>
                {phase}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── VideoCard ────────────────────────────────────────────────────────────────

function VideoCard({ video }: { video: VideoCardData }) {
  const scoreColor = video.score >= 90 ? '#22c55e' : video.score >= 80 ? 'rgba(255,255,255,0.75)' : '#eab308'
  const scoreBg =
    video.score >= 90
      ? 'rgba(34,197,94,0.12)'
      : video.score >= 80
      ? 'rgba(255,255,255,0.06)'
      : 'rgba(234,179,8,0.12)'
  const scoreBorder =
    video.score >= 90
      ? 'rgba(34,197,94,0.25)'
      : video.score >= 80
      ? 'rgba(255,255,255,0.12)'
      : 'rgba(234,179,8,0.25)'

  return (
    <div>
      <div className="flex items-center justify-between mb-2 px-0.5">
        <span className="text-[10px] font-semibold text-white/40 tracking-wide">
          {video.format} · {video.duration}
        </span>
        <span className="text-[10px] text-white/28 tabular-nums">{video.displayTime}</span>
      </div>

      <div
        className="rounded-xl overflow-hidden transition-all duration-200 hover:border-opacity-60"
        style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(93,26,27,0.3)',
        }}
      >
        <div className="flex">
          {/* Thumbnail */}
          <div
            className="w-28 flex-shrink-0 flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(22,17,66,0.95) 0%, rgba(93,26,27,0.5) 100%)',
              minHeight: 88,
            }}
          >
            <button
              className="w-9 h-9 rounded-full flex items-center justify-center
                         transition-transform duration-200 hover:scale-110 active:scale-95"
              style={{
                background: 'rgba(93,26,27,0.22)',
                border: '1px solid rgba(93,26,27,0.42)',
              }}
              aria-label={`Play ${video.title}`}
            >
              <span className="inline-flex items-center justify-center rounded-md bg-red-500/10 text-red-600 shadow-[0_0_15px_rgba(220,38,38,0.15)] p-1" aria-hidden="true">
              <Play size={12} />
            </span>
            </button>
          </div>

          {/* Metadata */}
          <div className="flex-1 px-3 py-2.5 flex flex-col justify-between min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <p className="text-xs font-semibold text-white/85 leading-snug truncate">
                {video.title}
              </p>
              <span
                className="flex-shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-md tabular-nums"
                style={{ background: scoreBg, color: scoreColor, border: `1px solid ${scoreBorder}` }}
              >
                +{video.score}
              </span>
            </div>

            <p className="text-[10px] text-white/28 mb-2">{video.resolution}</p>

            <div className="flex items-center gap-1.5">
              <button
                className="flex-1 flex items-center justify-center gap-1 py-1 rounded-lg
                           text-[10px] font-medium text-white/55 hover:text-white/85
                           transition-colors duration-150"
                style={{ border: '1px solid rgba(93,26,27,0.3)' }}
                aria-label={`Preview ${video.title}`}
              >
                <span className="inline-flex items-center justify-center rounded bg-red-500/10 text-red-600 shadow-[0_0_15px_rgba(220,38,38,0.15)] p-0.5">
                  <Eye size={10} />
                </span>
                Preview
              </button>
              <button
                className="flex-1 flex items-center justify-center gap-1 py-1 rounded-lg
                           text-[10px] font-semibold text-white
                           transition-all duration-150 hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #5d1a1b 0%, #161142 100%)' }}
                aria-label={`Download ${video.title}`}
              >
                <Download size={10} />
                Download
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Score bar ────────────────────────────────────────────────────────────────

function ScoreBar({ label, value }: { label: string; value: number }) {
  const color = value >= 88 ? 'green' : value >= 75 ? 'gradient' : 'amber'
  const numColor = value >= 88 ? '#22c55e' : value >= 75 ? 'rgba(255,255,255,0.75)' : '#eab308'

  return (
    <div className="flex items-center gap-3">
      <span className="text-[11px] text-white/42 w-[110px] flex-shrink-0">{label}</span>
      <div className="flex-1">
        <ProgressBar value={value} color={color} height="h-1.5" />
      </div>
      <span
        className="text-[11px] font-bold w-10 text-right tabular-nums flex-shrink-0"
        style={{ color: numColor }}
      >
        {value}
      </span>
    </div>
  )
}

// ─── Tab content sections ─────────────────────────────────────────────────────

function VideoListSection({ isGenerating, videos = [] }: { isGenerating: boolean; videos?: VideoCardData[] }) {
  if (isGenerating) {
    return (
      <div className="space-y-4">
        {[0, 1].map(i => (
          <div key={i}>
            <div className="flex justify-between mb-2">
              <Skeleton className="w-28 h-3" />
              <Skeleton className="w-8 h-3" />
            </div>
            <div className="rounded-xl overflow-hidden flex" style={{ border: '1px solid rgba(93,26,27,0.22)' }}>
              <Skeleton className="w-28 h-[88px] flex-shrink-0 rounded-none" />
              <div className="flex-1 p-3 space-y-2">
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-2.5 w-1/2" />
                <div className="flex gap-1.5 pt-1">
                  <Skeleton className="flex-1 h-6 rounded-lg" />
                  <Skeleton className="flex-1 h-6 rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-[9px] font-bold tracking-[0.14em] uppercase text-white/30">
          Videos · {videos.length} generated
        </span>
      </div>
      {videos.length === 0 ? (
        <p className="text-xs text-white/28 text-center py-4">No videos yet</p>
      ) : (
        videos.map(v => <VideoCard key={v.id} video={v} />)
      )}
    </div>
  )
}

function ImageSection({ isGenerating, images }: { isGenerating: boolean; images?: string[] }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[9px] font-bold tracking-[0.14em] uppercase text-white/30">
          Images · {images?.length ?? 4} generated
        </span>
        {!isGenerating && (
          <div className="flex gap-2">
            <button className="text-[10px] text-white/40 hover:text-white/70 transition-colors">
              Select all
            </button>
            <button
              className="text-[10px] font-semibold transition-all hover:opacity-85"
              style={{ color: 'rgba(255,255,255,0.65)' }}
            >
              Download all
            </button>
          </div>
        )}
      </div>
      <ImageGallery isGenerating={isGenerating} images={images} showCanvaButton />
    </div>
  )
}

function ScoresSection({ isGenerating, score }: { isGenerating: boolean; score?: GenerationScore }) {
  const s = score ?? { overall: 0, visual: 0, clarity: 0, alignment: 0, cta: 0 }

  const metrics = [
    { label: 'Overall',            value: s.overall   },
    { label: 'Visual Appeal',      value: s.visual    },
    { label: 'Message Clarity',    value: s.clarity   },
    { label: 'Audience Alignment', value: s.alignment },
    { label: 'Call to Action',     value: s.cta       },
  ]

  return (
    <div>
      <span className="text-[9px] font-bold tracking-[0.14em] uppercase text-white/30">
        Performance prediction
      </span>

      {isGenerating ? (
        <div className="space-y-3 mt-3">
          {metrics.map(({ label }) => (
            <div key={label} className="flex items-center gap-3">
              <Skeleton className="w-[110px] h-2.5 flex-shrink-0" />
              <Skeleton className="flex-1 h-1.5" />
              <Skeleton className="w-8 h-2.5 flex-shrink-0" />
            </div>
          ))}
        </div>
      ) : score ? (
        <div className="space-y-3 mt-3">
          {metrics.map(({ label, value }) => (
            <ScoreBar key={label} label={label} value={value} />
          ))}
        </div>
      ) : (
        <p className="text-xs text-white/28 text-center py-4 mt-3">Scores will appear after generation</p>
      )}
    </div>
  )
}

// ─── Action buttons ───────────────────────────────────────────────────────────

function ActionButtons({ isGenerating }: { isGenerating: boolean }) {
  return (
    <div
      className="flex-shrink-0 px-4 py-3 space-y-2"
      style={{ borderTop: '1px solid rgba(93,26,27,0.15)' }}
    >
      <button
        disabled={isGenerating}
        className={[
          'w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white',
          'transition-all duration-200',
          isGenerating ? 'opacity-30 cursor-not-allowed' : 'hover:opacity-90 active:scale-[0.99]',
        ].join(' ')}
        style={{ background: 'linear-gradient(135deg, #5d1a1b 0%, #161142 100%)' }}
      >
        <Download size={13} />
        Download All
      </button>

      <div className="grid grid-cols-3 gap-1.5">
        {[
          { label: 'Save',       icon: <span className="inline-flex items-center justify-center rounded-md bg-red-500/10 text-red-600 shadow-[0_0_15px_rgba(220,38,38,0.15)] p-1"><Save    size={13} /></span> },
          { label: 'Share',      icon: <span className="inline-flex items-center justify-center rounded-md bg-red-500/10 text-red-600 shadow-[0_0_15px_rgba(220,38,38,0.15)] p-1"><Link    size={13} /></span> },
          { label: 'Edit Style', icon: <span className="inline-flex items-center justify-center rounded-md bg-red-500/10 text-red-600 shadow-[0_0_15px_rgba(220,38,38,0.15)] p-1"><Palette size={13} /></span> },
        ].map(({ label, icon }) => (
          <button
            key={label}
            disabled={isGenerating}
            className={[
              'flex flex-col items-center gap-1.5 py-2.5 rounded-xl text-[11px] font-medium',
              'text-white/45 transition-all duration-150',
              isGenerating
                ? 'opacity-30 cursor-not-allowed'
                : 'hover:text-white/75 hover:bg-white/[0.04]',
            ].join(' ')}
            style={{ border: '1px solid rgba(93,26,27,0.2)' }}
          >
            <span aria-hidden="true">{icon}</span>
            {label}
          </button>
        ))}
      </div>

      <button
        disabled={isGenerating}
        className={[
          'w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium',
          'text-white/28 transition-all duration-150',
          isGenerating
            ? 'opacity-30 cursor-not-allowed'
            : 'hover:text-white/55 hover:bg-white/[0.04]',
        ].join(' ')}
        style={{ border: '1px dashed rgba(93,26,27,0.22)' }}
      >
        <span className="inline-flex items-center justify-center rounded-md bg-red-500/10 text-red-600 shadow-[0_0_15px_rgba(220,38,38,0.15)] p-1">
          <RefreshCw size={11} />
        </span>
        Regenerate (20 credits)
      </button>
    </div>
  )
}

// ─── Tab navigation ───────────────────────────────────────────────────────────

const TABS: Array<{ id: TabId; label: string }> = [
  { id: 'all',    label: 'All'    },
  { id: 'videos', label: 'Videos' },
  { id: 'images', label: 'Images' },
  { id: 'scores', label: 'Scores' },
]

// ─── ResultsPanel ─────────────────────────────────────────────────────────────

export function ResultsPanel({
  showResults,
  isGenerating,
  progress = 0,
  currentPhase = 1,
  generationData,
}: ResultsPanelProps) {
  const [activeTab, setActiveTab] = useState<TabId>('all')

  if (!showResults) return null

  const isComplete = !isGenerating && progress >= 100
  const videoCount = generationData?.videos?.length ?? 0
  const imageCount = generationData?.imagePreviews?.length ?? 0
  const assetCount = videoCount + imageCount

  return (
    <div
      className="h-full flex flex-col bg-background overflow-hidden adv-panel-in"
      aria-label="Generated assets panel"
      role="complementary"
    >
      {/* ── Panel header ────────────────────────────────────────────────── */}
      <div
        className="flex-shrink-0 px-4 pt-4 pb-3"
        style={{ borderBottom: '1px solid rgba(93,26,27,0.15)' }}
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-white/85 tracking-wide">
            Generated assets
          </h2>
          {isComplete && (
            <span
              className="text-[10px] font-bold px-2.5 py-1 rounded-full"
              style={{
                background: 'rgba(34,197,94,0.14)',
                color: '#22c55e',
                border: '1px solid rgba(34,197,94,0.28)',
              }}
            >
              {assetCount} assets ready
            </span>
          )}
          {isGenerating && (
            <span
              className="text-[10px] font-bold px-2.5 py-1 rounded-full"
              style={{
                background: 'rgba(93,26,27,0.12)',
                color: 'rgba(255,255,255,0.65)',
                border: '1px solid rgba(93,26,27,0.28)',
              }}
            >
              Generating...
            </span>
          )}
        </div>

        <div className="flex gap-1" role="tablist" aria-label="Asset filters">
          {TABS.map(tab => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.id)}
                className={[
                  'flex-1 py-1.5 rounded-lg text-[11px] font-medium transition-all duration-150',
                  isActive ? 'text-white' : 'text-white/35 hover:text-white/60',
                ].join(' ')}
                style={
                  isActive
                    ? {
                        background:
                          'linear-gradient(135deg, rgba(93,26,27,0.45) 0%, rgba(22,17,66,0.45) 100%)',
                        border: '1px solid rgba(93,26,27,0.48)',
                      }
                    : {
                        background: 'rgba(255,255,255,0.025)',
                        border: '1px solid rgba(93,26,27,0.16)',
                      }
                }
              >
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Scrollable content ───────────────────────────────────────────── */}
      <div
        className="flex-1 overflow-y-auto px-4 py-4 space-y-6 min-h-0"
        style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(93,26,27,0.2) transparent' }}
      >
        {isGenerating && (
          <GenerationStatus
            isGenerating={isGenerating}
            progress={progress}
            currentPhase={currentPhase}
            estimatedTime={generationData?.estimatedTimeRemaining}
          />
        )}

        {isComplete && (
          <div
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl"
            style={{
              background: 'rgba(34,197,94,0.08)',
              border: '1px solid rgba(34,197,94,0.2)',
            }}
          >
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(34,197,94,0.2)' }}
            >
              <Check size={11} color="#22c55e" aria-hidden="true" />
            </div>
            <p className="text-xs font-semibold" style={{ color: '#22c55e' }}>
              Your content is ready!
            </p>
          </div>
        )}

        {(activeTab === 'all' || activeTab === 'videos') && (
          <VideoListSection isGenerating={isGenerating} videos={generationData?.videos} />
        )}

        {activeTab === 'all' && (
          <div className="h-px" style={{ background: 'rgba(93,26,27,0.12)' }} />
        )}

        {(activeTab === 'all' || activeTab === 'images') && (
          <ImageSection
            isGenerating={isGenerating}
            images={generationData?.imagePreviews}
          />
        )}

        {activeTab === 'all' && (
          <div className="h-px" style={{ background: 'rgba(93,26,27,0.12)' }} />
        )}

        {(activeTab === 'all' || activeTab === 'scores') && (
          <ScoresSection
            isGenerating={isGenerating}
            score={isComplete ? generationData?.score : undefined}
          />
        )}
      </div>

      {/* ── Action buttons (sticky footer) ───────────────────────────────── */}
      <ActionButtons isGenerating={isGenerating} />
    </div>
  )
}
