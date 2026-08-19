-- Run in Supabase SQL Editor. The buckets must remain private.

update storage.buckets
set public = false,
    file_size_limit = 52428800,
    allowed_mime_types = array['video/mp4', 'video/webm', 'video/quicktime']
where id = 'videos';

update storage.buckets
set public = false,
    file_size_limit = 10485760,
    allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp']
where id = 'images';

alter table public.videos enable row level security;
alter table public.video_images enable row level security;

drop policy if exists "authenticated users can view videos" on public.videos;
create policy "authenticated users can view videos"
  on public.videos for select to authenticated using (true);

drop policy if exists "users can insert their own videos" on public.videos;
create policy "users can insert their own videos"
  on public.videos for insert to authenticated with check ((select auth.uid()) = user_id);

drop policy if exists "users can update their own videos" on public.videos;
create policy "users can update their own videos"
  on public.videos for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

drop policy if exists "users can delete their own videos" on public.videos;
create policy "users can delete their own videos"
  on public.videos for delete to authenticated using ((select auth.uid()) = user_id);

drop policy if exists "authenticated users can view video images" on public.video_images;
create policy "authenticated users can view video images"
  on public.video_images for select to authenticated using (true);

drop policy if exists "users can insert images for own videos" on public.video_images;
create policy "users can insert images for own videos"
  on public.video_images for insert to authenticated
  with check (exists (
    select 1 from public.videos
    where videos.id = video_images.video_id and videos.user_id = (select auth.uid())
  ));

drop policy if exists "users can update images for own videos" on public.video_images;
create policy "users can update images for own videos"
  on public.video_images for update to authenticated
  using (exists (
    select 1 from public.videos
    where videos.id = video_images.video_id and videos.user_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.videos
    where videos.id = video_images.video_id and videos.user_id = (select auth.uid())
  ));

drop policy if exists "users can delete images for own videos" on public.video_images;
create policy "users can delete images for own videos"
  on public.video_images for delete to authenticated using (exists (
    select 1 from public.videos
    where videos.id = video_images.video_id and videos.user_id = (select auth.uid())
  ));

drop policy if exists "users can upload own videos" on storage.objects;
create policy "users can upload own videos"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'videos' and (storage.foldername(name))[1] = (select auth.uid()::text));

drop policy if exists "users can read own videos" on storage.objects;
create policy "users can read own videos"
  on storage.objects for select to authenticated
  using (bucket_id = 'videos' and (storage.foldername(name))[1] = (select auth.uid()::text));

drop policy if exists "users can delete own videos" on storage.objects;
create policy "users can delete own videos"
  on storage.objects for delete to authenticated
  using (bucket_id = 'videos' and (storage.foldername(name))[1] = (select auth.uid()::text));

drop policy if exists "users can upload own images" on storage.objects;
create policy "users can upload own images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'images' and (storage.foldername(name))[1] = (select auth.uid()::text));

drop policy if exists "users can read own images" on storage.objects;
create policy "users can read own images"
  on storage.objects for select to authenticated
  using (bucket_id = 'images' and (storage.foldername(name))[1] = (select auth.uid()::text));

drop policy if exists "users can delete own images" on storage.objects;
create policy "users can delete own images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'images' and (storage.foldername(name))[1] = (select auth.uid()::text));