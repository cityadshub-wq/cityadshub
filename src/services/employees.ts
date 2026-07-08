import { supabase } from '@/lib/supabase'
import type { Profile } from '@/types'

export async function getEmployees() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .in('role', ['employee', 'admin'])
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as unknown as Profile[]
}

export async function updateEmployee(id: string, updates: Partial<Profile>) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as unknown as Profile
}
