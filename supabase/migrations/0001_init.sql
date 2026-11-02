-- Ignixales schema. Run in the Supabase SQL editor or `supabase db push`.
-- All writes happen server-side with the service-role key (after validation / admin auth).
-- RLS is enabled everywhere; anonymous visitors may only READ published public content.

create extension if not exists "pgcrypto";

create table if not exists site_content (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  client_name text,
  industry text,                       -- fashion | beauty | electronics | lifestyle | home | accessories
  campaign_type text,                  -- black-friday | christmas | new-year | other
  service_category text,               -- banner-design | flyer-design | email-copywriting | social-media-design
  description text,
  objective text,
  creative_direction text,
  deliverables text[] not null default '{}',
  cover_image_path text,
  video_url text,
  project_date date,
  featured boolean not null default false,
  is_concept boolean not null default true,
  published boolean not null default false,
  related_services text[] not null default '{}',
  related_package text,
  tags text[] not null default '{}',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  path text not null,
  kind text not null default 'gallery',  -- gallery | mockup | before | after
  caption text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists project_images_project_idx on project_images(project_id, sort_order);

create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text,
  role text,
  quote text not null,
  photo_path text,
  published boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists submissions (
  id uuid primary key default gen_random_uuid(),
  reference text unique not null,
  status text not null default 'New',   -- New | Reviewing | Awaiting Information | In Progress | Awaiting Approval | Completed
  package_slug text not null,
  services jsonb not null default '{}',
  addons jsonb not null default '[]',
  customer jsonb not null,
  campaign jsonb not null default '{}',
  extra jsonb not null default '{}',
  estimated_price numeric(10,2),
  internal_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists submission_files (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid references submissions(id) on delete cascade,
  draft_token text,                     -- set while the form is in progress, linked on submit
  path text not null,
  original_name text not null,
  mime text not null,
  size bigint not null,
  category text not null default 'other',
  created_at timestamptz not null default now()
);
create index if not exists submission_files_sub_idx on submission_files(submission_id);
create index if not exists submission_files_draft_idx on submission_files(draft_token);

create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  data jsonb not null,
  status text not null default 'New',
  created_at timestamptz not null default now()
);

create table if not exists website_requests (
  id uuid primary key default gen_random_uuid(),
  data jsonb not null,
  status text not null default 'New',
  created_at timestamptz not null default now()
);

-- ---------- RLS ----------
alter table site_content enable row level security;
alter table projects enable row level security;
alter table project_images enable row level security;
alter table testimonials enable row level security;
alter table submissions enable row level security;
alter table submission_files enable row level security;
alter table contact_messages enable row level security;
alter table website_requests enable row level security;

drop policy if exists "public read content" on site_content;
create policy "public read content" on site_content for select using (true);
drop policy if exists "public read published projects" on projects;
create policy "public read published projects" on projects for select using (published);
drop policy if exists "public read images of published projects" on project_images;
create policy "public read images of published projects" on project_images for select
  using (exists (select 1 from projects p where p.id = project_id and p.published));
drop policy if exists "public read published testimonials" on testimonials;
create policy "public read published testimonials" on testimonials for select using (published);
-- submissions, submission_files, contact_messages, website_requests: no policies => no anon/auth access.

-- ---------- Storage ----------
-- portfolio: public read (published imagery). project-assets: PRIVATE customer uploads.
insert into storage.buckets (id, name, public, file_size_limit)
values ('portfolio', 'portfolio', true, 15728640)
on conflict (id) do nothing;
insert into storage.buckets (id, name, public, file_size_limit)
values ('project-assets', 'project-assets', false, 26214400)
on conflict (id) do nothing;
-- No storage policies are created for project-assets, so only the service role can read/write it.
-- Admins download via short-lived signed URLs generated server-side.
