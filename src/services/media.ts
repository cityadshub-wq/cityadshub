import { supabase } from '@/lib/supabase'
import type { MediaItem } from '@/types'

export async function getMediaItems() {
  const { data, error } = await supabase
    .from('media_items')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as unknown as MediaItem[]
}

export async function createMediaItem(item: Omit<MediaItem, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('media_items')
    .insert(item)
    .select()
    .single()
  if (error) throw error
  return data as unknown as MediaItem
}

export async function updateMediaItem(id: string, updates: Partial<MediaItem>) {
  const { data, error } = await supabase
    .from('media_items')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as unknown as MediaItem
}

export async function deleteMediaItem(id: string) {
  const { error } = await supabase
    .from('media_items')
    .delete()
    .eq('id', id)
  if (error) throw error
}
