/**
 * src/components/Common/index.ts
 *
 * Purpose: Shared, reusable UI primitives used across the application.
 * Components to be placed here:
 *  - Button          : primary / secondary / ghost variants
 *  - Input           : text, textarea with validation state
 *  - Spinner         : loading indicator
 *  - Avatar          : user/agent avatar with fallback initials
 *  - Badge           : plan type, status labels
 *  - Tooltip         : accessible hover tooltips
 *  - ProgressBar     : generation progress indicator
 *  - EmptyState      : zero-data illustrations
 *
 * RULE: These components are purely presentational — they carry no business
 * logic and make no API calls.
 */
export { OptionButton } from './OptionButton'
export { VideoPlayer } from './VideoPlayer'
export type { OptionButtonProps } from './OptionButton'
export type { VideoPlayerProps } from './VideoPlayer'
