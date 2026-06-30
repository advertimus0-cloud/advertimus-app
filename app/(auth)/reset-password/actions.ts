'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function updatePassword(newPassword: string) {
  if (typeof newPassword !== 'string' || newPassword.length < 8) {
    return { error: 'Password must be at least 8 characters.' }
  }

  let success = false
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: 'Your reset link has expired. Please request a new one.' }
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) return { error: error.message }
    success = true
  } catch (err) {
    console.error('[reset-password.updatePassword]', err)
    return { error: 'Unable to reset your password right now. Please try again.' }
  }

  if (success) redirect('/dashboard')
}
