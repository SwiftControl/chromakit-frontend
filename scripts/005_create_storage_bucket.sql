-- Create storage bucket for images
insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do nothing;

-- Set up storage policies
create policy "Users can upload their own images"
on storage.objects for insert
with check (
  bucket_id = 'images' 
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Users can view their own images"
on storage.objects for select
using (
  bucket_id = 'images' 
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Users can update their own images"
on storage.objects for update
using (
  bucket_id = 'images' 
  and auth.uid()::text = (storage.foldername(name))[1]
);

create policy "Users can delete their own images"
on storage.objects for delete
using (
  bucket_id = 'images' 
  and auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow public access to images (for viewing)
create policy "Public can view images"
on storage.objects for select
using (bucket_id = 'images');
