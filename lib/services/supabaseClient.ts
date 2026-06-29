/**
 * supabaseClient — server-only Supabase access layer.
 *
 * Exports two clients:
 *   createClient      — request-scoped, cookie-based session client (respects RLS).
 *                       Import in Server Actions / Route Handlers / Server Components.
 *   createAdminClient — service-role client (bypasses RLS). Server-only. Never use
 *                       from client components or expose its output to the browser.
 *
 * Security (AI_SECURITY_RULES.md §9, §16):
 *   - No NEXT_PUBLIC_ keys used here — all credentials are server-only env vars.
 *   - Service-role key (SUPABASE_SECRET_KEY) never reaches the client bundle.
 */
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export { createClient, createAdminClient }

/**
 * Verifies that the backend can reach Supabase.
 * Never throws — catches all errors and logs them. Safe to call in health checks.
 */
export async function testSupabaseConnection(): Promise<{ ok: boolean; error?: string }> {
  try {
    const admin = createAdminClient()
    const { error } = await admin.from('user_credits').select('user_id').limit(1)
    if (error) {
      console.error('[supabaseClient] connection test failed:', error.message)
      return { ok: false, error: error.message }
    }
    console.log('[supabaseClient] connection OK')
    return { ok: true }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error'
    console.error('[supabaseClient] connection test threw:', msg)
    return { ok: false, error: msg }
  }
}
