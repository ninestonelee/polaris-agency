-- F03: 에이전트 프리셋
create table public.agents (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.companies(id) on delete cascade not null,
  role text not null check (role in (
    'ceo', 'marketer', 'writer', 'editor',
    'designer', 'sales', 'support', 'analyst'
  )),
  name text not null,
  recommended_model text not null,
  is_hired boolean default false,
  hired_at timestamptz,
  created_at timestamptz default now() not null
);

create index agents_company_idx on public.agents(company_id);
create unique index agents_company_role_unique on public.agents(company_id, role);

alter table public.agents enable row level security;

create policy "agents_company_owner_all" on public.agents
  for all
  using (
    exists (
      select 1 from public.companies c
      where c.id = company_id and c.owner_id = auth.uid()
    )
  );
