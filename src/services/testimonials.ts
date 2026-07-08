import { supabase } from '@/lib/supabase'
import type { Testimonial } from '@/types'

export async function getTestimonials() {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as unknown as Testimonial[]
}

export async function createTestimonial(t: Omit<Testimonial, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('testimonials')
    .insert(t)
    .select()
    .single()
  if (error) throw error
  return data as unknown as Testimonial
}

export async function updateTestimonial(id: string, updates: Partial<Testimonial>) {
  const { data, error } = await supabase
    .from('testimonials')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as unknown as Testimonial
}

export async function deleteTestimonial(id: string) {
  const { error } = await supabase
    .from('testimonials')
    .delete()
    .eq('id', id)
  if (error) throw error
}
