'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { login } from '@/lib/services/authService'

export async function signInWithPassword(email: string, password: string) {
  const result = await login(email, password)
  if (result.error) return { error: result.error }
  redirect('/dashboard')
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
    console.error('[login.getGoogleOAuthUrl]', err)
    return { error: 'Google sign-in is unavailable right now.' }
  }
}
