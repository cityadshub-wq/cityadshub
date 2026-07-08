import { supabase } from '@/lib/supabase'
import type { ContactMessage } from '@/types'

export async function getContactMessages() {
  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as unknown as ContactMessage[]
}

export async function createContactMessage(msg: Omit<ContactMessage, 'id' | 'created_at' | 'is_read'>) {
  const { data, error } = await supabase
    .from('contact_messages')
    .insert(msg)
    .select()
    .single()
  if (error) throw error
  return data as unknown as ContactMessage
}

export async function markMessageRead(id: string) {
  const { error } = await supabase
    .from('contact_messages')
    .update({ is_read: true })
    .eq('id', id)
  if (error) throw error
}
