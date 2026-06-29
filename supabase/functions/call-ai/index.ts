// Provides Deno global types and Supabase edge-runtime types for the IDE
import '@supabase/functions-js/edge-runtime.d.ts'

import { withSupabase } from '@supabase/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: Deno.env.get('ANTHROPIC_API_KEY'),
})

const DEFAULT_SYSTEM =
  'You are Advertimus, an expert AI assistant for creating high-performing marketing campaigns. ' +
  'You help users craft compelling ad copy, define target audiences, select ad formats, ' +
  'and optimize campaign strategy. Be concise, strategic, and results-focused.'

export default {
  fetch: withSupabase({ auth: 'user' }, async (req, _ctx) => {
    const body = await req.json().catch(() => null)
    if (!body) {
      return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    const {
      messages,
      system = DEFAULT_SYSTEM,
      model = 'claude-sonnet-4-6',
      max_tokens = 2048,
      stream = false,
    } = body

    if (!Array.isArray(messages) || messages.length === 0) {
      return Response.json(
        { error: 'messages must be a non-empty array' },
        { status: 400 },
      )
    }
    for (const m of messages) {
      if (!m.role || !m.content) {
        return Response.json(
          { error: 'Each message must have role and content' },
          { status: 400 },
        )
      }
    }

    // Streaming — returns Server-Sent Events stream
    if (stream) {
      const anthropicStream = anthropic.messages.stream({
        model,
        max_tokens,
        system,
        messages,
      })
      return new Response(anthropicStream.toReadableStream(), {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          Connection: 'keep-alive',
        },
      })
    }

    // Non-streaming — full response
    const response = await anthropic.messages.create({
      model,
      max_tokens,
      system,
      messages,
    })

    return Response.json(response)
  }),
}
