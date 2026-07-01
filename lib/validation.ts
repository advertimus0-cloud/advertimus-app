/**
 * Shared, framework-agnostic input validation helpers.
 * Safe to import from both client and server (no secrets, no server-only APIs).
 */

// Pragmatic RFC-5322-lite check: one @, non-empty local part, a dotted domain
// with a 2+ char TLD. Rejects the common bounce-causing mistakes (missing TLD,
// trailing dots, spaces) without trying to be exhaustively correct.
const EMAIL_RE =
  /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/

/** Trim + lowercase so the same address can't create duplicate accounts. */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

/** True when `email` is a syntactically valid, sensibly-sized address. */
export function isValidEmail(email: string): boolean {
  if (typeof email !== 'string') return false
  const e = normalizeEmail(email)
  if (e.length < 6 || e.length > 254) return false
  if (e.includes('..')) return false
  return EMAIL_RE.test(e)
}
