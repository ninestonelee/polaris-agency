-- F02: 회사 만들기
create table public.companies (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.users(id) on delete cascade not null,
  name text not null,
  industry text not null check (industry in ('shopping', 'cafe', 'academy', 'clinic', 'manufacturing', 'other')),
  mission text,
  tone text,
  is_active boolean default true,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

create index companies_owner_idx on public.companies(owner_id);
create index companies_owner_active_idx on public.companies(owner_id, is_active);

alter table public.companies enable row level security;

create policy "companies_owner_all" on public.companies
  for all
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

create trigger companies_touch_updated_at
  before update on public.companies
  for each row execute procedure public.touch_updated_at();
