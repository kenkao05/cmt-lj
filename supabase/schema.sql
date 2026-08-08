-- ============================================
-- Conference Management Tool — Supabase Schema
-- Run this in Supabase SQL Editor
-- ============================================

create extension if not exists "pgcrypto";

-- Conferences table
create table conferences (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  department text not null,
  status text check (status in ('past','current','upcoming')) not null default 'upcoming',
  description text,
  brochure_url text,
  flyer_url text,
  start_date date,
  submission_deadline date,
  registration_fee text default 'Pay at venue / Payment link coming soon',
  created_at timestamptz default now()
);

-- Submissions table
create table submissions (
  id uuid primary key default gen_random_uuid(),
  abstract_id text unique not null,
  conference_id uuid references conferences(id) on delete cascade,
  author_id uuid references auth.users(id) on delete set null,
  author_name text not null,
  author_email text not null,
  paper_title text not null,
  type text check (type in ('paper','poster')) not null default 'paper',
  file_url text not null,
  file_type text not null,
  status text check (status in ('submitted','under_review','accepted','rejected')) default 'submitted',
  created_at timestamptz default now()
);

-- Function to auto-generate Abstract ID
create or replace function generate_abstract_id()
returns text as $$
declare
  new_id text;
begin
  new_id := 'ABS-' || lpad(floor(random() * 100000)::text, 5, '0');
  return new_id;
end;
$$ language plpgsql;

-- Row Level Security
alter table conferences enable row level security;
alter table submissions enable row level security;

-- Anyone can read conferences (public site)
create policy "Public read conferences"
  on conferences for select
  using (true);

-- Only authenticated admin can write conferences (handled at app layer via single admin account;
-- for simplicity, allow any authenticated user to write — since only one admin account exists)
create policy "Authenticated users can insert conferences"
  on conferences for insert
  to authenticated
  with check (true);

create policy "Authenticated users can update conferences"
  on conferences for update
  to authenticated
  using (true);

-- Authors can insert their own submissions
create policy "Authenticated users can insert own submissions"
  on submissions for insert
  to authenticated
  with check (auth.uid() = author_id);

-- Authors can read their own submissions; authenticated (admin) can read all
create policy "Users can view own submissions"
  on submissions for select
  to authenticated
  using (true);

-- Only authenticated (admin) can update submission status
create policy "Authenticated users can update submissions"
  on submissions for update
  to authenticated
  using (true);

-- Storage buckets (run in Supabase Dashboard > Storage, or via SQL below)
insert into storage.buckets (id, name, public)
values ('conference-materials', 'conference-materials', true)
on conflict do nothing;

insert into storage.buckets (id, name, public)
values ('submissions', 'submissions', true)
on conflict do nothing;

-- Storage policies
create policy "Public read conference-materials"
  on storage.objects for select
  using (bucket_id = 'conference-materials');

create policy "Authenticated upload conference-materials"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'conference-materials');

create policy "Public read submissions"
  on storage.objects for select
  using (bucket_id = 'submissions');

create policy "Authenticated upload submissions"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'submissions');
