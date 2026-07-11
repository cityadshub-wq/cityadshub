import { supabase } from '@/lib/supabase'
import type { SiteContent } from '@/types'

export async function getSiteContent(page: string) {
  const { data, error } = await supabase
    .from('site_content')
    .select('*')
    .eq('page', page)
  if (error) throw error
  return data as unknown as SiteContent[]
}

export async function getSiteContentByKey(page: string, section: string, key: string) {
  const { data, error } = await supabase
    .from('site_content')
    .select('*')
    .eq('page', page)
    .eq('section', section)
    .eq('key', key)
    .single()
  if (error) throw error
  return data as unknown as SiteContent
}

export async function upsertSiteContent(data: Omit<SiteContent, 'id' | 'created_at' | 'updated_at'>) {
  const { data: result, error } = await supabase
    .from('site_content')
    .upsert(data, { onConflict: 'page,section,key' })
    .select()
    .single()
  if (error) throw error
  return result as unknown as SiteContent
}

export async function updateSiteContent(id: string, updates: Partial<SiteContent>) {
  const { data, error } = await supabase
    .from('site_content')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as unknown as SiteContent
}

export async function deleteSiteContent(id: string) {
  const { error } = await supabase
    .from('site_content')
    .delete()
    .eq('id', id)
  if (error) throw error
}
