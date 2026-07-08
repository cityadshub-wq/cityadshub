export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          phone: string | null
          avatar_url: string | null
          role: 'admin' | 'employee' | 'client'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          phone?: string | null
          avatar_url?: string | null
          role: 'admin' | 'employee' | 'client'
          created_at?: string
          updated_at?: string
        }
        Update: {
          email?: string
          full_name?: string
          phone?: string | null
          avatar_url?: string | null
          role?: 'admin' | 'employee' | 'client'
          updated_at?: string
        }
      }
      services: {
        Row: {
          id: string
          name: string
          slug: string
          description: string
          icon: string
          category: string
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description: string
          icon: string
          category: string
          is_active?: boolean
          created_at?: string
        }
        Update: {
          name?: string
          slug?: string
          description?: string
          icon?: string
          category?: string
          is_active?: boolean
        }
      }
      leads: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          service: string
          status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost'
          assigned_to: string | null
          source: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          service: string
          status?: 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost'
          assigned_to?: string | null
          source?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          name?: string
          email?: string
          phone?: string | null
          service?: string
          status?: 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost'
          assigned_to?: string | null
          source?: string | null
          notes?: string | null
        }
      }
      blog_posts: {
        Row: {
          id: string
          title: string
          slug: string
          content: string
          excerpt: string
          featured_image: string | null
          category_id: string | null
          tags: string[] | null
          author_id: string
          status: 'draft' | 'published' | 'scheduled'
          scheduled_at: string | null
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          content: string
          excerpt: string
          featured_image?: string | null
          category_id?: string | null
          tags?: string[] | null
          author_id: string
          status: 'draft' | 'published' | 'scheduled'
          scheduled_at?: string | null
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: string
          slug?: string
          content?: string
          excerpt?: string
          featured_image?: string | null
          category_id?: string | null
          tags?: string[] | null
          author_id?: string
          status?: 'draft' | 'published' | 'scheduled'
          scheduled_at?: string | null
          published_at?: string | null
          updated_at?: string
        }
      }
      portfolio_items: {
        Row: {
          id: string
          title: string
          slug: string
          description: string
          category: string
          client_name: string | null
          completion_date: string | null
          results: string | null
          images: string[]
          videos: string[] | null
          is_featured: boolean
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description: string
          category: string
          client_name?: string | null
          completion_date?: string | null
          results?: string | null
          images: string[]
          videos?: string[] | null
          is_featured?: boolean
          created_at?: string
        }
        Update: {
          title?: string
          slug?: string
          description?: string
          category?: string
          client_name?: string | null
          completion_date?: string | null
          results?: string | null
          images?: string[]
          videos?: string[] | null
          is_featured?: boolean
        }
      }
      testimonials: {
        Row: {
          id: string
          client_name: string
          company: string | null
          content: string
          rating: number
          image_url: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          client_name: string
          company?: string | null
          content: string
          rating: number
          image_url?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          client_name?: string
          company?: string | null
          content?: string
          rating?: number
          image_url?: string | null
          is_active?: boolean
        }
      }
      contact_messages: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          subject: string
          message: string
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          subject: string
          message: string
          is_read?: boolean
          created_at?: string
        }
        Update: {
          name?: string
          email?: string
          phone?: string | null
          subject?: string
          message?: string
          is_read?: boolean
        }
      }
      business_registration_requests: {
        Row: {
          id: string
          service_type: string
          applicant_name: string
          email: string
          phone: string
          business_name: string | null
          documents: string[]
          status: 'pending' | 'processing' | 'completed' | 'rejected'
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          service_type: string
          applicant_name: string
          email: string
          phone: string
          business_name?: string | null
          documents?: string[]
          status?: 'pending' | 'processing' | 'completed' | 'rejected'
          notes?: string | null
          created_at?: string
        }
        Update: {
          service_type?: string
          applicant_name?: string
          email?: string
          phone?: string
          business_name?: string | null
          documents?: string[]
          status?: 'pending' | 'processing' | 'completed' | 'rejected'
          notes?: string | null
        }
      }
      referrals: {
        Row: {
          id: string
          referrer_id: string
          referred_email: string
          referred_name: string | null
          status: 'pending' | 'converted' | 'paid'
          commission: number | null
          created_at: string
        }
        Insert: {
          id?: string
          referrer_id: string
          referred_email: string
          referred_name?: string | null
          status?: 'pending' | 'converted' | 'paid'
          commission?: number | null
          created_at?: string
        }
        Update: {
          referred_email?: string
          referred_name?: string | null
          status?: 'pending' | 'converted' | 'paid'
          commission?: number | null
        }
      }
      faqs: {
        Row: {
          id: string
          question: string
          answer: string
          category: string | null
          order: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          question: string
          answer: string
          category?: string | null
          order?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          question?: string
          answer?: string
          category?: string | null
          order?: number
          is_active?: boolean
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: 'info' | 'success' | 'warning' | 'error'
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type: 'info' | 'success' | 'warning' | 'error'
          is_read?: boolean
          created_at?: string
        }
        Update: {
          title?: string
          message?: string
          type?: 'info' | 'success' | 'warning' | 'error'
          is_read?: boolean
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
