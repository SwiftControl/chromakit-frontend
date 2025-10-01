-- Create profiles table (extends Supabase auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Create images table
create table if not exists public.images (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  original_filename text not null,
  storage_path text not null,
  file_size bigint not null,
  mime_type text not null,
  width integer not null,
  height integer not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Create edit_history table
create table if not exists public.edit_history (
  id uuid primary key default gen_random_uuid(),
  image_id uuid not null references public.images(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  operation_type text not null,
  parameters jsonb not null default '{}'::jsonb,
  result_storage_path text,
  created_at timestamptz default now() not null
);

-- Create indexes for better query performance
create index if not exists images_user_id_idx on public.images(user_id);
create index if not exists images_created_at_idx on public.images(created_at desc);
create index if not exists edit_history_image_id_idx on public.edit_history(image_id);
create index if not exists edit_history_user_id_idx on public.edit_history(user_id);
create index if not exists edit_history_created_at_idx on public.edit_history(created_at desc);
