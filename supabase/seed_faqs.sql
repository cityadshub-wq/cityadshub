-- One-time content seed: adds real FAQs so the website's FAQ section has something
-- to show (it now hides itself entirely when the table is empty, per the last fix).
-- Safe to re-run — the WHERE NOT EXISTS guard skips any question already present,
-- so running this twice won't duplicate rows.

INSERT INTO faqs (question, answer, category, "order", is_active)
SELECT * FROM (VALUES
  ('Do you offer influencer marketing campaigns?',
   'Yes — we connect your brand with vetted creators across Instagram, YouTube, and TikTok, handling everything from influencer selection and outreach to content briefs, performance tracking, and reporting.',
   'Influencer Marketing', 1, true),

  ('How do you select influencers for my brand?',
   'We match influencers to your brand based on audience demographics, engagement quality (not just follower count), niche relevance, and past brand-safety performance, then validate reach with historical campaign data before you approve them.',
   'Influencer Marketing', 2, true),

  ('What services does City Ads Hub provide?',
   'Meta Ads, Google Ads, SEO, influencer marketing, web & mobile development, social media management, branding, graphic design, video production, and business registration (GST, MSME, FSSAI, and more).',
   'General', 3, true),

  ('How much do your services cost?',
   'Plans start at ₹9,999/month for small businesses, with mid-tier and enterprise plans scaling based on ad spend, platforms, and deliverables. See our Pricing section for full details, or contact us for a custom quote.',
   'Pricing', 4, true),

  ('How long does it take to see results?',
   'Paid ad campaigns typically show measurable traction within 2-4 weeks. SEO and organic influencer campaigns are longer-term, usually 3-6 months for meaningful ranking and audience growth.',
   'General', 5, true),

  ('Do you require long-term contracts?',
   'No — our plans are month-to-month with no long-term lock-in. We ask for a 30-day notice period to cancel, so campaigns already in flight can wrap up cleanly.',
   'Pricing', 6, true),

  ('Can I track the performance of my campaigns?',
   'Yes — every plan includes a monthly performance report, and higher-tier plans get a live dashboard covering reach, engagement, conversions, and ad spend ROI in real time.',
   'General', 7, true),

  ('How do I get started?',
   'Fill out the contact form on this page or reach out via WhatsApp/email — we''ll schedule a free consultation call to understand your goals and recommend the right plan within 24 hours.',
   'General', 8, true)
) AS v(question, answer, category, "order", is_active)
WHERE NOT EXISTS (SELECT 1 FROM faqs WHERE faqs.question = v.question);
