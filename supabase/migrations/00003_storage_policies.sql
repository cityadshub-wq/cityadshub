-- Migration: Add RLS policies for storage buckets
-- Enables public reading and admin uploading to public buckets

-- Allow public read access on all public buckets
DO $$ BEGIN
  DROP POLICY IF EXISTS "Public can view images" ON storage.objects;
  CREATE POLICY "Public can view images"
    ON storage.objects FOR SELECT
    USING (bucket_id IN ('logos', 'portfolio', 'gallery', 'blog-images'));
END $$;

-- Allow authenticated admin users to upload/update/delete in public buckets
DO $$ BEGIN
  DROP POLICY IF EXISTS "Admins can manage images" ON storage.objects;
  CREATE POLICY "Admins can manage images"
    ON storage.objects FOR ALL
    USING (
      bucket_id IN ('logos', 'portfolio', 'gallery', 'blog-images')
      AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    );
END $$;
