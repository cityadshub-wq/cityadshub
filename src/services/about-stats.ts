import { supabase } from '@/lib/supabase'
import type { AboutStat } from '@/types'

export async function getAboutStats(activeOnly = false) {
  let query = supabase.from('about_stats').select('*').order('sort_order', { ascending: true })
  if (activeOnly) query = query.eq('is_active', true)
  const { data, error } = await query
  if (error) throw error
  return data as unknown as AboutStat[]
}

export async function createAboutStat(stat: Omit<AboutStat, 'id' | 'created_at'>) {
  const { data, error } = await supabase.from('about_stats').insert(stat).select().single()
  if (error) throw error
  return data as unknown as AboutStat
}

export async function updateAboutStat(id: string, updates: Partial<AboutStat>) {
  const { data, error } = await supabase.from('about_stats').update(updates).eq('id', id).select().single()
  if (error) throw error
  return data as unknown as AboutStat
}

export async function deleteAboutStat(id: string) {
  const { error } = await supabase.from('about_stats').delete().eq('id', id)
  if (error) throw error
}

export async function reorderAboutStats(ids: string[]) {
  const results = await Promise.all(
    ids.map((id, index) => supabase.from('about_stats').update({ sort_order: index }).eq('id', id))
  )
  const failed = results.find((r) => r.error)
  if (failed?.error) throw failed.error
}
