import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { updateCredits } from '@/lib/services/supabaseService'

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json().catch(() => null)
    const amount = body?.amount
    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ error: 'amount must be a positive number' }, { status: 400 })
    }

    const result = await updateCredits(user.id, amount)
    if (result.error) return NextResponse.json({ error: result.error }, { status: 400 })
    return NextResponse.json({ balance: result.data })
  } catch (err) {
    console.error('[POST /api/credits/deduct]', err)
    return NextResponse.json({ error: 'Unable to deduct credits.' }, { status: 500 })
  }
}
