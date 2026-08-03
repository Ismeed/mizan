-- Migration 003: Auto-provisioning Trigger on User Signup
-- Automatically creates rows in public.profiles and public.user_preferences when a new user registers in auth.users

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  -- 1. Create profile
  insert into public.profiles (
    id,
    email,
    first_name,
    surname,
    onboarding_completed
  )
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'first_name', split_part(coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', new.email), ' ', 1)),
    coalesce(new.raw_user_meta_data->>'surname', null),
    false
  )
  on conflict (id) do nothing;

  -- 2. Create user preferences with defaults
  insert into public.user_preferences (
    user_id,
    language_tag,
    locale,
    madhhab_id,
    currency_code
  )
  values (
    new.id,
    'en',
    'en-NG',
    'MALIKI',
    'NGN'
  )
  on conflict (user_id) do nothing;

  return new;
end;
$$;

-- Drop trigger if it exists and recreate
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
