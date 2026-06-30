'use server'

import { resetPassword } from '@/lib/services/authService'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function requestPasswordReset(email: string) {
  if (typeof email !== 'string' || !EMAIL_RE.test(email)) {
    return { error: 'Enter a valid email address.' }
  }

  const result = await resetPassword(email)
  if (result.error) {
    // Never confirm/deny whether an account exists for this email (§13, anti-enumeration).
    console.error('[forgot-password.requestPasswordReset]', result.error)
  }
  return { success: true }
}
