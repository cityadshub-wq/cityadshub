-- CITY ADS HUB - Complete Database Migration
-- Run this in your Supabase SQL Editor

-- 1. Create tables for new content types

CREATE TABLE IF NOT EXISTS about_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section TEXT NOT NULL UNIQUE,
  title TEXT,
  subtitle TEXT,
  description TEXT,
  content TEXT,
  image_url TEXT,
  images TEXT[] DEFAULT '{}',
  icon TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS growth_timeline (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  year TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  image_url TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pricing_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT,
  price DECIMAL(10,2),
  original_price DECIMAL(10,2),
  currency TEXT DEFAULT 'INR',
  interval TEXT DEFAULT 'month',
  description TEXT,
  features TEXT[] DEFAULT '{}',
  is_popular BOOLEAN DEFAULT false,
  button_text TEXT DEFAULT 'Get Started',
  button_link TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS portfolio_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS media_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'image',
  mime_type TEXT,
  size INT DEFAULT 0,
  alt_text TEXT,
  folder TEXT DEFAULT 'general',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS site_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page TEXT NOT NULL DEFAULT 'home',
  section TEXT NOT NULL,
  key TEXT NOT NULL,
  value TEXT,
  type TEXT DEFAULT 'text',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(page, section, key)
);

CREATE TABLE IF NOT EXISTS social_links (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL UNIQUE,
  url TEXT NOT NULL,
  icon TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Add missing columns to existing tables

ALTER TABLE services ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE services ADD COLUMN IF NOT EXISTS icon_url TEXT;
ALTER TABLE services ADD COLUMN IF NOT EXISTS button_text TEXT DEFAULT 'Learn More';
ALTER TABLE services ADD COLUMN IF NOT EXISTS button_link TEXT;
ALTER TABLE services ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 0;
ALTER TABLE services ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE services ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS full_description TEXT;
ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS technology TEXT[] DEFAULT '{}';
ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS project_url TEXT;
ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 0;
ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS seo_title TEXT;
ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS seo_description TEXT;
ALTER TABLE portfolio_items ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS video_url TEXT;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 0;
ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS read_time INT DEFAULT 5;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS seo_title TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS seo_description TEXT;

ALTER TABLE website_settings ADD COLUMN IF NOT EXISTS analytics_code TEXT;
ALTER TABLE website_settings ADD COLUMN IF NOT EXISTS whatsapp_number TEXT;
ALTER TABLE website_settings ADD COLUMN IF NOT EXISTS footer_text TEXT;
ALTER TABLE website_settings ADD COLUMN IF NOT EXISTS footer_description TEXT;
ALTER TABLE website_settings ADD COLUMN IF NOT EXISTS copyright_text TEXT;
ALTER TABLE website_settings ADD COLUMN IF NOT EXISTS success_message TEXT DEFAULT 'Thank you! We will get back to you within 24 hours.';
ALTER TABLE website_settings ADD COLUMN IF NOT EXISTS form_title TEXT DEFAULT 'Send us a Message';

-- 3. Insert default data

INSERT INTO site_content (page, section, key, value, type)
VALUES
  ('home', 'hero', 'badge', 'Trusted Influencer Marketing Agency', 'text'),
  ('home', 'hero', 'title', 'Turning Local Reach Into Real Customers', 'text'),
  ('home', 'hero', 'subtitle', 'We help businesses grow with data-driven marketing strategies, cutting-edge technology, and creative excellence.', 'text'),
  ('home', 'hero', 'button_1_text', 'Explore Services', 'text'),
  ('home', 'hero', 'button_1_link', '/#services', 'text'),
  ('home', 'hero', 'button_2_text', 'Get a Free Quote', 'text'),
  ('home', 'hero', 'button_2_link', '/#contact', 'text')
ON CONFLICT (page, section, key) DO NOTHING;

-- Force-update the hero title/subtitle copy to the new influencer-marketing messaging.
-- (Plain INSERT ... ON CONFLICT DO NOTHING above only seeds these on a fresh database —
-- it never touches a row that already exists, so an explicit UPDATE is needed to roll
-- this content change out to a database that was seeded before this change.)
UPDATE site_content SET value = 'Build Powerful<br /><span class="text-primary">Influencer</span><br />Campaigns That<br />Drive <span class="text-orange">Real Growth</span>', updated_at = now()
  WHERE page = 'home' AND section = 'hero' AND key = 'title';
UPDATE site_content SET value = 'We connect your brand with trusted creators to increase awareness, build customer trust, and generate measurable business growth through strategic influencer marketing campaigns.', updated_at = now()
  WHERE page = 'home' AND section = 'hero' AND key = 'subtitle';

INSERT INTO site_content (page, section, key, value, type)
VALUES
  ('home', 'stats', 'stat_1_value', '150+', 'text'),
  ('home', 'stats', 'stat_1_label', 'Projects Completed', 'text'),
  ('home', 'stats', 'stat_2_value', '98%', 'text'),
  ('home', 'stats', 'stat_2_label', 'Client Satisfaction', 'text'),
  ('home', 'stats', 'stat_3_value', '50+', 'text'),
  ('home', 'stats', 'stat_3_label', 'Team Members', 'text'),
  ('home', 'stats', 'stat_4_value', '5+', 'text'),
  ('home', 'stats', 'stat_4_label', 'Years Experience', 'text')
ON CONFLICT (page, section, key) DO NOTHING;

INSERT INTO about_content (section, title, subtitle, description, sort_order)
VALUES
  ('intro', 'About Us', 'We''re on a Mission to Transform Local Businesses', 'Founded in 2020, City Ads Hub has grown from a small team of passionate marketers to a full-service digital agency helping businesses across India achieve remarkable growth.', 1),
  ('mission', 'Our Mission', 'To empower local businesses', 'To empower local businesses with cutting-edge digital strategies that drive measurable growth.', 2),
  ('vision', 'Our Vision', 'To be India''s most trusted partner', 'To be India''s most trusted digital growth partner for businesses of all sizes.', 3),
  ('values', 'Our Values', 'Integrity & Excellence', 'Integrity, transparency, innovation, and client success are at the core of everything we do.', 4),
  ('story', 'Our Story', 'How We Started', 'City Ads Hub was born from a simple observation: local businesses were struggling to compete in the digital age. We started as a small Meta Ads agency in Mumbai, helping local restaurants and shops reach customers online.', 5)
ON CONFLICT (section) DO NOTHING;

-- growth_timeline/pricing_plans/portfolio_categories had no unique constraint on their
-- natural key, so "ON CONFLICT DO NOTHING" below was never actually able to detect a
-- conflict — every re-run of this file inserted a fresh set of duplicate rows (only the
-- auto-generated `id` was unique). Dedupe any rows already duplicated by a prior run,
-- then add a real unique constraint so this is safe to re-run going forward.
DELETE FROM growth_timeline a USING growth_timeline b WHERE a.year = b.year AND a.id > b.id;
ALTER TABLE growth_timeline DROP CONSTRAINT IF EXISTS growth_timeline_year_key;
ALTER TABLE growth_timeline ADD CONSTRAINT growth_timeline_year_key UNIQUE (year);

DELETE FROM pricing_plans a USING pricing_plans b WHERE a.slug = b.slug AND a.id > b.id;
ALTER TABLE pricing_plans DROP CONSTRAINT IF EXISTS pricing_plans_slug_key;
ALTER TABLE pricing_plans ADD CONSTRAINT pricing_plans_slug_key UNIQUE (slug);

DELETE FROM portfolio_categories a USING portfolio_categories b WHERE a.slug = b.slug AND a.id > b.id;
ALTER TABLE portfolio_categories DROP CONSTRAINT IF EXISTS portfolio_categories_slug_key;
ALTER TABLE portfolio_categories ADD CONSTRAINT portfolio_categories_slug_key UNIQUE (slug);

INSERT INTO growth_timeline (year, title, description, sort_order)
VALUES
  ('2020', 'Founded in Mumbai', 'Started as a small Meta Ads agency helping local businesses.', 1),
  ('2021', 'Expanded Services', 'Added Google Ads, SEO, and web development to our offerings.', 2),
  ('2022', 'Team of 25+', 'Grew to 25+ professionals across marketing, design, and tech.', 3),
  ('2023', '100+ Clients', 'Reached 100+ satisfied clients across India.', 4),
  ('2024', 'Full-Service Agency', '50+ team members serving 150+ clients with end-to-end solutions.', 5)
ON CONFLICT (year) DO NOTHING;

INSERT INTO pricing_plans (name, slug, price, description, features, is_popular, sort_order)
VALUES
  ('Starter', 'starter', 9999, 'Perfect for small businesses starting their digital journey.', ARRAY['Social Media Management (2 platforms)', 'Basic SEO Audit', 'Monthly Performance Report', 'Email Support', '1 Social Post per Week'], false, 1),
  ('Business', 'business', 24999, 'Ideal for growing businesses ready to scale to the next level.', ARRAY['Social Media Management (4 platforms)', 'Google Ads Management', 'Advanced SEO', 'Content Creation (8 posts/month)', 'Website Optimization', 'Priority Support'], true, 2),
  ('Enterprise', 'enterprise', 49999, 'Complete solution for established businesses with premium needs.', ARRAY['Full Digital Marketing Suite', 'All Ad Platforms Management', 'Premium SEO + Local SEO', 'Video Production (2 videos/month)', 'Website Development', 'Dedicated Account Manager', '24/7 Priority Support'], false, 3)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO portfolio_categories (name, slug, sort_order)
VALUES
  ('All', 'all', 0),
  ('Websites', 'websites', 1),
  ('Marketing', 'marketing', 2),
  ('Branding', 'branding', 3),
  ('SEO', 'seo', 4)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO social_links (platform, url, icon, sort_order)
VALUES
  ('facebook', '#', 'Facebook', 1),
  ('instagram', '#', 'Instagram', 2),
  ('youtube', '#', 'Youtube', 3),
  ('linkedin', '#', 'Linkedin', 4)
ON CONFLICT (platform) DO NOTHING;

-- 4. Storage bucket used by the admin Media Library and image pickers
-- (ImageUpload bucket="media" and the Media Library page upload directly to this bucket)
INSERT INTO storage.buckets (id, name, public) VALUES
  ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Public can view images" ON storage.objects;
  CREATE POLICY "Public can view images"
    ON storage.objects FOR SELECT
    USING (bucket_id IN ('logos', 'portfolio', 'gallery', 'blog-images', 'media'));
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Admins can manage images" ON storage.objects;
  CREATE POLICY "Admins can manage images"
    ON storage.objects FOR ALL
    USING (
      bucket_id IN ('logos', 'portfolio', 'gallery', 'blog-images', 'media')
      AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );
END $$;

-- 5. Row Level Security for tables introduced/left ungated so far
-- (services and hero_cards had no RLS at all; the new CMS tables below never had it enabled)
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE about_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE growth_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Public can read services" ON services;
  CREATE POLICY "Public can read services" ON services FOR SELECT USING (true);
  DROP POLICY IF EXISTS "Admins manage services" ON services;
  CREATE POLICY "Admins manage services" ON services FOR ALL
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Public can read hero cards" ON hero_cards;
  CREATE POLICY "Public can read hero cards" ON hero_cards FOR SELECT USING (is_active = true);
  DROP POLICY IF EXISTS "Admins manage hero cards" ON hero_cards;
  CREATE POLICY "Admins manage hero cards" ON hero_cards FOR ALL
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Public can read about content" ON about_content;
  CREATE POLICY "Public can read about content" ON about_content FOR SELECT USING (is_active = true);
  DROP POLICY IF EXISTS "Admins manage about content" ON about_content;
  CREATE POLICY "Admins manage about content" ON about_content FOR ALL
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Public can read growth timeline" ON growth_timeline;
  CREATE POLICY "Public can read growth timeline" ON growth_timeline FOR SELECT USING (is_active = true);
  DROP POLICY IF EXISTS "Admins manage growth timeline" ON growth_timeline;
  CREATE POLICY "Admins manage growth timeline" ON growth_timeline FOR ALL
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Public can read pricing plans" ON pricing_plans;
  CREATE POLICY "Public can read pricing plans" ON pricing_plans FOR SELECT USING (is_active = true);
  DROP POLICY IF EXISTS "Admins manage pricing plans" ON pricing_plans;
  CREATE POLICY "Admins manage pricing plans" ON pricing_plans FOR ALL
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Public can read portfolio categories" ON portfolio_categories;
  CREATE POLICY "Public can read portfolio categories" ON portfolio_categories FOR SELECT USING (is_active = true);
  DROP POLICY IF EXISTS "Admins manage portfolio categories" ON portfolio_categories;
  CREATE POLICY "Admins manage portfolio categories" ON portfolio_categories FOR ALL
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Admins manage media items" ON media_items;
  CREATE POLICY "Admins manage media items" ON media_items FOR ALL
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Public can read site content" ON site_content;
  CREATE POLICY "Public can read site content" ON site_content FOR SELECT USING (true);
  DROP POLICY IF EXISTS "Admins manage site content" ON site_content;
  CREATE POLICY "Admins manage site content" ON site_content FOR ALL
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Public can read social links" ON social_links;
  CREATE POLICY "Public can read social links" ON social_links FOR SELECT USING (is_active = true);
  DROP POLICY IF EXISTS "Admins manage social links" ON social_links;
  CREATE POLICY "Admins manage social links" ON social_links FOR ALL
    USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
END $$;

-- 6. profiles had SELECT + "update own row" only — no admin bypass and no DELETE at all,
-- which silently blocked the admin Clients/Employees pages from editing or removing other users.
--
-- IMPORTANT: every "is this user an admin" check in this file (and in 00001_initial_schema.sql)
-- does EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'). When that check
-- runs from WITHIN a policy defined ON profiles itself (as the two policies below do), Postgres
-- can't resolve the self-reference and throws "infinite recursion detected in policy for relation
-- profiles" (42P17) — and since every other table's admin policy also queries profiles, that one
-- broken policy takes the ENTIRE database down, not just the profiles table.
--
-- Fix: a SECURITY DEFINER function runs with its owner's privileges (the postgres role, which has
-- BYPASSRLS), so the SELECT inside it never re-triggers Row Level Security on profiles — breaking
-- the recursion. Every profiles policy must go through this function; other tables' policies were
-- never self-referencing and don't need to change, but are updated too for consistency/performance.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin');
$$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
  CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT
    USING (is_admin());

  DROP POLICY IF EXISTS "Admins can update any profile" ON profiles;
  CREATE POLICY "Admins can update any profile" ON profiles FOR UPDATE
    USING (is_admin());

  DROP POLICY IF EXISTS "Admins can delete profiles" ON profiles;
  CREATE POLICY "Admins can delete profiles" ON profiles FOR DELETE
    USING (is_admin());
END $$;

-- 7. Re-point every other admin-check policy at is_admin() too (same effective rule, no behavior
-- change — these were never self-referencing, this just removes the duplicated inline subquery).
DO $$ BEGIN
  DROP POLICY IF EXISTS "Admins can manage leads" ON leads;
  CREATE POLICY "Admins can manage leads" ON leads FOR ALL USING (is_admin());

  DROP POLICY IF EXISTS "Admins manage blog" ON blog_posts;
  CREATE POLICY "Admins manage blog" ON blog_posts FOR ALL USING (is_admin());

  DROP POLICY IF EXISTS "Admins manage portfolio" ON portfolio_items;
  CREATE POLICY "Admins manage portfolio" ON portfolio_items FOR ALL USING (is_admin());

  DROP POLICY IF EXISTS "Admins manage testimonials" ON testimonials;
  CREATE POLICY "Admins manage testimonials" ON testimonials FOR ALL USING (is_admin());

  DROP POLICY IF EXISTS "Admins can view messages" ON contact_messages;
  CREATE POLICY "Admins can view messages" ON contact_messages FOR ALL USING (is_admin());

  DROP POLICY IF EXISTS "Admins manage requests" ON business_registration_requests;
  CREATE POLICY "Admins manage requests" ON business_registration_requests FOR ALL USING (is_admin());

  DROP POLICY IF EXISTS "Admins manage referrals" ON referrals;
  CREATE POLICY "Admins manage referrals" ON referrals FOR ALL USING (is_admin());

  DROP POLICY IF EXISTS "Admins manage faqs" ON faqs;
  CREATE POLICY "Admins manage faqs" ON faqs FOR ALL USING (is_admin());

  DROP POLICY IF EXISTS "Admins manage projects" ON projects;
  CREATE POLICY "Admins manage projects" ON projects FOR ALL USING (is_admin());

  DROP POLICY IF EXISTS "Admins manage invoices" ON invoices;
  CREATE POLICY "Admins manage invoices" ON invoices FOR ALL USING (is_admin());

  DROP POLICY IF EXISTS "Admins manage payments" ON payments;
  CREATE POLICY "Admins manage payments" ON payments FOR ALL USING (is_admin());

  DROP POLICY IF EXISTS "Admins manage settings" ON website_settings;
  CREATE POLICY "Admins manage settings" ON website_settings FOR ALL USING (is_admin());
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Admins manage services" ON services;
  CREATE POLICY "Admins manage services" ON services FOR ALL USING (is_admin());

  DROP POLICY IF EXISTS "Admins manage hero cards" ON hero_cards;
  CREATE POLICY "Admins manage hero cards" ON hero_cards FOR ALL USING (is_admin());

  DROP POLICY IF EXISTS "Admins manage about content" ON about_content;
  CREATE POLICY "Admins manage about content" ON about_content FOR ALL USING (is_admin());

  DROP POLICY IF EXISTS "Admins manage growth timeline" ON growth_timeline;
  CREATE POLICY "Admins manage growth timeline" ON growth_timeline FOR ALL USING (is_admin());

  DROP POLICY IF EXISTS "Admins manage pricing plans" ON pricing_plans;
  CREATE POLICY "Admins manage pricing plans" ON pricing_plans FOR ALL USING (is_admin());

  DROP POLICY IF EXISTS "Admins manage portfolio categories" ON portfolio_categories;
  CREATE POLICY "Admins manage portfolio categories" ON portfolio_categories FOR ALL USING (is_admin());

  DROP POLICY IF EXISTS "Admins manage media items" ON media_items;
  CREATE POLICY "Admins manage media items" ON media_items FOR ALL USING (is_admin());

  DROP POLICY IF EXISTS "Admins manage site content" ON site_content;
  CREATE POLICY "Admins manage site content" ON site_content FOR ALL USING (is_admin());

  DROP POLICY IF EXISTS "Admins manage social links" ON social_links;
  CREATE POLICY "Admins manage social links" ON social_links FOR ALL USING (is_admin());
END $$;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Admins can manage images" ON storage.objects;
  CREATE POLICY "Admins can manage images"
    ON storage.objects FOR ALL
    USING (
      bucket_id IN ('logos', 'portfolio', 'gallery', 'blog-images', 'media')
      AND is_admin()
    );
END $$;

-- 8. Blog: fields needed for full CRUD (author display name, ordering, featured flag,
-- and a plain-text category to replace the old category_id free-text field).
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS author TEXT;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 0;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE blog_posts ADD COLUMN IF NOT EXISTS category TEXT;

-- one-time backfill from the old category_id column, if it exists and category is unset
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blog_posts' AND column_name = 'category_id') THEN
    UPDATE blog_posts SET category = category_id WHERE category IS NULL;
  END IF;
END $$;

-- 9. Realtime: broadcast row changes on every public-facing content table so the
-- website (and any open admin tab) updates live with no manual refresh. Each table
-- is added individually since ALTER PUBLICATION ... ADD TABLE errors (rather than
-- no-oping) if the table is already a publication member.
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE services; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE blog_posts; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE social_links; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE website_settings; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE pricing_plans; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE testimonials; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE faqs; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE about_content; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE growth_timeline; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE site_content; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE portfolio_items; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE hero_cards; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE portfolio_categories; EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE media_items; EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 10. About page CMS completion: the "Our Story" left image/badge and the Statistics
-- cards were never actually read from the database by the public About section (even
-- though about_content.image_url already existed and was uploadable in the admin) —
-- this adds the remaining fields needed and a dedicated table for the stat cards.

ALTER TABLE about_content ADD COLUMN IF NOT EXISTS image_alt TEXT;
ALTER TABLE about_content ADD COLUMN IF NOT EXISTS badge_value TEXT;
ALTER TABLE about_content ADD COLUMN IF NOT EXISTS badge_label TEXT;

ALTER TABLE growth_timeline ADD COLUMN IF NOT EXISTS button_text TEXT;
ALTER TABLE growth_timeline ADD COLUMN IF NOT EXISTS button_link TEXT;

-- seed the "Our Story" floating experience badge to match what was previously hardcoded
UPDATE about_content SET badge_value = '5+', badge_label = 'Years'
WHERE section = 'story' AND badge_value IS NULL;

CREATE TABLE IF NOT EXISTS about_stats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  icon TEXT NOT NULL DEFAULT 'Users',
  title TEXT NOT NULL,
  value TEXT NOT NULL,
  subtitle TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE about_stats ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  DROP POLICY IF EXISTS "Public can read about stats" ON about_stats;
  CREATE POLICY "Public can read about stats" ON about_stats FOR SELECT USING (is_active = true);
  DROP POLICY IF EXISTS "Admins manage about stats" ON about_stats;
  CREATE POLICY "Admins manage about stats" ON about_stats FOR ALL USING (is_admin());
END $$;

-- seed with the 4 stats that were previously hardcoded, only on a fresh/empty table
INSERT INTO about_stats (icon, title, value, sort_order)
SELECT * FROM (VALUES
  ('Users', 'Team Members', '50+', 1),
  ('Award', 'Projects Done', '150+', 2),
  ('TrendingUp', 'Satisfaction', '98%', 3),
  ('Building2', 'Clients Served', '500+', 4)
) AS v(icon, title, value, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM about_stats);

DO $$ BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE about_stats; EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 11. Admin Users management: lets an admin deactivate another admin's access without
-- deleting their account outright. Enforced at login (admin-login.tsx) and on every
-- protected-route check (use-protected-route.tsx), same as the existing role check.
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
