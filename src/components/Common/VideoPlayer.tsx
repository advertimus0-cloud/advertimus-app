'use client'

/**
 * VideoPlayer — reusable HTML5 video player with custom controls.
 *
 * SECURITY (Rule 18):
 * - `src` must be a signed, short-lived Supabase Storage URL produced server-side.
 *   This component never constructs, modifies, or logs media URLs (§8).
 * - Download and Share are UI stubs — real implementation MUST call authenticated
 *   backend endpoints that re-validate ownership before issuing a signed URL (§8, §16).
 * - Quality switching is UI-only; the parent provides a URL per quality level and
 *   calls `onQualityChange` to swap `src`.
 * - No API calls, no auth logic, no secrets in this component (§16).
 */

import React, { useRef, useState, useEffect, useCallback } from 'react'
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Download,
  Share2,
  Maximize,
  Minimize,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface VideoPlayerProps {
  src: string
  poster?: string
  defaultQuality?: Quality
  onQualityChange?: (q: Quality) => void
  onDownload?: () => void
  onShare?: () => void
  className?: string
}

type Quality = '720p' | '1080p' | '4K'
const QUALITIES: Quality[] = ['720p', '1080p', '4K']

function formatTime(sec: number): string {
  if (!isFinite(sec) || sec < 0) return '0:00'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

// ─── VideoPlayer ──────────────────────────────────────────────────────────────

export function VideoPlayer({
  src,
  poster,
  defaultQuality = '4K',
  onQualityChange,
  onDownload,
  onShare,
  className = '',
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [quality, setQuality] = useState<Quality>(defaultQuality)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [showQualityMenu, setShowQualityMenu] = useState(false)
  const [isBuffering, setIsBuffering] = useState(false)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return

    const onPlay = () => setIsPlaying(true)
    const onPause = () => { setIsPlaying(false); setShowControls(true) }
    const onTimeUpdate = () => setCurrentTime(v.currentTime)
    const onDurationChange = () => { if (isFinite(v.duration)) setDuration(v.duration) }
    const onVolumeChange = () => { setVolume(v.volume); setIsMuted(v.muted) }
    const onWaiting = () => setIsBuffering(true)
    const onCanPlay = () => setIsBuffering(false)
    const onEnded = () => { setIsPlaying(false); setShowControls(true) }

    v.addEventListener('play', onPlay)
    v.addEventListener('pause', onPause)
    v.addEventListener('timeupdate', onTimeUpdate)
    v.addEventListener('durationchange', onDurationChange)
    v.addEventListener('volumechange', onVolumeChange)
    v.addEventListener('waiting', onWaiting)
    v.addEventListener('canplay', onCanPlay)
    v.addEventListener('ended', onEnded)

    return () => {
      v.removeEventListener('play', onPlay)
      v.removeEventListener('pause', onPause)
      v.removeEventListener('timeupdate', onTimeUpdate)
      v.removeEventListener('durationchange', onDurationChange)
      v.removeEventListener('volumechange', onVolumeChange)
      v.removeEventListener('waiting', onWaiting)
      v.removeEventListener('canplay', onCanPlay)
      v.removeEventListener('ended', onEnded)
    }
  }, [])

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onFsChange)
    return () => document.removeEventListener('fullscreenchange', onFsChange)
  }, [])

  useEffect(() => () => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
  }, [])

  const resetHideTimer = useCallback(() => {
    setShowControls(true)
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    hideTimerRef.current = setTimeout(() => {
      if (videoRef.current && !videoRef.current.paused) setShowControls(false)
    }, 2500)
  }, [])

  const togglePlay = useCallback(() => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) { v.play() } else { v.pause() }
  }, [])

  function handleVolumeChange(val: number) {
    const v = videoRef.current
    if (!v) return
    v.volume = val
    v.muted = val === 0
  }

  function toggleMute() {
    const v = videoRef.current
    if (!v) return
    if (v.muted || v.volume === 0) {
      v.muted = false
      if (v.volume === 0) v.volume = 0.5
    } else {
      v.muted = true
    }
  }

  function handleSeek(val: number) {
    const v = videoRef.current
    if (!v || !isFinite(v.duration)) return
    v.currentTime = val
    setCurrentTime(val)
  }

  async function toggleFullscreen() {
    const el = containerRef.current
    if (!el) return
    if (!document.fullscreenElement) {
      await el.requestFullscreen().catch(() => null)
    } else {
      await document.exitFullscreen().catch(() => null)
    }
  }

  function selectQuality(q: Quality) {
    setQuality(q)
    setShowQualityMenu(false)
    onQualityChange?.(q)
  }

  const displayVolume = isMuted ? 0 : volume

  return (
    <div
      ref={containerRef}
      className={`relative rounded-xl overflow-hidden bg-black select-none ${className}`}
      onMouseMove={resetHideTimer}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => {
        if (videoRef.current && !videoRef.current.paused) setShowControls(false)
      }}
    >
      {/* ── Video element ─────────────────────────────────────────────────── */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full aspect-video object-contain cursor-pointer"
        onClick={togglePlay}
        preload="metadata"
        playsInline
        aria-label="Generated video ad"
      />

      {/* ── Buffering spinner ─────────────────────────────────────────────── */}
      {isBuffering && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          aria-hidden="true"
        >
          <div
            className="w-10 h-10 rounded-full border-2 border-transparent animate-spin"
            style={{
              borderTopColor: 'rgba(93,26,27,0.9)',
              borderRightColor: 'rgba(22,17,66,0.4)',
            }}
          />
        </div>
      )}

      {/* ── Center play overlay (paused state) ───────────────────────────── */}
      {!isPlaying && !isBuffering && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          aria-hidden="true"
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center opacity-90"
            style={{ background: 'linear-gradient(135deg, #5d1a1b 0%, #161142 100%)' }}
          >
            <Play size={20} fill="white" color="white" />
          </div>
        </div>
      )}

      {/* ── Controls bar ─────────────────────────────────────────────────── */}
      <div
        className={[
          'absolute bottom-0 left-0 right-0 px-3 pb-2.5 pt-10 transition-opacity duration-200',
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none',
        ].join(' ')}
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.90) 0%, transparent 100%)',
          zIndex: 10,
        }}
      >
        {/* Seek slider */}
        <input
          type="range"
          min={0}
          max={duration || 100}
          step={0.05}
          value={currentTime}
          disabled={duration === 0}
          onChange={e => handleSeek(Number(e.target.value))}
          className="w-full mb-2.5 h-1 rounded-full cursor-pointer accent-purple-500
                     disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Seek"
        />

        {/* Controls row */}
        <div className="flex items-center gap-2">

          <button
            onClick={togglePlay}
            className="text-white/80 hover:text-white transition-colors duration-100 flex-shrink-0"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying
              ? <Pause size={14} fill="currentColor" />
              : <Play  size={14} fill="currentColor" />
            }
          </button>

          <button
            onClick={toggleMute}
            className="text-white/65 hover:text-white transition-colors duration-100 flex-shrink-0"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
          </button>

          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={displayVolume}
            onChange={e => handleVolumeChange(Number(e.target.value))}
            className="w-14 h-0.5 rounded-full cursor-pointer accent-purple-500 flex-shrink-0"
            aria-label="Volume"
          />

          <span className="text-[10px] text-white/50 tabular-nums flex-shrink-0">
            {formatTime(currentTime)}&nbsp;/&nbsp;{formatTime(duration)}
          </span>

          <div className="flex-1" />

          {/* Quality selector */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => setShowQualityMenu(m => !m)}
              className="text-[10px] font-semibold text-white/55 hover:text-white/90
                         transition-colors duration-100 px-1.5 py-0.5 rounded"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.14)',
              }}
              aria-label={`Quality: ${quality}`}
              aria-expanded={showQualityMenu}
              aria-haspopup="listbox"
            >
              {quality}
            </button>

            {showQualityMenu && (
              <div
                className="absolute bottom-full right-0 mb-1.5 rounded-lg overflow-hidden"
                style={{
                  background: 'rgba(8,5,18,0.97)',
                  border: '1px solid rgba(93,26,27,0.45)',
                  backdropFilter: 'blur(10px)',
                  zIndex: 20,
                  minWidth: 60,
                }}
                role="listbox"
                aria-label="Video quality"
              >
                {QUALITIES.map(q => (
                  <button
                    key={q}
                    role="option"
                    aria-selected={q === quality}
                    onClick={() => selectQuality(q)}
                    className={[
                      'w-full text-left px-3 py-1.5 text-[11px] font-medium transition-colors duration-100',
                      q === quality
                        ? 'text-purple-400 bg-white/[0.04]'
                        : 'text-white/55 hover:text-white hover:bg-white/[0.05]',
                    ].join(' ')}
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={onDownload}
            className="text-white/50 hover:text-white transition-colors duration-100 flex-shrink-0"
            aria-label="Download video"
            title="Download"
          >
            <Download size={13} />
          </button>

          <button
            onClick={onShare}
            className="text-white/50 hover:text-white transition-colors duration-100 flex-shrink-0"
            aria-label="Share video"
            title="Share"
          >
            <Share2 size={13} />
          </button>

          <button
            onClick={toggleFullscreen}
            className="text-white/50 hover:text-white transition-colors duration-100 flex-shrink-0"
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? <Minimize size={13} /> : <Maximize size={13} />}
          </button>
        </div>
      </div>
    </div>
  )
}
