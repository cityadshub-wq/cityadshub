import { supabase } from '@/lib/supabase'
import type { FAQ } from '@/types'

export async function getFAQs() {
  const { data, error } = await supabase
    .from('faqs')
    .select('*')
    .eq('is_active', true)
    .order('order', { ascending: true })
  if (error) throw error
  return data as unknown as FAQ[]
}

export async function getAllFAQs() {
  const { data, error } = await supabase
    .from('faqs')
    .select('*')
    .order('order', { ascending: true })
  if (error) throw error
  return data as unknown as FAQ[]
}

export async function createFAQ(faq: Omit<FAQ, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('faqs')
    .insert(faq)
    .select()
    .single()
  if (error) throw error
  return data as unknown as FAQ
}

export async function updateFAQ(id: string, updates: Partial<FAQ>) {
  const { data, error } = await supabase
    .from('faqs')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as unknown as FAQ
}

export async function deleteFAQ(id: string) {
  const { error } = await supabase
    .from('faqs')
    .delete()
    .eq('id', id)
  if (error) throw error
}
