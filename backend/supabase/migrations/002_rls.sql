-- Migration 002: Row Level Security (RLS) Policies

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- Enable RLS on user_preferences
alter table public.user_preferences enable row level security;

-- ── Profiles RLS Policies ──────────────────────────────────────────────────

-- Policy 1: Users can view their own profile
create policy "Users can view own profile"
  on public.profiles
  for select
  using (auth.uid() = id);

-- Policy 2: Users can update their own profile
create policy "Users can update own profile"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Policy 3: Users can insert their own profile
create policy "Users can insert own profile"
  on public.profiles
  for insert
  with check (auth.uid() = id);

-- ── User Preferences RLS Policies ──────────────────────────────────────────

-- Policy 1: Users can view their own preferences
create policy "Users can view own preferences"
  on public.user_preferences
  for select
  using (auth.uid() = user_id);

-- Policy 2: Users can update their own preferences
create policy "Users can update own preferences"
  on public.user_preferences
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Policy 3: Users can insert their own preferences
create policy "Users can insert own preferences"
  on public.user_preferences
  for insert
  with check (auth.uid() = user_id);
