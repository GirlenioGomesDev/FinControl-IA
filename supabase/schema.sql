create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  created_at timestamptz default now()
);

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  description text not null,
  amount numeric(14,2) not null check (amount > 0),
  category text not null,
  paid_at date not null,
  payment_method text not null,
  notes text,
  created_at timestamptz default now()
);

create table if not exists public.incomes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  description text not null,
  amount numeric(14,2) not null check (amount > 0),
  source text not null,
  received_at date not null,
  notes text,
  created_at timestamptz default now()
);

create table if not exists public.savings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  amount numeric(14,2) not null check (amount > 0),
  goal text not null,
  saved_at date not null,
  notes text,
  created_at timestamptz default now()
);

create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  target_amount numeric(14,2) not null check (target_amount > 0),
  current_amount numeric(14,2) not null default 0 check (current_amount >= 0),
  due_date date,
  status text not null default 'ativa',
  created_at timestamptz default now()
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  period_start date not null,
  period_end date not null,
  type text not null check (type in ('monthly', 'quarterly')),
  summary jsonb not null default '{}',
  ai_analysis text,
  csv_url text,
  xlsx_url text,
  pdf_url text,
  created_at timestamptz default now()
);

create table if not exists public.backups (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  period_start date not null,
  period_end date not null,
  backed_up_at timestamptz,
  status text not null default 'pending',
  pdf_url text,
  csv_url text,
  json_url text,
  drive_folder_url text,
  created_at timestamptz default now()
);

create table if not exists public.security_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  event text not null,
  metadata jsonb not null default '{}',
  ip_address text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;
alter table public.expenses enable row level security;
alter table public.incomes enable row level security;
alter table public.savings enable row level security;
alter table public.goals enable row level security;
alter table public.reports enable row level security;
alter table public.backups enable row level security;
alter table public.security_logs enable row level security;

create policy "profiles are private" on public.profiles for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "expenses owner access" on public.expenses for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "incomes owner access" on public.incomes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "savings owner access" on public.savings for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "goals owner access" on public.goals for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "reports owner access" on public.reports for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "backups owner access" on public.backups for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "security logs owner read" on public.security_logs for select using (auth.uid() = user_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create index if not exists expenses_user_paid_at_idx on public.expenses(user_id, paid_at);
create index if not exists incomes_user_received_at_idx on public.incomes(user_id, received_at);
create index if not exists savings_user_saved_at_idx on public.savings(user_id, saved_at);
create index if not exists backups_user_period_idx on public.backups(user_id, period_start, period_end);
