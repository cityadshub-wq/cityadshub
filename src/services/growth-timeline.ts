import { supabase } from '@/lib/supabase'
import type { GrowthTimeline } from '@/types'

export async function getGrowthTimeline() {
  const { data, error } = await supabase
    .from('growth_timeline')
    .select('*')
    .order('sort_order', { ascending: true })
  if (error) throw error
  return data as unknown as GrowthTimeline[]
}

export async function createGrowthTimeline(item: Omit<GrowthTimeline, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('growth_timeline')
    .insert(item)
    .select()
    .single()
  if (error) throw error
  return data as unknown as GrowthTimeline
}

export async function updateGrowthTimeline(id: string, updates: Partial<GrowthTimeline>) {
  const { data, error } = await supabase
    .from('growth_timeline')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as unknown as GrowthTimeline
}

export async function deleteGrowthTimeline(id: string) {
  const { error } = await supabase
    .from('growth_timeline')
    .delete()
    .eq('id', id)
  if (error) throw error
}
