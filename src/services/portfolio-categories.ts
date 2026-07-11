import { supabase } from '@/lib/supabase'
import type { PortfolioCategory } from '@/types'

export async function getPortfolioCategories() {
  const { data, error } = await supabase
    .from('portfolio_categories')
    .select('*')
    .order('sort_order', { ascending: true })
  if (error) throw error
  return data as unknown as PortfolioCategory[]
}

export async function createPortfolioCategory(cat: Omit<PortfolioCategory, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('portfolio_categories')
    .insert(cat)
    .select()
    .single()
  if (error) throw error
  return data as unknown as PortfolioCategory
}

export async function updatePortfolioCategory(id: string, updates: Partial<PortfolioCategory>) {
  const { data, error } = await supabase
    .from('portfolio_categories')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as unknown as PortfolioCategory
}

export async function deletePortfolioCategory(id: string) {
  const { error } = await supabase
    .from('portfolio_categories')
    .delete()
    .eq('id', id)
  if (error) throw error
}
