-- F04 + F05: 작업 + 사용량
create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid references public.agents(id) on delete cascade not null,
  user_id uuid references public.users(id) on delete cascade not null,
  prompt text not null,
  response text,
  status text default 'pending' check (status in ('pending', 'streaming', 'completed', 'failed')),
  model text not null,
  error_message text,
  created_at timestamptz default now() not null,
  completed_at timestamptz
);

create index tasks_agent_idx on public.tasks(agent_id);
create index tasks_user_idx on public.tasks(user_id, created_at desc);

alter table public.tasks enable row level security;
create policy "tasks_user_all" on public.tasks
  for all using (auth.uid() = user_id);

create table public.usage_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade not null,
  task_id uuid references public.tasks(id) on delete cascade not null,
  model text not null,
  input_tokens int not null default 0,
  output_tokens int not null default 0,
  cost_usd numeric(10,6) not null default 0,
  cost_krw numeric(12,2) not null default 0,
  created_at timestamptz default now() not null
);

create index usage_logs_user_date_idx on public.usage_logs(user_id, created_at desc);

alter table public.usage_logs enable row level security;
create policy "usage_logs_user_read" on public.usage_logs
  for select using (auth.uid() = user_id);
create policy "usage_logs_user_insert" on public.usage_logs
  for insert with check (auth.uid() = user_id);
