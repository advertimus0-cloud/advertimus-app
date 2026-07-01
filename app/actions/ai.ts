'use server'

import { createClient } from '@/lib/supabase/server'

export type AIMessage = { role: 'user' | 'assistant'; content: string }

export interface CallAIOptions {
  messages: AIMessage[]
  system?: string
  model?: string
  max_tokens?: number
}

/**
 * Calls the call-ai Edge Function via the authenticated server-side Supabase client.
 * The user's JWT is forwarded automatically — the Edge Function validates it.
 * ANTHROPIC_API_KEY never leaves the Edge Function environment.
 */
export async function callAI(options: CallAIOptions) {
  const supabase = createClient()

  // Defense-in-depth (§2, §16): verify the session server-side before spending
  // any AI budget. The Edge Function re-validates the JWT, but we must never rely
  // on the client to be authenticated — reject unauthenticated calls up front.
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated.' }

  const { data, error } = await supabase.functions.invoke('call-ai', {
    body: options,
  })

  if (error) return { error: error.message }

  const text: string = data?.content?.[0]?.text ?? ''
  return { text }
}
