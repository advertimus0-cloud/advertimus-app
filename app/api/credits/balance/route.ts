import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getUserCredits } from '@/lib/services/supabaseService'

export async function GET() {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const result = await getUserCredits(user.id)
    if (result.error) return NextResponse.json({ error: result.error }, { status: 500 })
    return NextResponse.json({ balance: result.data })
  } catch (err) {
    console.error('[GET /api/credits/balance]', err)
    return NextResponse.json({ error: 'Unable to fetch balance.' }, { status: 500 })
  }
}
