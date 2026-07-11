import { useRealtimeQuery } from '@/hooks/use-realtime-query'
import { getSettings } from '@/services/settings'

export function useSettings() {
  return useRealtimeQuery('website_settings', ['website_settings'], getSettings)
}
