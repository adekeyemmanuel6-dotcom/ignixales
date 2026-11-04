-- Per-service image galleries (banners, flyers, social posts, email copy samples).
create table if not exists service_images (
  id uuid primary key default gen_random_uuid(),
  service_slug text not null,          -- banner-design | flyer-design | email-copywriting | social-media-design
  path text not null,                  -- object path in the public `portfolio` bucket
  title text,
  brand text,
  published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists service_images_idx on service_images(service_slug, sort_order);
alter table service_images enable row level security;
drop policy if exists "public read published service images" on service_images;
create policy "public read published service images" on service_images for select using (published);
