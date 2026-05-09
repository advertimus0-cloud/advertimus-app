'use client'

/**
 * VideoSection — embeds VideoPlayer + video metadata for the ResultsPanel.
 *
 * SECURITY (Rule 18):
 * - `videoUrl` must be a signed, short-lived Supabase Storage URL generated
 *   server-side. This component passes it directly to VideoPlayer without
 *   modification or logging (§8).
 * - PLACEHOLDER_VIDEO is a public test URL (w3schools) used ONLY in development
 *   when no real URL is provided. Must never appear in production builds (§8).
 * - Download/Share stub callbacks must route through authenticated backend
 *   endpoints that re-validate ownership before issuing any signed URL (§8, §16).
 * - No API calls, no auth logic, no secrets in this component (§16).
 */

import React from 'react'
import { VideoPlayer } from '../Common/VideoPlayer'

// Remove this constant before production — replace with real signed URL only (§8)
const PLACEHOLDER_VIDEO = 'https://www.w3schools.com/html/mov_bbb.mp4'

interface VideoMeta {
  duration: string
  quality: string
  format: string
  estimatedTime: string
}

const DEFAULT_META: VideoMeta = {
  duration: '0:30',
  quality: '4K',
  format: '1920×1080 Landscape',
  estimatedTime: '5–8 minutes',
}

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`rounded-lg adv-skeleton ${className}`} />
}

// ─── VideoSection ─────────────────────────────────────────────────────────────

export interface VideoSectionProps {
  isGenerating: boolean
  /** Signed Supabase Storage URL (§8). Falls back to placeholder when absent. */
  videoUrl?: string
  metadata?: Partial<VideoMeta>
}

export function VideoSection({
  isGenerating,
  videoUrl,
  metadata = {},
}: VideoSectionProps) {
  const meta: VideoMeta = { ...DEFAULT_META, ...metadata }
  const src = videoUrl ?? PLACEHOLDER_VIDEO

  const metaItems = [
    { label: 'Duration', value: meta.duration },
    { label: 'Quality', value: meta.quality },
    { label: 'Format', value: meta.format },
    { label: 'Est. gen. time', value: meta.estimatedTime },
  ]

  // ── Skeleton state ──────────────────────────────────────────────────────────
  if (isGenerating) {
    return (
      <div className="space-y-2">
        {/* Video skeleton */}
        <Skeleton className="w-full aspect-video" />
        {/* Controls bar skeleton */}
        <div className="flex items-center gap-2 px-0.5">
          <Skeleton className="w-5 h-5 rounded-full flex-shrink-0" />
          <Skeleton className="flex-1 h-1" />
          <Skeleton className="w-14 h-3 flex-shrink-0" />
        </div>
        {/* Metadata grid skeleton */}
        <div className="grid grid-cols-2 gap-1.5 mt-1">
          {[0, 1, 2, 3].map(i => <Skeleton key={i} className="h-9" />)}
        </div>
      </div>
    )
  }

  // ── Loaded state ────────────────────────────────────────────────────────────
  return (
    <div className="space-y-3">
      {/* Video player */}
      <VideoPlayer
        src={src}
        defaultQuality="4K"
      />

      {/* Metadata grid */}
      <div className="grid grid-cols-2 gap-1.5">
        {metaItems.map(({ label, value }) => (
          <div
            key={label}
            className="rounded-lg px-3 py-2"
            style={{
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(93,26,27,0.2)',
            }}
          >
            <p className="text-[9px] font-bold uppercase tracking-widest text-white/25 mb-0.5">
              {label}
            </p>
            <p className="text-[11px] font-semibold text-white/70 leading-tight">
              {value}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
