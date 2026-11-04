-- Run AFTER 0003_seed_campaign_projects.sql.
-- Publishes the 9 starter projects with temporary cover images (replace them in /admin when your designs are ready).
-- Brand name is cleared so "Your Brand Name" never shows publicly; add the real brand in /admin.
update projects set published = true, client_name = null
where slug in (
  'black-friday-fashion-sale','black-friday-electronics-deals','cyber-monday-beauty-promo',
  'christmas-gift-guide','christmas-home-bundles','christmas-fashion-festive-edit',
  'new-year-fresh-start-sale','new-year-collection-launch','new-year-gadget-offers'
);
-- Featured: first project of each campaign
update projects set featured = true where slug in ('black-friday-fashion-sale','christmas-gift-guide','new-year-fresh-start-sale');
-- Temporary covers (files in the site's /public/images folder). New Year projects keep the built-in artwork until you upload covers.
update projects set cover_image_path = '/images/hero-banner.webp'       where slug in ('black-friday-fashion-sale','black-friday-electronics-deals');
update projects set cover_image_path = '/images/hero-blackfriday.jpg'   where slug = 'cyber-monday-beauty-promo';
update projects set cover_image_path = '/images/hero-gifting.webp'      where slug in ('christmas-gift-guide','christmas-home-bundles','christmas-fashion-festive-edit');
