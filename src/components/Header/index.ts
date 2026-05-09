/**
 * src/components/Header/index.ts
 *
 * Purpose: Navigation bar displayed at the top of every authenticated view.
 * Responsibilities:
 *  - Brand logo
 *  - Credit balance indicator (read-only, from CreditContext)
 *  - User avatar / account dropdown
 *  - Upgrade CTA (conditional on plan)
 *
 * SECURITY: This component is display-only. It reads sanitized data from
 * context providers — it does NOT perform any auth checks itself (§16).
 */
export {};
