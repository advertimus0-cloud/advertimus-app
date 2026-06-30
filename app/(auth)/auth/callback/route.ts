import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

/**
 * Handles two cases:
 * 1. Email confirmation links — Supabase redirects here with ?code=...
 * 2. OAuth callbacks (Google) — same code exchange flow
 *
 * SECURITY: code exchange happens server-side via createClient().
 * The resulting session is stored in HttpOnly cookies by @supabase/ssr.
 *
 * The `next` param is sanitised to prevent open-redirect attacks — only
 * relative paths starting with a single "/" are accepted.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  // Sanitise `next` — must be a relative path, never a protocol-relative
  // or absolute URL (e.g. //evil.com or https://evil.com).
  const rawNext = searchParams.get('next') ?? ''
  const next =
    rawNext.startsWith('/') && !rawNext.startsWith('//')
      ? rawNext
      : '/dashboard'

  if (code) {
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (!error) {
        return NextResponse.redirect(`${origin}${next}`)
      }
      console.error('[auth/callback] exchangeCodeForSession error:', error.message)
    } catch (err) {
      console.error('[auth/callback] unexpected error:', err)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`)
}
