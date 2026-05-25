-- Vol D'oiseau — Social Posts Schema
-- Run this in the Supabase SQL editor after 001_initial_schema.sql

create table social_posts (
  id uuid primary key default gen_random_uuid(),
  dress_id uuid references dresses(id) on delete cascade,
  image_path text not null,
  video_path text,
  higgsfield_job_id text,
  caption_he text not null default '',
  caption_fr text not null default '',
  caption_en text not null default '',
  selected_languages text[] not null default '{fr,en,he}',
  hashtags text not null default '',
  status text not null default 'generating'
    check (status in ('generating', 'draft', 'approved', 'scheduled', 'published', 'failed')),
  platforms text[] not null default '{instagram,facebook}',
  scheduled_at timestamptz,
  blotato_post_id text,
  created_at timestamptz not null default now()
);

alter table social_posts enable row level security;

-- Only authenticated admins can access social posts
create policy "admin full access social_posts"
  on social_posts for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
