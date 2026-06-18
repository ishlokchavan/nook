-- ============================================================================
-- Nook — Milestone 2: seed data (fake suppliers, posts, a demo client)
-- Run LAST, after 0001/0002/0003. Safe to re-run (idempotent via fixed UUIDs
-- + ON CONFLICT). Creates auth.users rows so the FKs resolve while real
-- sign-in is still deferred.
--
-- NOTE: image_path holds a full image URL for the demo feed (real posts will
-- store a Supabase Storage path instead).
-- ============================================================================

-- 1. auth.users (minimal; emails are placeholders, never used to log in) ----
insert into auth.users (instance_id, id, aud, role, email, encrypted_password,
                        email_confirmed_at, created_at, updated_at,
                        raw_app_meta_data, raw_user_meta_data)
values
  ('00000000-0000-0000-0000-000000000000','00000000-0000-0000-0000-0000000000a1','authenticated','authenticated','carpenter568@seed.nook','', now(), now(), now(), '{"provider":"seed","providers":["seed"]}','{}'),
  ('00000000-0000-0000-0000-000000000000','00000000-0000-0000-0000-0000000000a2','authenticated','authenticated','designer204@seed.nook','', now(), now(), now(), '{"provider":"seed","providers":["seed"]}','{}'),
  ('00000000-0000-0000-0000-000000000000','00000000-0000-0000-0000-0000000000a3','authenticated','authenticated','contractor091@seed.nook','', now(), now(), now(), '{"provider":"seed","providers":["seed"]}','{}'),
  ('00000000-0000-0000-0000-000000000000','00000000-0000-0000-0000-0000000000a4','authenticated','authenticated','carpenter315@seed.nook','', now(), now(), now(), '{"provider":"seed","providers":["seed"]}','{}'),
  ('00000000-0000-0000-0000-000000000000','00000000-0000-0000-0000-0000000000a5','authenticated','authenticated','designer742@seed.nook','', now(), now(), now(), '{"provider":"seed","providers":["seed"]}','{}'),
  ('00000000-0000-0000-0000-000000000000','00000000-0000-0000-0000-0000000000a6','authenticated','authenticated','contractor488@seed.nook','', now(), now(), now(), '{"provider":"seed","providers":["seed"]}','{}'),
  ('00000000-0000-0000-0000-000000000000','00000000-0000-0000-0000-0000000000c1','authenticated','authenticated','client@seed.nook','', now(), now(), now(), '{"provider":"seed","providers":["seed"]}','{}')
on conflict (id) do nothing;

-- 2. profiles --------------------------------------------------------------
insert into public.profiles (id, role, display_handle) values
  ('00000000-0000-0000-0000-0000000000a1','supplier','carpenter_568'),
  ('00000000-0000-0000-0000-0000000000a2','supplier','designer_204'),
  ('00000000-0000-0000-0000-0000000000a3','supplier','contractor_091'),
  ('00000000-0000-0000-0000-0000000000a4','supplier','carpenter_315'),
  ('00000000-0000-0000-0000-0000000000a5','supplier','designer_742'),
  ('00000000-0000-0000-0000-0000000000a6','supplier','contractor_488'),
  ('00000000-0000-0000-0000-0000000000c1','client','client_demo')
on conflict (id) do nothing;

-- 3. suppliers (contact_phone is private — only unlock_contact reveals it) --
insert into public.suppliers (profile_id, type, areas, bio, verified, verification_score, rating_avg, rating_count, contact_phone) values
  ('00000000-0000-0000-0000-0000000000a1','carpenter', '{"Dubai Marina","JBR"}','Bespoke walnut joinery and built-in wardrobes.', true, 82, 4.80, 41, '+971500000001'),
  ('00000000-0000-0000-0000-0000000000a2','designer',  '{"Downtown","Business Bay"}','Warm-minimal interiors, turnkey styling.', true, 76, 4.60, 28, '+971500000002'),
  ('00000000-0000-0000-0000-0000000000a3','contractor','{"Jumeirah","Umm Suqeim"}','Full villa renovations, on-time handover.', false, 54, 4.30, 17, '+971500000003'),
  ('00000000-0000-0000-0000-0000000000a4','carpenter', '{"Business Bay"}','Kitchens in oak, brass detailing.', true, 69, 4.70, 23, '+971500000004'),
  ('00000000-0000-0000-0000-0000000000a5','designer',  '{"Palm Jumeirah"}','Coastal-luxe living spaces.', true, 88, 4.90, 52, '+971500000005'),
  ('00000000-0000-0000-0000-0000000000a6','contractor','{"Arabian Ranches","Dubai Hills"}','Fit-outs and extensions, licensed crew.', false, 47, 4.10, 9, '+971500000006')
on conflict (profile_id) do nothing;

-- 4. posts (approved so they show in the public feed) ----------------------
insert into public.posts (supplier_id, image_path, room_type, finish, tags, area, sqft, moderation_status) values
  ('00000000-0000-0000-0000-0000000000a1','https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80','Kitchen','Walnut & brass','{"kitchen","joinery"}','Dubai Marina', 240,'approved'),
  ('00000000-0000-0000-0000-0000000000a1','https://images.unsplash.com/photo-1503602642458-232111445657?w=800&q=80','Wardrobe','Matte oak','{"storage","bedroom"}','JBR', 90,'approved'),
  ('00000000-0000-0000-0000-0000000000a2','https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80','Living room','Warm minimal','{"living","styling"}','Downtown', 320,'approved'),
  ('00000000-0000-0000-0000-0000000000a3','https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80','Full villa','Turnkey reno','{"villa","renovation"}','Jumeirah', 4200,'approved'),
  ('00000000-0000-0000-0000-0000000000a4','https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&q=80','Kitchen','Oak & brass','{"kitchen"}','Business Bay', 180,'approved'),
  ('00000000-0000-0000-0000-0000000000a5','https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800&q=80','Living room','Coastal luxe','{"living","luxury"}','Palm Jumeirah', 510,'approved'),
  ('00000000-0000-0000-0000-0000000000a5','https://images.unsplash.com/photo-1617103996702-96ff29b1c467?w=800&q=80','Bedroom','Soft neutrals','{"bedroom"}','Palm Jumeirah', 260,'approved'),
  ('00000000-0000-0000-0000-0000000000a6','https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&q=80','Bathroom','Stone & matte','{"bathroom","fitout"}','Dubai Hills', 70,'approved'),
  ('00000000-0000-0000-0000-0000000000a2','https://images.unsplash.com/photo-1615875605825-5eb9bb5d52ac?w=800&q=80','Dining','Sculptural','{"dining"}','Business Bay', 150,'approved')
on conflict do nothing;

-- 5. demo client wallet: 5 credits so unlock_contact can be tried later -----
insert into public.credits_ledger (profile_id, delta, reason)
select '00000000-0000-0000-0000-0000000000c1', 5, 'topup'
where not exists (
  select 1 from public.credits_ledger
  where profile_id = '00000000-0000-0000-0000-0000000000c1' and reason = 'topup'
);
