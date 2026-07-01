'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export interface SettingsResult<T = void> {
  data?: T
  error?: string
}

export interface ProfileFields {
  company?: string
  fullName?: string
  phone?: string
  website?: string
}

// Accepts either the legacy single-string (company only) or a full fields object.
export async function updateProfile(
  input: string | ProfileFields
): Promise<SettingsResult> {
  const fields: ProfileFields =
    typeof input === 'string' ? { company: input } : input

  // ── Server-side validation (§5 — never trust the client) ──
  const limits: Record<keyof ProfileFields, number> = {
    company: 100,
    fullName: 80,
    phone: 30,
    website: 200,
  }
  for (const [key, max] of Object.entries(limits) as [keyof ProfileFields, number][]) {
    const val = fields[key]
    if (val !== undefined && (typeof val !== 'string' || val.length > max)) {
      return { error: `${key} must be ${max} characters or fewer.` }
    }
  }
  if (fields.phone && !/^[+\d\s().-]*$/.test(fields.phone)) {
    return { error: 'Phone number contains invalid characters.' }
  }

  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated.' }

    const data: Record<string, string | null> = {}
    if (fields.company !== undefined) data.company = fields.company.trim() || null
    if (fields.fullName !== undefined) data.full_name = fields.fullName.trim() || null
    if (fields.phone !== undefined) data.phone = fields.phone.trim() || null
    if (fields.website !== undefined) data.website = fields.website.trim() || null

    const { error } = await supabase.auth.updateUser({ data })
    if (error) return { error: error.message }
    return {}
  } catch (err) {
    console.error('[settings.updateProfile]', err)
    return { error: 'Unable to update your profile right now.' }
  }
}

export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<SettingsResult> {
  if (typeof newPassword !== 'string' || newPassword.length < 8) {
    return { error: 'New password must be at least 8 characters.' }
  }
  if (typeof currentPassword !== 'string' || currentPassword.length === 0) {
    return { error: 'Enter your current password.' }
  }

  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user?.email) return { error: 'Not authenticated.' }

    // Re-verify the current password before allowing a change — defense
    // against a hijacked/active session being used to lock out the real owner.
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    })
    if (verifyError) return { error: 'Current password is incorrect.' }

    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) return { error: error.message }
    return {}
  } catch (err) {
    console.error('[settings.changePassword]', err)
    return { error: 'Unable to change your password right now.' }
  }
}

export async function deleteAccount(confirmPassword: string): Promise<SettingsResult | void> {
  if (typeof confirmPassword !== 'string' || confirmPassword.length === 0) {
    return { error: 'Enter your password to confirm.' }
  }

  let deleted = false
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user?.email) return { error: 'Not authenticated.' }

    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: confirmPassword,
    })
    if (verifyError) return { error: 'Password is incorrect.' }

    const admin = createAdminClient()
    const { error } = await admin.auth.admin.deleteUser(user.id)
    if (error) return { error: error.message }

    await supabase.auth.signOut()
    deleted = true
  } catch (err) {
    console.error('[settings.deleteAccount]', err)
    return { error: 'Unable to delete your account right now.' }
  }

  if (deleted) redirect('/login')
}
