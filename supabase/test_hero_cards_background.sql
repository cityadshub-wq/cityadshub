-- Cleanup: clears the temporary test background image used to verify the Hero Cards
-- Background feature. Run this to go back to the default gradient look, or set your
-- own real image via Admin -> Hero Cards instead.

UPDATE site_content
SET value = ''
WHERE page = 'home' AND section = 'hero' AND key = 'hero_cards_background_url';
