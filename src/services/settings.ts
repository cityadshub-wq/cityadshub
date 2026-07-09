import { supabase } from '@/lib/supabase'
import type { WebsiteSettings } from '@/types'

export async function getSettings(): Promise<WebsiteSettings | null> {
  const { data } = await supabase.from('website_settings').select('*').single()
  return data as unknown as WebsiteSettings | null
}

export async function upsertSettings(settings: Partial<WebsiteSettings>): Promise<WebsiteSettings> {
  const existing = await getSettings()
  const { data, error } = await supabase.from('website_settings')
    .upsert({ ...(existing ? { id: existing.id } : {}), ...settings, updated_at: new Date().toISOString() })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data as unknown as WebsiteSettings
}
