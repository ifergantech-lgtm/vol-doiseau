-- Vol D'oiseau — Initial Schema
-- Run this in the Supabase SQL editor

-- ─── Tables ───────────────────────────────────────────────────────────────────

create table dresses (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title jsonb not null default '{}',
  description jsonb not null default '{}',
  category text not null check (category in ('evening', 'wedding', 'cocktail')),
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

-- Seed the single class_info row
insert into class_info (id, children_schedule, adults_schedule, price_per_course, num_sessions)
values (
  1,
  '{"he":"ימים א׳–ה׳ | 16:00–18:00","fr":"Dim.–Jeu. | 16h00–18h00","en":"Sun–Thu | 16:00–18:00"}',
  '{"he":"ימים א׳–ה׳ | 11:00–13:00","fr":"Dim.–Jeu. | 11h00–13h00","en":"Sun–Thu | 11:00–13:00"}',
  null,
  6
)
on conflict do nothing;

-- ─── Storage ─────────────────────────────────────────────────────────────────
-- Create a private bucket called "dress-images" in the Supabase dashboard
-- Storage → New bucket → Name: dress-images → Public: OFF

-- ─── RLS ─────────────────────────────────────────────────────────────────────

alter table dresses enable row level security;
alter table enquiries enable row level security;
alter table class_info enable row level security;

-- dresses: public can read active dresses
create policy "public read active dresses"
  on dresses for select
  using (is_active = true);

-- dresses: authenticated admin can do everything
create policy "admin full access dresses"
  on dresses for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- enquiries: anyone can insert
create policy "public insert enquiries"
  on enquiries for insert
  with check (true);

-- enquiries: admin can read and update
create policy "admin read enquiries"
  on enquiries for select
  using (auth.role() = 'authenticated');

create policy "admin update enquiries"
  on enquiries for update
  using (auth.role() = 'authenticated');

-- class_info: public can read
create policy "public read class_info"
  on class_info for select
  using (true);

-- class_info: admin can update
create policy "admin full class_info"
  on class_info for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
