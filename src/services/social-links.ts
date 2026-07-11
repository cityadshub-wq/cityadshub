import { supabase } from '@/lib/supabase'
import type { SocialLink } from '@/types'

export async function getSocialLinks() {
  const { data, error } = await supabase
    .from('social_links')
    .select('*')
    .order('sort_order', { ascending: true })
  if (error) throw error
  return data as unknown as SocialLink[]
}

export async function createSocialLink(link: Omit<SocialLink, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('social_links')
    .insert(link)
    .select()
    .single()
  if (error) throw error
  return data as unknown as SocialLink
}

export async function updateSocialLink(id: string, updates: Partial<SocialLink>) {
  const { data, error } = await supabase
    .from('social_links')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as unknown as SocialLink
}

export async function deleteSocialLink(id: string) {
  const { error } = await supabase
    .from('social_links')
    .delete()
    .eq('id', id)
  if (error) throw error
}
