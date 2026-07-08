-- City Ads Hub - Complete Database Schema
-- Run this in Supabase SQL Editor

-- 1. Create custom types (IF NOT EXISTS for re-runnable migration)
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('admin', 'employee', 'client');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'qualified', 'proposal', 'won', 'lost');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE blog_status AS ENUM ('draft', 'published', 'scheduled');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE request_status AS ENUM ('pending', 'processing', 'completed', 'rejected');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE referral_status AS ENUM ('pending', 'converted', 'paid');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE notification_type AS ENUM ('info', 'success', 'warning', 'error');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- 2. Create tables
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  role user_role NOT NULL DEFAULT 'client',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  icon TEXT NOT NULL DEFAULT 'Megaphone',
  category TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  service TEXT NOT NULL,
  status lead_status NOT NULL DEFAULT 'new',
  assigned_to UUID REFERENCES profiles(id),
  source TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  featured_image TEXT,
  category_id TEXT,
  tags TEXT[] DEFAULT '{}',
  author_id UUID NOT NULL REFERENCES profiles(id),
  status blog_status NOT NULL DEFAULT 'draft',
  scheduled_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  client_id UUID NOT NULL REFERENCES profiles(id),
  category TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'on_hold')),
  start_date DATE NOT NULL,
  end_date DATE,
  budget NUMERIC(10,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES profiles(id),
  project_id UUID REFERENCES projects(id),
  invoice_number TEXT NOT NULL UNIQUE,
  amount NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  due_date DATE NOT NULL,
  issued_date DATE NOT NULL,
  paid_at TIMESTAMPTZ,
  items JSONB NOT NULL DEFAULT '[]',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES invoices(id),
  client_id UUID NOT NULL REFERENCES profiles(id),
  amount NUMERIC(10,2) NOT NULL,
  method TEXT NOT NULL CHECK (method IN ('bank_transfer', 'upi', 'card', 'cash', 'other')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  transaction_id TEXT,
  paid_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS website_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name TEXT NOT NULL DEFAULT 'City Ads Hub',
  tagline TEXT NOT NULL DEFAULT 'Turning Local Reach Into Real Customers.',
  logo_url TEXT,
  favicon_url TEXT,
  primary_color TEXT DEFAULT '#1565FF',
  secondary_color TEXT DEFAULT '#081A3A',
  facebook_url TEXT,
  instagram_url TEXT,
  youtube_url TEXT,
  linkedin_url TEXT,
  whatsapp_number TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  address TEXT,
  business_hours TEXT,
  meta_description TEXT,
  meta_keywords TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS portfolio_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  client_name TEXT,
  completion_date TEXT,
  results TEXT,
  images TEXT[] NOT NULL DEFAULT '{}',
  videos TEXT[] DEFAULT '{}',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  company TEXT,
  content TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS business_registration_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_type TEXT NOT NULL,
  applicant_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  business_name TEXT,
  documents TEXT[] NOT NULL DEFAULT '{}',
  status request_status NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES profiles(id),
  referred_email TEXT NOT NULL,
  referred_name TEXT,
  status referral_status NOT NULL DEFAULT 'pending',
  commission NUMERIC(10,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type notification_type NOT NULL DEFAULT 'info',
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT,
  "order" INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Create indexes
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_assigned ON leads(assigned_to);
CREATE INDEX IF NOT EXISTS idx_blog_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_author ON blog_posts(author_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_featured ON portfolio_items(is_featured);
CREATE INDEX IF NOT EXISTS idx_projects_client ON projects(client_id);
CREATE INDEX IF NOT EXISTS idx_invoices_client ON invoices(client_id);
CREATE INDEX IF NOT EXISTS idx_payments_client ON payments(client_id);

-- 4. Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS blog_posts_updated_at ON blog_posts;
CREATE TRIGGER blog_posts_updated_at
  BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 5. Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    'client'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 6. Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_registration_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies (drop existing before creating for re-runnability)
DO $$ BEGIN
  DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
  CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);

  DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
  CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

  DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
  CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

  DROP POLICY IF EXISTS "Admins can manage leads" ON leads;
  CREATE POLICY "Admins can manage leads" ON leads FOR ALL
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'employee')));

  DROP POLICY IF EXISTS "Clients can view own leads" ON leads;
  CREATE POLICY "Clients can view own leads" ON leads FOR SELECT
    USING (email = (SELECT email FROM profiles WHERE id = auth.uid()));

  DROP POLICY IF EXISTS "Public can read published" ON blog_posts;
  CREATE POLICY "Public can read published" ON blog_posts FOR SELECT USING (status = 'published');

  DROP POLICY IF EXISTS "Admins manage blog" ON blog_posts;
  CREATE POLICY "Admins manage blog" ON blog_posts FOR ALL
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

  DROP POLICY IF EXISTS "Public can read portfolio" ON portfolio_items;
  CREATE POLICY "Public can read portfolio" ON portfolio_items FOR SELECT USING (true);

  DROP POLICY IF EXISTS "Admins manage portfolio" ON portfolio_items;
  CREATE POLICY "Admins manage portfolio" ON portfolio_items FOR ALL
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

  DROP POLICY IF EXISTS "Public can read testimonials" ON testimonials;
  CREATE POLICY "Public can read testimonials" ON testimonials FOR SELECT USING (is_active = true);

  DROP POLICY IF EXISTS "Admins manage testimonials" ON testimonials;
  CREATE POLICY "Admins manage testimonials" ON testimonials FOR ALL
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

  DROP POLICY IF EXISTS "Anyone can submit contact" ON contact_messages;
  CREATE POLICY "Anyone can submit contact" ON contact_messages FOR INSERT WITH CHECK (true);

  DROP POLICY IF EXISTS "Admins can view messages" ON contact_messages;
  CREATE POLICY "Admins can view messages" ON contact_messages FOR ALL
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

  DROP POLICY IF EXISTS "Anyone can apply" ON business_registration_requests;
  CREATE POLICY "Anyone can apply" ON business_registration_requests FOR INSERT WITH CHECK (true);

  DROP POLICY IF EXISTS "Admins manage requests" ON business_registration_requests;
  CREATE POLICY "Admins manage requests" ON business_registration_requests FOR ALL
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

  DROP POLICY IF EXISTS "Users view own notifications" ON notifications;
  CREATE POLICY "Users view own notifications" ON notifications FOR SELECT USING (user_id = auth.uid());

  DROP POLICY IF EXISTS "Users view own referrals" ON referrals;
  CREATE POLICY "Users view own referrals" ON referrals FOR SELECT USING (referrer_id = auth.uid());

  DROP POLICY IF EXISTS "Admins manage referrals" ON referrals;
  CREATE POLICY "Admins manage referrals" ON referrals FOR ALL
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

  DROP POLICY IF EXISTS "Public can read faqs" ON faqs;
  CREATE POLICY "Public can read faqs" ON faqs FOR SELECT USING (is_active = true);

  DROP POLICY IF EXISTS "Admins manage faqs" ON faqs;
  CREATE POLICY "Admins manage faqs" ON faqs FOR ALL
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

  DROP POLICY IF EXISTS "Admins manage projects" ON projects;
  CREATE POLICY "Admins manage projects" ON projects FOR ALL
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'employee')));

  DROP POLICY IF EXISTS "Clients view own projects" ON projects;
  CREATE POLICY "Clients view own projects" ON projects FOR SELECT USING (client_id = auth.uid());

  DROP POLICY IF EXISTS "Admins manage invoices" ON invoices;
  CREATE POLICY "Admins manage invoices" ON invoices FOR ALL
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'employee')));

  DROP POLICY IF EXISTS "Clients view own invoices" ON invoices;
  CREATE POLICY "Clients view own invoices" ON invoices FOR SELECT USING (client_id = auth.uid());

  DROP POLICY IF EXISTS "Admins manage payments" ON payments;
  CREATE POLICY "Admins manage payments" ON payments FOR ALL
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'employee')));

  DROP POLICY IF EXISTS "Clients view own payments" ON payments;
  CREATE POLICY "Clients view own payments" ON payments FOR SELECT USING (client_id = auth.uid());

  DROP POLICY IF EXISTS "Public can read settings" ON website_settings;
  CREATE POLICY "Public can read settings" ON website_settings FOR SELECT USING (true);

  DROP POLICY IF EXISTS "Admins manage settings" ON website_settings;
  CREATE POLICY "Admins manage settings" ON website_settings FOR ALL
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
END $$;

-- 8. Storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES
  ('logos', 'logos', true),
  ('portfolio', 'portfolio', true),
  ('gallery', 'gallery', true),
  ('videos', 'videos', false),
  ('blog-images', 'blog-images', true),
  ('documents', 'documents', false),
  ('client-files', 'client-files', false)
ON CONFLICT (id) DO NOTHING;
