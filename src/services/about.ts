import { supabase } from '@/lib/supabase'
import type { AboutContent } from '@/types'

export async function getAboutContent() {
  const { data, error } = await supabase
    .from('about_content')
    .select('*')
    .order('sort_order', { ascending: true })
  if (error) throw error
  return data as unknown as AboutContent[]
}

export async function getAboutSection(section: string) {
  const { data, error } = await supabase
    .from('about_content')
    .select('*')
    .eq('section', section)
    .single()
  if (error) throw error
  return data as unknown as AboutContent
}

export async function upsertAboutContent(data: Omit<AboutContent, 'id' | 'created_at' | 'updated_at'>) {
  const { data: result, error } = await supabase
    .from('about_content')
    .upsert(data)
    .select()
    .single()
  if (error) throw error
  return result as unknown as AboutContent
}

export async function updateAboutContent(id: string, updates: Partial<AboutContent>) {
  const { data, error } = await supabase
    .from('about_content')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as unknown as AboutContent
}
