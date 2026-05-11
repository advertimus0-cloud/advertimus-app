'use client'

/**
 * ImageGallery — 2×2 product image grid with hover controls and full-size preview modal.
 *
 * SECURITY (Rule 18):
 * - Image URLs must be signed, short-lived Supabase Storage URLs generated server-side.
 *   This component renders URLs as passed via props; it never constructs them (§8).
 * - PLACEHOLDER_IMAGES (picsum.photos) are for development/demo ONLY. In production,
 *   only server-provided signed URLs should be used (§8).
 * - "Download" and "Download All as ZIP" are UI stubs — production implementation MUST
 *   call an authenticated backend endpoint that re-validates ownership before issuing a
 *   signed download URL (§8, §16).
 * - "Edit in Canva" is a UI stub — the redirect must go through a backend route that
 *   validates the user session (§16).
 * - No API calls, no auth logic, no secrets in this component (§16).
 */

import React, { useState, useEffect, useCallback } from 'react'
import { Download, X, ChevronLeft, ChevronRight } from 'lucide-react'

// Remove before production — only server-signed URLs allowed in prod (§8)
const PLACEHOLDER_IMAGES = [
  'https://picsum.photos/400/300?random=1',
  'https://picsum.photos/400/300?random=2',
  'https://picsum.photos/400/300?random=3',
  'https://picsum.photos/400/300?random=4',
]

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`rounded-lg adv-skeleton ${className}`} />
}

// ─── Full-size preview modal ───────────────────────────────────────────────────

interface ImageModalProps {
  src: string
  index: number
  total: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

function ImageModal({ src, index, total, onClose, onPrev, onNext }: ImageModalProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft') onPrev()
      else if (e.key === 'ArrowRight') onNext()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose, onPrev, onNext])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      style={{ background: 'rgba(0,0,0,0.93)', backdropFilter: 'blur(14px)' }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Product image ${index + 1} of ${total} — full size preview`}
    >
      <div
        className="relative w-full max-w-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-9 right-0 flex items-center gap-1.5 text-xs
                     text-white/45 hover:text-white transition-colors duration-150"
          aria-label="Close preview"
        >
          <X size={13} />
          Close
        </button>

        {/* Full-size image */}
        <img
          src={src}
          alt={`Product image ${index + 1}`}
          className="w-full rounded-xl object-contain"
          style={{
            maxHeight: '76vh',
            border: '1px solid rgba(93,26,27,0.35)',
          }}
        />

        {/* Navigation bar */}
        <div className="flex items-center justify-between mt-3">
          <button
            onClick={onPrev}
            disabled={total <= 1}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                       text-white/55 hover:text-white transition-colors duration-150
                       disabled:opacity-25 disabled:cursor-not-allowed"
            style={{ border: '1px solid rgba(93,26,27,0.3)' }}
            aria-label="Previous image"
          >
            <ChevronLeft size={13} />
            Prev
          </button>

          <span className="text-[11px] text-white/30 tabular-nums">
            {index + 1} / {total}
          </span>

          <button
            onClick={onNext}
            disabled={total <= 1}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium
                       text-white/55 hover:text-white transition-colors duration-150
                       disabled:opacity-25 disabled:cursor-not-allowed"
            style={{ border: '1px solid rgba(93,26,27,0.3)' }}
            aria-label="Next image"
          >
            Next
            <ChevronRight size={13} />
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── ImageGallery ─────────────────────────────────────────────────────────────

export interface ImageGalleryProps {
  isGenerating: boolean
  images?: string[]
  showCanvaButton?: boolean
}

export function ImageGallery({
  isGenerating,
  images,
  showCanvaButton = true,
}: ImageGalleryProps) {
  const [previewIndex, setPreviewIndex] = useState<number | null>(null)

  const srcs = images?.length ? images.slice(0, 4) : PLACEHOLDER_IMAGES

  const openPreview = useCallback((i: number) => setPreviewIndex(i), [])
  const closePreview = useCallback(() => setPreviewIndex(null), [])
  const prevImage = useCallback(() =>
    setPreviewIndex(i => i === null ? null : (i - 1 + srcs.length) % srcs.length),
    [srcs.length]
  )
  const nextImage = useCallback(() =>
    setPreviewIndex(i => i === null ? null : (i + 1) % srcs.length),
    [srcs.length]
  )

  if (isGenerating) {
    return (
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          {[0, 1, 2, 3].map(i => <Skeleton key={i} className="aspect-square w-full" />)}
        </div>
        <Skeleton className="h-8 w-full mt-0.5" />
      </div>
    )
  }

  return (
    <>
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          {srcs.map((src, i) => (
            <div
              key={i}
              className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
              style={{ border: '1px solid rgba(93,26,27,0.22)' }}
              onClick={() => openPreview(i)}
              role="button"
              tabIndex={0}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  openPreview(i)
                }
              }}
              aria-label={`Product image ${i + 1} — click to view full size`}
            >
              <img
                src={src}
                alt={`Product image ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />

              <div
                className="absolute inset-0 flex flex-col items-end justify-between p-2
                           opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{ background: 'rgba(0,0,0,0.50)' }}
              >
                <span
                  className="text-[10px] font-bold text-white/90 px-1.5 py-0.5 rounded-full"
                  style={{
                    background: 'rgba(22,17,66,0.80)',
                    border: '1px solid rgba(168,85,247,0.35)',
                  }}
                >
                  {i + 1}
                </span>

                <button
                  onClick={e => {
                    e.stopPropagation()
                    // TODO: call authenticated backend download endpoint (§8, §16)
                  }}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px]
                             font-medium text-white/80 hover:text-white
                             transition-colors duration-150"
                  style={{
                    background: 'rgba(0,0,0,0.55)',
                    border: '1px solid rgba(255,255,255,0.16)',
                  }}
                  aria-label={`Download image ${i + 1}`}
                >
                  <Download size={10} />
                  Save
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Download All as ZIP */}
        <button
          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg
                     text-xs font-medium text-white/50 hover:text-white/80
                     transition-colors duration-150"
          style={{ border: '1px dashed rgba(93,26,27,0.32)' }}
          aria-label="Download all images as ZIP"
        >
          <Download size={11} />
          Download All as ZIP
        </button>

        {/* Edit in Canva */}
        {showCanvaButton && (
          <button
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg
                       text-xs font-medium text-white/40 hover:text-white/65
                       transition-colors duration-150"
            style={{ border: '1px solid rgba(93,26,27,0.2)' }}
            aria-label="Edit in Canva"
          >
            🎨 Edit in Canva
          </button>
        )}
      </div>

      {previewIndex !== null && (
        <ImageModal
          src={srcs[previewIndex]}
          index={previewIndex}
          total={srcs.length}
          onClose={closePreview}
          onPrev={prevImage}
          onNext={nextImage}
        />
      )}
    </>
  )
}
