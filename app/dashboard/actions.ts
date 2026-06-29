'use server'

import { redirect } from 'next/navigation'
import { logout as logoutService } from '@/lib/services/authService'

export async function logout() {
  await logoutService()
  redirect('/login')
}
