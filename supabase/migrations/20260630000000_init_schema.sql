-- ============================================================================
-- Initial schema: projects + user_credits
-- ============================================================================

-- ── projects ─────────────────────────────────────────────────────────────────

create table if not exists public.projects (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        not null references auth.users(id) on delete cascade,
  name        text        not null,
  description text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.projects enable row level security;

create policy "select_own_projects" on public.projects
  for select using (auth.uid() = user_id);

create policy "insert_own_projects" on public.projects
  for insert with check (auth.uid() = user_id);

create policy "update_own_projects" on public.projects
  for update using (auth.uid() = user_id);

create policy "delete_own_projects" on public.projects
  for delete using (auth.uid() = user_id);

-- ── user_credits ──────────────────────────────────────────────────────────────

create table if not exists public.user_credits (
  user_id    uuid        primary key references auth.users(id) on delete cascade,
  balance    integer     not null default 400 check (balance >= 0),
  updated_at timestamptz not null default now()
);

alter table public.user_credits enable row level security;

-- Users can read their own balance only. Writes are admin-only (service-role client).
create policy "select_own_credits" on public.user_credits
  for select using (auth.uid() = user_id);

-- ── trigger: grant 400 free credits on signup ─────────────────────────────────

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_credits (user_id, balance)
  values (new.id, 400)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

-- Drop the trigger first so this migration is re-runnable
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
