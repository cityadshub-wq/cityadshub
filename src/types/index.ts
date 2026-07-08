export interface Profile {
  id: string
  email: string
  full_name: string
  phone?: string
  avatar_url?: string
  role: 'admin' | 'employee' | 'client'
  created_at: string
  updated_at: string
}

export interface Service {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  category: string
  is_active: boolean
  created_at: string
}

export interface Project {
  id: string
  title: string
  slug: string
  description: string
  client_id: string
  category: string
  status: 'active' | 'completed' | 'on_hold'
  start_date: string
  end_date?: string
  budget?: number
  created_at: string
}

export interface Lead {
  id: string
  name: string
  email: string
  phone?: string
  service: string
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost'
  assigned_to?: string
  source?: string
  notes?: string
  created_at: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  featured_image?: string
  category_id?: string
  tags?: string[]
  author_id: string
  status: 'draft' | 'published' | 'scheduled'
  scheduled_at?: string
  published_at?: string
  created_at: string
  updated_at: string
}

export interface PortfolioItem {
  id: string
  title: string
  slug: string
  description: string
  category: string
  client_name?: string
  completion_date?: string
  results?: string
  images: string[]
  videos?: string[]
  is_featured: boolean
  created_at: string
}

export interface Testimonial {
  id: string
  client_name: string
  company?: string
  content: string
  rating: number
  image_url?: string
  is_active: boolean
  created_at: string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  is_read: boolean
  created_at: string
}

export interface BusinessRegistrationRequest {
  id: string
  service_type: string
  applicant_name: string
  email: string
  phone: string
  business_name?: string
  documents: string[]
  status: 'pending' | 'processing' | 'completed' | 'rejected'
  notes?: string
  created_at: string
}

export interface Referral {
  id: string
  referrer_id: string
  referred_email: string
  referred_name?: string
  status: 'pending' | 'converted' | 'paid'
  commission?: number
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  is_read: boolean
  created_at: string
}

export interface FAQ {
  id: string
  question: string
  answer: string
  category?: string
  order: number
  is_active: boolean
  created_at: string
}
