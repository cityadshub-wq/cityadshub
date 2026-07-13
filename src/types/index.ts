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
  image_url?: string
  icon_url?: string
  button_text?: string
  button_link?: string
  sort_order?: number
  is_featured?: boolean
  created_at: string
  updated_at?: string
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
  read_time?: number
  seo_title?: string
  seo_description?: string
  author?: string
  sort_order?: number
  is_featured?: boolean
  category?: string
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
  full_description?: string
  technology?: string[]
  project_url?: string
  sort_order?: number
  seo_title?: string
  seo_description?: string
  created_at: string
  updated_at?: string
}

export interface Testimonial {
  id: string
  client_name: string
  company?: string
  content: string
  rating: number
  image_url?: string
  is_active: boolean
  video_url?: string
  sort_order?: number
  created_at: string
  updated_at?: string
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

export interface Invoice {
  id: string
  client_id: string
  project_id?: string
  invoice_number: string
  amount: number
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  due_date: string
  issued_date: string
  paid_at?: string
  items: InvoiceItem[]
  notes?: string
  created_at: string
}

export interface InvoiceItem {
  description: string
  quantity: number
  rate: number
  amount: number
}

export interface Payment {
  id: string
  invoice_id: string
  client_id: string
  amount: number
  method: 'bank_transfer' | 'upi' | 'card' | 'cash' | 'other'
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  transaction_id?: string
  paid_at: string
  notes?: string
  created_at: string
}

export interface WebsiteSettings {
  id: string
  site_name: string
  tagline: string
  logo_url?: string
  favicon_url?: string
  primary_color: string
  secondary_color: string
  facebook_url?: string
  instagram_url?: string
  youtube_url?: string
  linkedin_url?: string
  whatsapp_number?: string
  contact_email: string
  contact_phone: string
  address: string
  business_hours: string
  meta_description?: string
  meta_keywords?: string
  analytics_code?: string
  footer_text?: string
  footer_description?: string
  copyright_text?: string
  success_message?: string
  form_title?: string
  updated_at: string
}

export interface SiteContent {
  id: string
  page: string
  section: string
  key: string
  value: string
  type: string
  created_at: string
  updated_at: string
}

export interface AboutContent {
  id: string
  section: string
  title?: string
  subtitle?: string
  description?: string
  content?: string
  image_url?: string
  images?: string[]
  icon?: string
  image_alt?: string
  badge_value?: string
  badge_label?: string
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface GrowthTimeline {
  id: string
  year: string
  title: string
  description?: string
  icon?: string
  image_url?: string
  button_text?: string
  button_link?: string
  sort_order: number
  is_active: boolean
  created_at: string
}

export interface AboutStat {
  id: string
  icon: string
  title: string
  value: string
  subtitle?: string
  sort_order: number
  is_active: boolean
  created_at: string
}

export interface PricingPlan {
  id: string
  name: string
  slug?: string
  price: number
  original_price?: number
  currency: string
  interval: string
  description?: string
  features: string[]
  is_popular: boolean
  button_text: string
  button_link?: string
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface PortfolioCategory {
  id: string
  name: string
  slug?: string
  sort_order: number
  is_active: boolean
  created_at: string
}

export interface MediaItem {
  id: string
  name: string
  url: string
  type: string
  mime_type?: string
  size: number
  alt_text?: string
  folder: string
  created_at: string
}

export interface SocialLink {
  id: string
  platform: string
  url: string
  icon?: string
  sort_order: number
  is_active: boolean
  created_at: string
}

export interface HeroCard {
  id: string
  title: string
  subtitle?: string
  icon_name: string
  color: string
  image_url?: string
  link?: string
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
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
