'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { signup, resendVerification as resendService } from '@/lib/services/authService'

export async function signUp(email: string, password: string, company?: string) {
  const result = await signup(email, password, company)
  if (result.error) return { error: result.error }
  redirect(`/verify-email?email=${encodeURIComponent(email)}`)
}

export async function getGoogleOAuthUrl() {
  try {
    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.APP_URL ?? process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      },
    })
    if (error || !data.url) return { error: error?.message ?? 'OAuth unavailable' }
    return { url: data.url }
  } catch (err) {
    console.error('[signup.getGoogleOAuthUrl]', err)
    return { error: 'Google sign-in is unavailable right now.' }
  }
}

export async function resendVerification(email: string) {
  const result = await resendService(email)
  if (result.error) return { error: result.error }
  return { success: true }
}
