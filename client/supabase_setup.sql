-- Create Habits Table
create table public.habits (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  color text default 'bg-primary',
  frequency text[] default '{Mon,Tue,Wed,Thu,Fri,Sat,Sun}',
  created_at timestamptz default now()
);

-- Enable RLS for Habits
alter table public.habits enable row level security;

create policy "Users can view own habits" on public.habits
  for select using (auth.uid() = user_id);

create policy "Users can insert own habits" on public.habits
  for insert with check (auth.uid() = user_id);

create policy "Users can delete own habits" on public.habits
  for delete using (auth.uid() = user_id);


-- Create Habit Logs Table
create table public.habit_logs (
  id uuid default gen_random_uuid() primary key,
  habit_id uuid references public.habits on delete cascade not null,
  user_id uuid references auth.users not null,
  date date not null,
  completed boolean default true,
  created_at timestamptz default now()
);

-- Enable RLS for Habit Logs
alter table public.habit_logs enable row level security;

create policy "Users can view own logs" on public.habit_logs
  for select using (auth.uid() = user_id);

create policy "Users can insert own logs" on public.habit_logs
  for insert with check (auth.uid() = user_id);

create policy "Users can delete own logs" on public.habit_logs
  for delete using (auth.uid() = user_id);
