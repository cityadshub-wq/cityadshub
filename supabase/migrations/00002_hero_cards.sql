-- Migration: Create hero_cards table for homepage hero section
CREATE TABLE IF NOT EXISTS hero_cards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  icon_name TEXT NOT NULL DEFAULT 'Megaphone',
  color TEXT NOT NULL DEFAULT '#FF6B00',
  image_url TEXT,
  link TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed default hero cards
INSERT INTO hero_cards (title, subtitle, icon_name, color, sort_order) VALUES
  ('Meta Ads', 'Facebook & Instagram advertising', 'Megaphone', '#0066FF', 0),
  ('Web Dev', 'Websites & mobile apps', 'Smartphone', '#FF6B00', 1),
  ('SEO', 'Search engine optimization', 'Globe', '#22C55E', 2),
  ('Media', 'Photography & video production', 'Camera', '#0066FF', 3)
ON CONFLICT DO NOTHING;
