import { createClient } from '@/lib/supabase/server'
import { isValidEmail, normalizeEmail } from '@/lib/validation'

export interface AuthResult<T = void> {
  data?: T
  error?: string
}

type SupabaseAuthError = { message?: string; status?: number; code?: string } | null

/**
 * Maps a raw Supabase auth error to a clean, user-safe message.
 *
 * Guarantees a non-empty, human-readable string. Supabase can return a blank
 * or non-serialisable message (e.g. `"{}"` when email sending is restricted),
 * which must never be shown to the user verbatim.
 */
function describeAuthError(error: SupabaseAuthError, fallback: string): string {
  const raw = (error?.message ?? '').trim()
  const code = error?.code ?? ''
  const status = error?.status ?? 0

  if (status === 429 || /rate limit/i.test(raw) || code.includes('rate_limit')) {
    return 'Too many attempts right now. Please wait a minute and try again.'
  }
  if (/already registered|already been registered|user already exists/i.test(raw)) {
    return 'An account with this email already exists. Try signing in instead.'
  }
  if (/invalid login credentials/i.test(raw)) {
    return 'Incorrect email or password.'
  }
  if (/email not confirmed/i.test(raw)) {
    return 'Please confirm your email first — check your inbox for the link.'
  }
  // Blank or non-serialisable message → safe generic fallback.
  if (!raw || raw === '{}' || raw === '[object Object]') return fallback
  return raw
}

export async function login(
  email: string,
  password: string
): Promise<AuthResult<{ userId: string }>> {
  if (!isValidEmail(email)) return { error: 'Please enter a valid email address.' }
  try {
    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizeEmail(email),
      password,
    })
    if (error) {
      console.error('[authService.login] supabase:', JSON.stringify(error))
      return { error: describeAuthError(error, 'Unable to sign in right now. Please try again.') }
    }
    return { data: { userId: data.user.id } }
  } catch (err) {
    console.error('[authService.login]', err)
    return { error: 'Unable to sign in right now. Please try again.' }
  }
}

export async function signup(
  email: string,
  password: string,
  companyName?: string
): Promise<AuthResult> {
  // Reject malformed addresses BEFORE they reach Supabase — an invalid address
  // that gets a confirmation email will bounce and hurt sending reputation.
  if (!isValidEmail(email)) return { error: 'Please enter a valid email address.' }
  try {
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email: normalizeEmail(email),
      password,
      options: {
        data: { company: companyName ?? null },
        emailRedirectTo: `${process.env.APP_URL ?? process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      },
    })
    if (error) {
      console.error('[authService.signup] supabase:', JSON.stringify(error))
      return { error: describeAuthError(error, 'Unable to create your account right now. Please try again.') }
    }
    return {}
  } catch (err) {
    console.error('[authService.signup]', err)
    return { error: 'Unable to create your account right now. Please try again.' }
  }
}

export async function logout(): Promise<AuthResult> {
  try {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()
    if (error) return { error: error.message }
    return {}
  } catch (err) {
    console.error('[authService.logout]', err)
    return { error: 'Unable to sign out right now.' }
  }
}

export async function getCurrentUser(): Promise<
  AuthResult<{
    id: string
    email?: string
    company?: string
    fullName?: string
    phone?: string
    website?: string
  }>
> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase.auth.getUser()
    if (error || !data.user) return { error: error?.message ?? 'Not authenticated' }
    const meta = data.user.user_metadata ?? {}
    const str = (v: unknown) => (typeof v === 'string' ? v : undefined)
    return {
      data: {
        id: data.user.id,
        email: data.user.email,
        company: str(meta.company),
        fullName: str(meta.full_name),
        phone: str(meta.phone),
        website: str(meta.website),
      },
    }
  } catch (err) {
    console.error('[authService.getCurrentUser]', err)
    return { error: 'Unable to fetch current user.' }
  }
}

export async function resetPassword(email: string): Promise<AuthResult> {
  if (!isValidEmail(email)) return { error: 'Please enter a valid email address.' }
  try {
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(normalizeEmail(email), {
      redirectTo: `${process.env.APP_URL ?? process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/reset-password`,
    })
    if (error) {
      console.error('[authService.resetPassword] supabase:', JSON.stringify(error))
      return { error: describeAuthError(error, 'Unable to send reset email right now.') }
    }
    return {}
  } catch (err) {
    console.error('[authService.resetPassword]', err)
    return { error: 'Unable to send reset email right now.' }
  }
}

export async function verifyEmail(email: string, token: string): Promise<AuthResult> {
  try {
    const supabase = createClient()
    const { error } = await supabase.auth.verifyOtp({ email, token, type: 'signup' })
    if (error) {
      console.error('[authService.verifyEmail] supabase:', JSON.stringify(error))
      return { error: describeAuthError(error, 'Unable to verify email right now.') }
    }
    return {}
  } catch (err) {
    console.error('[authService.verifyEmail]', err)
    return { error: 'Unable to verify email right now.' }
  }
}

export async function resendVerification(email: string): Promise<AuthResult> {
  if (!isValidEmail(email)) return { error: 'Please enter a valid email address.' }
  try {
    const supabase = createClient()
    const { error } = await supabase.auth.resend({ type: 'signup', email: normalizeEmail(email) })
    if (error) {
      console.error('[authService.resendVerification] supabase:', JSON.stringify(error))
      return { error: describeAuthError(error, 'Unable to resend verification email right now.') }
    }
    return {}
  } catch (err) {
    console.error('[authService.resendVerification]', err)
    return { error: 'Unable to resend verification email right now.' }
  }
}
