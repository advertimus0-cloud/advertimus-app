'use client'

/**
 * MultiChoiceOptions — renders a group of selectable option cards in the chat.
 *
 * Appears inline below an agent message when message.type === 'options'.
 * After the user selects, the card group becomes disabled (no re-selection)
 * — enforcement is also done server-side (§5, §16).
 *
 * SECURITY (Rule 18):
 * - Pure display component — no API calls (§16).
 * - All string values (title, description) rendered as React text → XSS-safe (§7).
 * - Locked options are UI-only hints; plan enforcement happens server-side (§16).
 * - onSelect passes only the string `id` upward; callers must validate before
 *   sending to the backend (§5).
 */

import React from 'react'
import { MCQOption } from './MessageItem'
import { OptionButton } from '../Common/OptionButton'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface MultiChoiceOptionsProps {
  options: MCQOption[]
  /** ID of the currently selected option (null = nothing chosen yet) */
  selectedId: string | null
  /** Called with the chosen option ID. Wire to state/context in parent. */
  onSelect?: (id: string) => void
}

// ─── Sample data ──────────────────────────────────────────────────────────────
// Replace with dynamic data from context/API when wiring the real flow.

export const AD_TYPE_OPTIONS: MCQOption[] = [
  {
    id: 'problem-solution',
    title: 'Problem → Solution',
    description: 'Show the problem your audience faces, then reveal your product as the answer',
    icon: '🎯',
  },
  {
    id: 'before-after',
    title: 'Before / After',
    description: 'Show the transformation your product delivers — side by side',
    icon: '✨',
  },
  {
    id: 'storytelling',
    title: 'Storytelling',
    description: 'Tell a compelling story about your product or a customer journey',
    icon: '📖',
  },
  {
    id: 'direct-selling',
    title: 'Direct Selling',
    description: 'Showcase product features, benefits, and price — no frills',
    icon: '💰',
  },
  {
    id: 'trend-viral',
    title: 'Trend / Viral Style',
    description: 'Ride current trends with entertaining, shareable content',
    icon: '🔥',
  },
  {
    id: 'testimonial',
    title: 'Testimonial',
    description: 'Let real customer success stories do the selling for you',
    icon: '⭐',
  },
]

export const STYLE_OPTIONS: MCQOption[] = [
  {
    id: 'luxury-cinematic',
    title: 'Luxury / Cinematic',
    description: 'High-end production, dramatic lighting, professional grade',
    icon: '🎬',
  },
  {
    id: 'casual-real-life',
    title: 'Casual / Real Life',
    description: 'Authentic, lo-fi aesthetic — relatable and trustworthy',
    icon: '👥',
  },
  {
    id: 'funny-comedy',
    title: 'Funny / Comedy',
    description: 'Humorous, entertaining — makes your brand memorable',
    icon: '😂',
  },
  {
    id: 'emotional',
    title: 'Emotional',
    description: 'Heart-warming or inspiring — connects on a human level',
    icon: '💖',
  },
  {
    id: 'studio-based',
    title: 'Studio-Based',
    description: 'Clean, controlled environment — polished product focus',
    icon: '📸',
  },
]

export const FORMAT_OPTIONS: MCQOption[] = [
  {
    id: 'video-real-life',
    title: 'Video (Real-life Shooting)',
    description: 'Professional video footage — authentic, high impact',
    icon: '🎥',
  },
  {
    id: 'image-based',
    title: 'Image-Based Ad',
    description: 'Static or carousel format — ideal for Instagram & Facebook',
    icon: '🖼️',
  },
  {
    id: '3d-animation',
    title: '3D Product Animation',
    description: 'Sleek, modern 3D render — showcases product from every angle',
    icon: '🎨',
  },
  {
    id: 'mixed',
    title: 'Mixed (Real + 3D)',
    description: 'Blend of live footage and 3D elements — striking hybrid',
    icon: '🎭',
  },
]

export const COUNTRY_OPTIONS: MCQOption[] = [
  {
    id: 'united-states',
    title: 'United States',
    description: 'Target the US market — English, USD pricing, American cultural cues',
    icon: '🇺🇸',
  },
  {
    id: 'europe',
    title: 'Europe',
    description: 'Broad European reach — multi-language friendly, diverse audience',
    icon: '🇪🇺',
  },
  {
    id: 'middle-east',
    title: 'Middle East',
    description: 'Arabic-speaking markets — culturally tailored visuals and messaging',
    icon: '🌙',
  },
  {
    id: 'asia',
    title: 'Asia',
    description: 'Asia-Pacific markets — high-growth, mobile-first audiences',
    icon: '🌏',
  },
  {
    id: 'global',
    title: 'Global',
    description: 'Universal appeal — no region-specific cultural markers',
    icon: '🌍',
  },
  {
    id: 'custom-market',
    title: 'Custom Market',
    description: 'Specify your own target region or country combination',
    icon: '📍',
  },
]

export const RATIO_OPTIONS: MCQOption[] = [
  {
    id: 'landscape-16-9',
    title: 'Landscape 16:9',
    description: 'Horizontal format — YouTube, Facebook feed, desktop screens',
    icon: '🖥️',
  },
  {
    id: 'portrait-9-16',
    title: 'Portrait 9:16',
    description: 'Vertical format — Instagram Reels, TikTok, YouTube Shorts',
    icon: '📱',
  },
  {
    id: 'square-1-1',
    title: 'Square 1:1',
    description: 'Square format — Instagram feed, Facebook posts, universal fit',
    icon: '⬜',
  },
  {
    id: 'all-formats',
    title: 'All Formats',
    description: 'Generate all three ratios — maximum platform coverage',
    icon: '📐',
  },
]

export const IMAGES_OPTIONS: MCQOption[] = [
  {
    id: 'product-images-only',
    title: 'Product Images Only',
    description: 'Use only your uploaded product photos — +40 credits',
    icon: '📦',
    creditCost: 40,
  },
  {
    id: 'designs-only',
    title: 'Designs Only',
    description: 'AI-generated graphic designs, no product photos — +60 credits',
    icon: '🎨',
    creditCost: 60,
  },
  {
    id: 'both',
    title: 'Both (Product + Designs)',
    description: 'Mix of product photos and AI-generated graphics — +100 credits',
    icon: '✨',
    creditCost: 100,
  },
  {
    id: 'skip-images',
    title: 'Skip',
    description: 'No additional images — use only video footage',
    icon: '⏭️',
    creditCost: 0,
  },
]

/** Growth plan defaults — locked options depend on the user's active plan.
 *  Swap the `locked` / `lockedLabel` fields based on `plan_type` from context. */
export const LENGTH_OPTIONS: MCQOption[] = [
  {
    id: 'len-15',
    title: '15 seconds',
    description: '400 credits · 1–2 min · Quick, punchy — perfect for social feeds',
    icon: '⚡',
    creditCost: 400,
  },
  {
    id: 'len-20',
    title: '20 seconds',
    description: '450 credits · 2–3 min · Ideal for product demos with a clear CTA',
    icon: '⏱️',
    creditCost: 450,
  },
  {
    id: 'len-30',
    title: '30 seconds',
    description: '550 credits · 5–8 min · The sweet spot for storytelling ads',
    icon: '🎞️',
    creditCost: 550,
  },
  {
    id: 'len-40',
    title: '40 seconds',
    description: '700 credits · 6–10 min · More room for narrative and detail',
    icon: '🎬',
    creditCost: 700,
  },
  {
    id: 'len-50',
    title: '50 seconds',
    description: '1,000 credits · 8–12 min · Full cinematic storytelling',
    icon: '🏆',
    creditCost: 1000,
    locked: true,
    lockedLabel: '🔒 Upgrade to Dominance plan',
  },
]

// ─── MultiChoiceOptions ───────────────────────────────────────────────────────

export function MultiChoiceOptions({
  options,
  selectedId,
  onSelect,
}: MultiChoiceOptionsProps) {
  const hasSelection = selectedId !== null

  return (
    <div
      className="flex flex-col gap-2 mt-3"
      role="group"
      aria-label="Select an option"
    >
      {options.map((option, i) => (
        <OptionButton
          key={option.id}
          option={option}
          index={i + 1}
          isSelected={selectedId === option.id}
          // After any selection, lock all other buttons (display-only; no real enforcement)
          disabled={hasSelection && selectedId !== option.id}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}
