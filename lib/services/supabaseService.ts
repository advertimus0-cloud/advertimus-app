import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getCurrentUser } from './authService'

export interface ServiceResult<T> {
  data?: T
  error?: string
}

// Re-export getCurrentUser under the name required by the spec
export { getCurrentUser as getUser }

// ─── Projects ────────────────────────────────────────────────────────────────

export async function getProjects(userId: string): Promise<ServiceResult<unknown[]>> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (error) return { error: error.message }
    return { data: data ?? [] }
  } catch (err) {
    console.error('[supabaseService.getProjects]', err)
    return { error: 'Unable to fetch projects.' }
  }
}

export async function createProject(
  userId: string,
  name: string,
  description?: string
): Promise<ServiceResult<unknown>> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('projects')
      .insert({ user_id: userId, name, description: description ?? null })
      .select()
      .single()
    if (error) return { error: error.message }
    return { data }
  } catch (err) {
    console.error('[supabaseService.createProject]', err)
    return { error: 'Unable to create project.' }
  }
}

export async function getProject(
  userId: string,
  projectId: string
): Promise<ServiceResult<unknown>> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .eq('user_id', userId)
      .single()
    if (error) return { error: error.message }
    return { data }
  } catch (err) {
    console.error('[supabaseService.getProject]', err)
    return { error: 'Unable to fetch project.' }
  }
}

export async function updateProject(
  userId: string,
  projectId: string,
  updates: Partial<{ name: string; description: string }>
): Promise<ServiceResult<unknown>> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('projects')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', projectId)
      .eq('user_id', userId)
      .select()
      .single()
    if (error) return { error: error.message }
    return { data }
  } catch (err) {
    console.error('[supabaseService.updateProject]', err)
    return { error: 'Unable to update project.' }
  }
}

export async function deleteProject(
  userId: string,
  projectId: string
): Promise<ServiceResult<boolean>> {
  try {
    const supabase = createClient()
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId)
      .eq('user_id', userId)
    if (error) return { error: error.message }
    return { data: true }
  } catch (err) {
    console.error('[supabaseService.deleteProject]', err)
    return { error: 'Unable to delete project.' }
  }
}

// ─── Credits ──────────────────────────────────────────────────────────────────

export async function getUserCredits(userId: string): Promise<ServiceResult<number>> {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('user_credits')
      .select('balance')
      .eq('user_id', userId)
      .single()
    if (error) return { error: error.message }
    return { data: data.balance as number }
  } catch (err) {
    console.error('[supabaseService.getUserCredits]', err)
    return { error: 'Unable to fetch credit balance.' }
  }
}

/**
 * Deducts `amount` credits from a user's balance (pass a positive number to deduct).
 *
 * Uses the admin (service-role) client deliberately — the `user_credits` table has
 * no user-writable RLS policy, so balance changes can only happen through trusted
 * backend code that has already verified the action being paid for (e.g. a completed
 * AI generation). This prevents users from manipulating their own credit balance.
 */
export async function updateCredits(
  userId: string,
  amount: number
): Promise<ServiceResult<number>> {
  try {
    const admin = createAdminClient()

    const { data: current, error: readError } = await admin
      .from('user_credits')
      .select('balance')
      .eq('user_id', userId)
      .single()
    if (readError) return { error: readError.message }

    const newBalance = (current.balance as number) - amount
    if (newBalance < 0) return { error: 'Insufficient credits.' }

    const { data, error } = await admin
      .from('user_credits')
      .update({ balance: newBalance, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .select('balance')
      .single()
    if (error) return { error: error.message }
    return { data: data.balance as number }
  } catch (err) {
    console.error('[supabaseService.updateCredits]', err)
    return { error: 'Unable to update credit balance.' }
  }
}
