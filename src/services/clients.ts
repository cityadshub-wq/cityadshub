import { supabase } from '@/lib/supabase'
import type { Profile } from '@/types'

export async function getClients() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', 'client')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as unknown as Profile[]
}

export async function updateClient(id: string, updates: Partial<Profile>) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as unknown as Profile
}

export async function deleteClient(id: string) {
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', id)
  if (error) throw error
}
