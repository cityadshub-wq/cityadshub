import { useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

/**
 * Fetches via React Query and keeps the result live: any INSERT/UPDATE/DELETE
 * on `table` (from ANY client, admin panel included) invalidates this query,
 * so the data refetches with no manual page refresh.
 */
export function useRealtimeQuery<T>(
  table: string,
  queryKey: readonly unknown[],
  queryFn: () => Promise<T>,
  options?: { filter?: string }
) {
  const queryClient = useQueryClient()
  const keyString = JSON.stringify(queryKey)

  useEffect(() => {
    const channel = supabase
      .channel(`realtime:${table}:${keyString}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table, ...(options?.filter ? { filter: options.filter } : {}) },
        () => queryClient.invalidateQueries({ queryKey })
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table, keyString, options?.filter])

  return useQuery({ queryKey, queryFn })
}
