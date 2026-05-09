'use client'

/**
 * ImageUploader — drag-drop / click-to-upload panel for reference images.
 *
 * Renders as a collapsible panel above the chat input bar.
 * Exposes openPicker() and clearFiles() to the parent via ref.
 *
 * SECURITY (Rule 18):
 * - Client-side validation (type, size, count) is a UX guard ONLY.
 *   The server MUST re-validate MIME type (not just extension), file size,
 *   and user's plan limit before storing anything (§8).
 * - Object URLs are created with URL.createObjectURL() and revoked on
 *   file removal and component unmount — no memory leaks (§8).
 * - Files are NOT uploaded to any backend here (§8, §16). The `onFilesChange`
 *   callback passes File objects to the parent; actual upload goes through
 *   an authenticated POST /api/chat/upload-references route (§5, §8).
 * - `file.type` is the browser-supplied MIME type — NOT trusted for security.
 *   Server must validate the actual file bytes (magic numbers) (§8).
 * - No credentials, tokens, or Supabase calls in this component (§9, §16).
 */

import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface UploadedFile {
  id: string
  file: File
  /** Object URL — revoked on remove / unmount. Never send this URL to the server. */
  previewUrl: string
  name: string
  sizeBytes: number
}

export interface ImageUploaderHandle {
  /** Triggers the native file picker dialog */
  openPicker: () => void
  /** Clears all selected files and hides the panel */
  clearFiles: () => void
}

export interface ImageUploaderProps {
  /** Called whenever the file list changes (add or remove) */
  onFilesChange?: (files: UploadedFile[]) => void
  /** Maximum number of images (plan-based: 4 = LAUNCH, 12 = GROWTH+) */
  maxFiles?: number
  /** Maximum size per file in MB */
  maxSizeMB?: number
  disabled?: boolean
}

// ─── Constants ────────────────────────────────────────────────────────────────

// Browser MIME types for JPG / PNG.
// Server must do authoritative magic-number validation (§8).
const ALLOWED_MIME = new Set(['image/jpeg', 'image/jpg', 'image/png'])
const ACCEPT_ATTR = '.jpg,.jpeg,.png'
const ERROR_DISMISS_MS = 5000

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  return bytes < 1_048_576
    ? `${(bytes / 1024).toFixed(0)} KB`
    : `${(bytes / 1_048_576).toFixed(1)} MB`
}

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function UploadIcon() {
  return (
    <svg
      width="28" height="28" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  )
}

function WarnIcon() {
  return (
    <svg
      width="12" height="12" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      className="flex-shrink-0" aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )
}

// Error banner (auto-dismissed)
function ErrorBanner({
  message,
  onDismiss,
}: {
  message: string
  onDismiss: () => void
}) {
  return (
    <div
      className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-red-300"
      style={{
        background: 'rgba(239,68,68,0.1)',
        border: '1px solid rgba(239,68,68,0.22)',
      }}
      role="alert"
    >
      <WarnIcon />
      <span className="flex-1">{message}</span>
      <button
        onClick={onDismiss}
        className="flex-shrink-0 text-red-400/70 hover:text-red-300 transition-colors ml-1 text-base leading-none"
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  )
}

// Single image thumbnail card with remove button
function Thumbnail({
  file,
  onRemove,
}: {
  file: UploadedFile
  onRemove: (id: string) => void
}) {
  return (
    <div className="relative group flex-shrink-0">
      <div
        className="w-[72px] h-[72px] rounded-lg overflow-hidden"
        style={{ border: '1px solid rgba(93,26,27,0.3)' }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={file.previewUrl}
          alt={file.name}
          className="w-full h-full object-cover"
        />
        {/* Size overlay on hover */}
        <div className="absolute inset-x-0 bottom-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <div className="bg-black/75 px-1 py-[2px] rounded-b-lg">
            <p className="text-[9px] text-white/55 truncate">{formatBytes(file.sizeBytes)}</p>
          </div>
        </div>
      </div>

      {/* Remove × button */}
      <button
        onClick={() => onRemove(file.id)}
        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center
                   justify-center text-white text-sm font-bold leading-none
                   opacity-0 group-hover:opacity-100 transition-all duration-150
                   hover:scale-110 shadow-lg"
        style={{ background: 'linear-gradient(135deg, #EC4899 0%, #A855F7 100%)' }}
        aria-label={`Remove ${file.name}`}
      >
        ×
      </button>
    </div>
  )
}

// ─── ImageUploader ────────────────────────────────────────────────────────────

export const ImageUploader = forwardRef<ImageUploaderHandle, ImageUploaderProps>(
  function ImageUploader(
    { onFilesChange, maxFiles = 12, maxSizeMB = 20, disabled = false },
    ref,
  ) {
    const [files, setFiles] = useState<UploadedFile[]>([])
    const [errors, setErrors] = useState<Array<{ id: string; message: string }>>([])
    const [isDragging, setIsDragging] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const dragCounter = useRef(0)
    const MAX_BYTES = maxSizeMB * 1024 * 1024

    // ── Expose handle to parent ───────────────────────────────────────────────
    useImperativeHandle(ref, () => ({
      openPicker() {
        setIsOpen(true)
        // Slight delay so the panel renders before file dialog opens
        setTimeout(() => fileInputRef.current?.click(), 50)
      },
      clearFiles() {
        setFiles(prev => {
          prev.forEach(f => URL.revokeObjectURL(f.previewUrl))
          return []
        })
        setIsOpen(false)
      },
    }))

    // Revoke all object URLs on unmount
    useEffect(() => {
      return () => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        files.forEach(f => URL.revokeObjectURL(f.previewUrl))
      }
    // Only run on unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Notify parent on every change
    useEffect(() => {
      onFilesChange?.(files)
    }, [files, onFilesChange])

    // Auto-open panel when files are added
    useEffect(() => {
      if (files.length > 0) setIsOpen(true)
    }, [files.length])

    // Auto-dismiss errors
    useEffect(() => {
      if (errors.length === 0) return
      const t = setTimeout(() => setErrors([]), ERROR_DISMISS_MS)
      return () => clearTimeout(t)
    }, [errors])

    // ── Validation + processing ───────────────────────────────────────────────

    function pushError(msg: string) {
      setErrors(prev => [...prev, { id: uid(), message: msg }])
    }

    const processFiles = useCallback(
      (incoming: FileList | File[]) => {
        const arr = Array.from(incoming)
        const added: UploadedFile[] = []

        setFiles(current => {
          let count = current.length

          for (const file of arr) {
            if (!ALLOWED_MIME.has(file.type)) {
              pushError(`"${file.name}" is not a JPG or PNG file.`)
              continue
            }
            if (file.size > MAX_BYTES) {
              pushError(
                `"${file.name}" is ${formatBytes(file.size)} — exceeds the ${maxSizeMB}MB limit.`,
              )
              continue
            }
            if (count >= maxFiles) {
              pushError(`Maximum ${maxFiles} images allowed on your plan.`)
              break
            }

            added.push({
              id: uid(),
              file,
              previewUrl: URL.createObjectURL(file),
              name: file.name,
              sizeBytes: file.size,
            })
            count++
          }

          return added.length > 0 ? [...current, ...added] : current
        })
      },
      [MAX_BYTES, maxFiles, maxSizeMB],
    )

    // ── File input change ─────────────────────────────────────────────────────

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
      if (e.target.files) processFiles(e.target.files)
      e.target.value = '' // reset so the same file can be re-added after removal
    }

    // ── Drag events ───────────────────────────────────────────────────────────

    function onDragEnter(e: React.DragEvent) {
      e.preventDefault()
      dragCounter.current++
      setIsDragging(true)
    }

    function onDragLeave(e: React.DragEvent) {
      e.preventDefault()
      dragCounter.current--
      if (dragCounter.current === 0) setIsDragging(false)
    }

    function onDragOver(e: React.DragEvent) {
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'
    }

    function onDrop(e: React.DragEvent) {
      e.preventDefault()
      dragCounter.current = 0
      setIsDragging(false)
      if (e.dataTransfer.files.length > 0) processFiles(e.dataTransfer.files)
    }

    // ── File management ───────────────────────────────────────────────────────

    function removeFile(id: string) {
      setFiles(prev => {
        const target = prev.find(f => f.id === id)
        if (target) URL.revokeObjectURL(target.previewUrl)
        const next = prev.filter(f => f.id !== id)
        if (next.length === 0) setIsOpen(false)
        return next
      })
    }

    function clearAll() {
      setFiles(prev => {
        prev.forEach(f => URL.revokeObjectURL(f.previewUrl))
        return []
      })
      setIsOpen(false)
    }

    // ── Render ────────────────────────────────────────────────────────────────

    const canAddMore = files.length < maxFiles

    // Hidden file input is always rendered so parent can trigger it via ref
    const hiddenInput = (
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPT_ATTR}
        multiple
        className="hidden"
        onChange={handleInputChange}
        aria-hidden="true"
      />
    )

    if (!isOpen) return hiddenInput

    return (
      <div className="max-w-3xl mx-auto mb-2.5">
        {hiddenInput}

        {/* ── Error banners ─────────────────────────────────────────────── */}
        {errors.length > 0 && (
          <div className="flex flex-col gap-1.5 mb-2">
            {errors.map(err => (
              <ErrorBanner
                key={err.id}
                message={err.message}
                onDismiss={() => setErrors(prev => prev.filter(e => e.id !== err.id))}
              />
            ))}
          </div>
        )}

        {/* ── Upload panel ──────────────────────────────────────────────── */}
        <div
          className="rounded-xl transition-all duration-200"
          style={{
            border: isDragging
              ? '2px dashed #EC4899'
              : files.length > 0
              ? '1px solid rgba(93,26,27,0.38)'
              : '1px dashed rgba(93,26,27,0.35)',
            background: isDragging ? 'rgba(93,26,27,0.1)' : 'rgba(255,255,255,0.02)',
            transform: isDragging ? 'scale(1.005)' : 'scale(1)',
          }}
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDragOver={onDragOver}
          onDrop={onDrop}
        >
          {/* ── Empty / drop zone ──────────────────────────────────────── */}
          {files.length === 0 ? (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
              className="w-full flex flex-col items-center justify-center gap-2.5 py-7 px-4
                         rounded-xl text-white/35 hover:text-white/55 transition-colors duration-150
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-accent1/50"
              aria-label="Click to select reference images"
            >
              <UploadIcon />
              <div className="text-center">
                <p className="text-sm font-medium leading-snug">
                  {isDragging ? 'Drop images here' : 'Drag & drop images, or click to browse'}
                </p>
                <p className="text-xs text-white/22 mt-0.5">
                  JPG, PNG · max {maxSizeMB} MB each · {maxFiles} images max
                </p>
              </div>
            </button>
          ) : (
            /* ── Preview grid ──────────────────────────────────────────── */
            <div className="p-3">
              {/* Counter row */}
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  {/* Filled bar indicator */}
                  <div
                    className="h-1 rounded-full overflow-hidden"
                    style={{ width: 60, background: 'rgba(255,255,255,0.08)' }}
                    aria-hidden="true"
                  >
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${(files.length / maxFiles) * 100}%`,
                        background:
                          files.length >= maxFiles
                            ? '#ef4444'
                            : 'linear-gradient(90deg, #EC4899, #A855F7)',
                      }}
                    />
                  </div>
                  <span
                    className="text-xs font-semibold"
                    style={{
                      color: files.length >= maxFiles
                        ? '#ef4444'
                        : 'rgba(255,255,255,0.55)',
                    }}
                  >
                    {files.length} / {maxFiles} images
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {canAddMore && !disabled && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs text-white/40 hover:text-white/70 transition-colors
                                 duration-150 flex items-center gap-1"
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                        aria-hidden="true">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                      Add more
                    </button>
                  )}
                  <button
                    onClick={clearAll}
                    className="text-xs text-red-400/50 hover:text-red-400 transition-colors duration-150"
                    aria-label="Remove all images"
                  >
                    Clear all
                  </button>
                </div>
              </div>

              {/* Thumbnail grid */}
              <div className="flex flex-wrap gap-2" role="list" aria-label="Selected images">
                {files.map(file => (
                  <div key={file.id} role="listitem">
                    <Thumbnail file={file} onRemove={removeFile} />
                  </div>
                ))}

                {/* "Add more" ghost tile */}
                {canAddMore && !disabled && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-[72px] h-[72px] rounded-lg flex items-center justify-center
                               text-white/22 hover:text-white/50 transition-all duration-150
                               hover:border-accent1/40 flex-shrink-0"
                    style={{ border: '1px dashed rgba(93,26,27,0.28)' }}
                    aria-label="Add more images"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                      aria-hidden="true">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Drag-over hint when panel already has images */}
              {isDragging && (
                <p className="text-center text-xs text-white/35 mt-2.5">
                  Drop to add more images
                </p>
              )}
            </div>
          )}
        </div>

        {/* Plan hint */}
        {files.length >= maxFiles && (
          <p className="text-center mt-1.5 text-[11px]" style={{ color: 'rgba(236,72,153,0.65)' }}>
            Image limit reached for your plan.{' '}
            <span className="underline cursor-pointer">Upgrade for more.</span>
          </p>
        )}
      </div>
    )
  },
)
