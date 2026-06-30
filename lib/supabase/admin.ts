import { createClient as createSupabaseClient } from '@supabase/supabase-js'

/**
 * Service-role Supabase client — bypasses Row Level Security entirely.
 * Server-only. Never import this from a Client Component, a browser-reachable
 * module, or send its raw results to the client. Reserved for privileged writes
 * (e.g. the credit ledger) that must not be reachable through user-owned RLS context.
 */
export function createAdminClient() {
  const url = (
    process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
  )?.trim()
  const secretKey = (
    process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY
  )?.trim()

  if (!url || !secretKey) {
    throw new Error(
      'Supabase admin client is not configured (missing SUPABASE_URL or SUPABASE_SECRET_KEY)'
    )
  }

  return createSupabaseClient(url, secretKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
