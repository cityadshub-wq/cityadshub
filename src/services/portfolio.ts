import { supabase } from '@/lib/supabase'
import type { PortfolioItem } from '@/types'

export async function getPortfolioItems() {
  const { data, error } = await supabase
    .from('portfolio_items')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as unknown as PortfolioItem[]
}

export async function createPortfolioItem(item: Omit<PortfolioItem, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('portfolio_items')
    .insert(item)
    .select()
    .single()
  if (error) throw error
  return data as unknown as PortfolioItem
}

export async function updatePortfolioItem(id: string, updates: Partial<PortfolioItem>) {
  const { data, error } = await supabase
    .from('portfolio_items')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as unknown as PortfolioItem
}

export async function deletePortfolioItem(id: string) {
  const { error } = await supabase
    .from('portfolio_items')
    .delete()
    .eq('id', id)
  if (error) throw error
}
