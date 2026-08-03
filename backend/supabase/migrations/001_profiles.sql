-- Migration 001: Profiles and User Preferences Tables
-- Enables uuid extension if not enabled

create extension if not exists "uuid-ossp";

-- 1. Profiles table (linked to auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  first_name text,
  surname text,
  avatar_url text,
  onboarding_completed boolean not null default false,
  onboarding_completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. User Preferences table
create table if not exists public.user_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  language_tag text not null default 'en',
  locale text not null default 'en-NG',
  madhhab_id text not null default 'MALIKI',
  currency_code text not null default 'NGN',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Add index on email for quick lookup
create index if not exists idx_profiles_email on public.profiles(email);
