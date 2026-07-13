import { supabase, createScratchAuthClient } from '@/lib/supabase'
import type { Profile } from '@/types'

export async function getAdminUsers() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'admin')
    .order('created_at', { ascending: true })
  if (error) throw error
  return data as unknown as Profile[]
}

export async function createAdminUser(input: { email: string; password: string; full_name: string }) {
  // Signing up on the primary client would replace the currently logged-in admin's
  // session with the new user's session — use a throwaway client instead.
  const scratch = createScratchAuthClient()
  const { data, error } = await scratch.auth.signUp({
    email: input.email,
    password: input.password,
    options: { data: { full_name: input.full_name } },
  })
  if (error) throw error
  if (!data.user) throw new Error('Account creation did not return a user.')

  const { error: profileError } = await supabase
    .from('profiles')
    .upsert({ id: data.user.id, email: input.email, full_name: input.full_name, role: 'admin', is_active: true })
  if (profileError) throw profileError
}

export async function updateAdminUser(id: string, updates: { full_name?: string; is_active?: boolean }) {
  const { error } = await supabase.from('profiles').update(updates).eq('id', id)
  if (error) throw error
}

export async function deleteAdminUser(id: string) {
  const { error } = await supabase.from('profiles').delete().eq('id', id)
  if (error) throw error
}
