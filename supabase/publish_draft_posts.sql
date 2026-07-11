-- One-time content change: publishes any blog post currently sitting in Draft or
-- Scheduled status, so it becomes visible on the public Blog listing/detail pages
-- and the homepage Blog teaser section.
--
-- Safe to re-run — the WHERE clause only touches rows that aren't already published,
-- so running this again after everything's published is a no-op.

UPDATE blog_posts
SET status = 'published', published_at = COALESCE(published_at, now())
WHERE status <> 'published';
