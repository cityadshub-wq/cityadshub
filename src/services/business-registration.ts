import { supabase } from '@/lib/supabase'
import type { BusinessRegistrationRequest } from '@/types'

export async function getRegistrationRequests() {
  const { data, error } = await supabase
    .from('business_registration_requests')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as unknown as BusinessRegistrationRequest[]
}

export async function createRegistrationRequest(req: Omit<BusinessRegistrationRequest, 'id' | 'created_at' | 'status'>) {
  const { data, error } = await supabase
    .from('business_registration_requests')
    .insert({ ...req, status: 'pending' })
    .select()
    .single()
  if (error) throw error
  return data as unknown as BusinessRegistrationRequest
}

export async function updateRegistrationRequest(id: string, updates: Partial<BusinessRegistrationRequest>) {
  const { data, error } = await supabase
    .from('business_registration_requests')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as unknown as BusinessRegistrationRequest
}
