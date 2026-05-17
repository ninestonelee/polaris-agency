-- F01: 인증 + 사용자 프로필
-- public.users (auth.users 1:1 매핑) + 자동 생성 트리거

create table public.users (
  id uuid primary key references auth.users on delete cascade,
  email text unique not null,
  name text,
  avatar_url text,
  onboarded_at timestamptz,
  openai_key text,
  anthropic_key text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- RLS
alter table public.users enable row level security;

create policy "users_self_read" on public.users
  for select using (auth.uid() = id);

create policy "users_self_update" on public.users
  for update using (auth.uid() = id);

-- auth.users 생성 시 public.users 자동 생성
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.users (id, email, name, avatar_url)
  values (
    new.id,
    coalesce(new.email, new.raw_user_meta_data->>'email'),
    coalesce(
      new.raw_user_meta_data->>'name',
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'nickname'
    ),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- updated_at 자동 갱신
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger users_touch_updated_at
  before update on public.users
  for each row execute procedure public.touch_updated_at();
