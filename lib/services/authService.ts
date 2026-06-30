import { createClient } from '@/lib/supabase/server'

export interface AuthResult<T = void> {
  data?: T
  error?: string
}

export async function login(
  email: string,
  password: string
): Promise<AuthResult<{ userId: string }>> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error: error.message }
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
  try {
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { company: companyName ?? null },
        emailRedirectTo: `${process.env.APP_URL ?? process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      },
    })
    if (error) return { error: error.message }
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

export async function getCurrentUser(): Promise<AuthResult<{ id: string; email?: string }>> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase.auth.getUser()
    if (error || !data.user) return { error: error?.message ?? 'Not authenticated' }
    return { data: { id: data.user.id, email: data.user.email } }
  } catch (err) {
    console.error('[authService.getCurrentUser]', err)
    return { error: 'Unable to fetch current user.' }
  }
}

export async function resetPassword(email: string): Promise<AuthResult> {
  try {
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.APP_URL ?? process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/reset-password`,
    })
    if (error) return { error: error.message }
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
    if (error) return { error: error.message }
    return {}
  } catch (err) {
    console.error('[authService.verifyEmail]', err)
    return { error: 'Unable to verify email right now.' }
  }
}

export async function resendVerification(email: string): Promise<AuthResult> {
  try {
    const supabase = createClient()
    const { error } = await supabase.auth.resend({ type: 'signup', email })
    if (error) return { error: error.message }
    return {}
  } catch (err) {
    console.error('[authService.resendVerification]', err)
    return { error: 'Unable to resend verification email right now.' }
  }
}
