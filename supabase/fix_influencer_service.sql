-- One-time content fix: the "Influencer Marketing" service row had a garbled test
-- description ("AboutoiWKJA") and trailing whitespace in name/slug left over from
-- CRUD testing. Targets the exact row by id, safe to re-run (idempotent — just sets
-- the same values again).

UPDATE services
SET
  name = 'Influencer Marketing',
  slug = 'influencer-marketing',
  description = 'Connect your brand with trusted content creators and influencers to boost reach, build customer trust, and drive real conversions across social platforms.'
WHERE id = '4a7d061f-64d4-4281-b495-acb03b3f7889';
