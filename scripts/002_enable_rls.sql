-- Enable Row Level Security on all tables
alter table public.profiles enable row level security;
alter table public.images enable row level security;
alter table public.edit_history enable row level security;

-- Profiles policies
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Images policies
create policy "Users can view their own images"
  on public.images for select
  using (auth.uid() = user_id);

create policy "Users can insert their own images"
  on public.images for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own images"
  on public.images for update
  using (auth.uid() = user_id);

create policy "Users can delete their own images"
  on public.images for delete
  using (auth.uid() = user_id);

-- Edit history policies
create policy "Users can view their own edit history"
  on public.edit_history for select
  using (auth.uid() = user_id);

create policy "Users can insert their own edit history"
  on public.edit_history for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own edit history"
  on public.edit_history for delete
  using (auth.uid() = user_id);
