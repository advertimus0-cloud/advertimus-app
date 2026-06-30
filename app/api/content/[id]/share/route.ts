import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

async function requireAuth() {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    return user
  } catch {
    return null
  }
}

export async function GET() {
  const user = await requireAuth()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json({ status: 'not_implemented' }, { status: 501 })
}

export async function POST() {
  const user = await requireAuth()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.json({ status: 'not_implemented' }, { status: 501 })
}
