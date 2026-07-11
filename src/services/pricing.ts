import { supabase } from '@/lib/supabase'
import type { PricingPlan } from '@/types'

export async function getPricingPlans() {
  const { data, error } = await supabase
    .from('pricing_plans')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })
  if (error) throw error
  return data as unknown as PricingPlan[]
}

export async function getAllPricingPlans() {
  const { data, error } = await supabase
    .from('pricing_plans')
    .select('*')
    .order('sort_order', { ascending: true })
  if (error) throw error
  return data as unknown as PricingPlan[]
}

export async function createPricingPlan(plan: Omit<PricingPlan, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('pricing_plans')
    .insert(plan)
    .select()
    .single()
  if (error) throw error
  return data as unknown as PricingPlan
}

export async function updatePricingPlan(id: string, updates: Partial<PricingPlan>) {
  const { data, error } = await supabase
    .from('pricing_plans')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as unknown as PricingPlan
}

export async function deletePricingPlan(id: string) {
  const { error } = await supabase
    .from('pricing_plans')
    .delete()
    .eq('id', id)
  if (error) throw error
}
