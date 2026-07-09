import { supabase } from '@/lib/supabase'
import type { HeroCard } from '@/types'

export async function getHeroCards(activeOnly = false) {
  let query = supabase.from('hero_cards').select('*').order('sort_order', { ascending: true })
  if (activeOnly) query = query.eq('is_active', true)
  const { data, error } = await query
  if (error) throw error
  return data as unknown as HeroCard[]
}

export async function createHeroCard(card: Omit<HeroCard, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase.from('hero_cards').insert(card).select().single()
  if (error) throw error
  return data as unknown as HeroCard
}

export async function updateHeroCard(id: string, updates: Partial<HeroCard>) {
  const { data, error } = await supabase.from('hero_cards').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select().single()
  if (error) throw error
  return data as unknown as HeroCard
}

export async function deleteHeroCard(id: string) {
  const { error } = await supabase.from('hero_cards').delete().eq('id', id)
  if (error) throw error
}

export async function reorderHeroCards(ids: string[]) {
  const updates = ids.map((id, index) => ({
    id,
    sort_order: index,
    updated_at: new Date().toISOString(),
  }))
  const { error } = await supabase.from('hero_cards').upsert(updates)
  if (error) throw error
}
