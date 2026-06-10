-- Vol D'oiseau — Full Database Setup
-- Paste this entire file into Supabase SQL Editor and click Run

-- ─── Tables ───────────────────────────────────────────────────────────────────

create table dresses (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title jsonb not null default '{}',
  description jsonb not null default '{}',
  category text not null check (category in ('evening', 'wedding')),
  availability text not null check (availability in ('sale', 'rental', 'both')),
  price_sale numeric,
  price_rental numeric,
  images text[] not null default '{}',
  is_featured boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  dress_id uuid references dresses(id) on delete set null,
  enquiry_type text not null check (enquiry_type in ('dress', 'class', 'alteration', 'general')),
  status text not null default 'new' check (status in ('new', 'read', 'replied')),
  created_at timestamptz not null default now()
);

create table class_info (
  id int primary key default 1,
  children_schedule jsonb not null default '{}',
  adults_schedule jsonb not null default '{}',
  price_per_course numeric,
  num_sessions int not null default 6,
  notes jsonb not null default '{}'
);

insert into class_info (id, children_schedule, adults_schedule, price_per_course, num_sessions)
values (
  1,
  '{"he":"ימים א׳–ה׳ | 16:00–17:30","fr":"Dim.–Jeu. | 16h00–17h30","en":"Sun–Thu | 16:00–17:30"}',
  '{"he":"ימים א׳–ה׳ | 11:00–12:30","fr":"Dim.–Jeu. | 11h00–12h30","en":"Sun–Thu | 11:00–12:30"}',
  null,
  6
)
on conflict do nothing;

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

-- ─── Row Level Security ───────────────────────────────────────────────────────

alter table dresses       enable row level security;
alter table enquiries     enable row level security;
alter table class_info    enable row level security;
alter table social_posts  enable row level security;

-- dresses: anyone can read active dresses
create policy "public read active dresses"
  on dresses for select using (is_active = true);

-- dresses: authenticated admin can do everything
create policy "admin full access dresses"
  on dresses for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- enquiries: anyone can submit
create policy "public insert enquiries"
  on enquiries for insert with check (true);

-- enquiries: admin can read and update
create policy "admin read enquiries"
  on enquiries for select using (auth.role() = 'authenticated');

create policy "admin update enquiries"
  on enquiries for update using (auth.role() = 'authenticated');

-- class_info: anyone can read
create policy "public read class_info"
  on class_info for select using (true);

-- class_info: admin can update
create policy "admin full class_info"
  on class_info for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- social_posts: admin only
create policy "admin full access social_posts"
  on social_posts for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
