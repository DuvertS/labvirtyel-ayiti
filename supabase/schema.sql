-- =====================================================================
-- LabVirtyèl Ayiti (DUVTECH) — base de données Supabase
-- À exécuter UNE fois dans Supabase : SQL Editor → New query → coller → Run.
-- Le script peut être relancé sans danger : il remplace ce qui existe déjà.
--
-- Sécurité : toutes les règles sont appliquées par le serveur (Row Level
-- Security). La page web ne peut rien contourner, même modifiée.
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- 1. Profils des participants (un par compte)
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id                 uuid primary key references auth.users on delete cascade,
  email              text not null,
  full_name          text not null default '',
  school             text not null default '',
  profile_type       text not null default 'public'
                     check (profile_type in ('eleve','etudiant','enseignant','formateur','public')),
  role               text not null default 'apprenant'
                     check (role in ('apprenant','enseignant','admin')),
  teacher_status     text not null default 'aucun'
                     check (teacher_status in ('aucun','en_attente','approuve','refuse')),
  status             text not null default 'actif' check (status in ('actif','suspendu')),
  email_confirmed_at timestamptz,
  created_at         timestamptz not null default now(),
  last_seen          timestamptz
);
alter table public.profiles enable row level security;

-- Informations d'identité demandées à l'inscription (obligatoires dans le formulaire)
alter table public.profiles add column if not exists last_name  text not null default '';
alter table public.profiles add column if not exists first_name text not null default '';
alter table public.profiles add column if not exists sex        text not null default '';
alter table public.profiles add column if not exists birth_date date;
alter table public.profiles add column if not exists address    text not null default '';
alter table public.profiles add column if not exists phone      text not null default '';
alter table public.profiles drop constraint if exists profiles_sex_check;
alter table public.profiles add constraint profiles_sex_check check (sex in ('', 'F', 'M'));

-- Fonctions d'autorisation (security definer : elles lisent les profils sans boucle de règles)
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'admin' and status = 'actif');
$$;

create or replace function public.is_teacher() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from profiles where id = auth.uid() and role in ('enseignant','admin') and status = 'actif');
$$;

create or replace function public.is_active() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from profiles where id = auth.uid() and status = 'actif' and email_confirmed_at is not null);
$$;

-- Création automatique du profil à l'inscription
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  m  jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  t  text  := coalesce(m->>'profile_type', 'public');
  sx text  := coalesce(m->>'sex', '');
  bd date;
begin
  if t not in ('eleve','etudiant','enseignant','formateur','public') then t := 'public'; end if;
  if sx not in ('F','M') then sx := ''; end if;
  begin
    bd := (m->>'birth_date')::date;
    if bd < date '1900-01-01' or bd > current_date then bd := null; end if;
  exception when others then bd := null;   -- date illisible : ignorée, l'inscription n'échoue pas
  end;
  insert into profiles (id, email, full_name, last_name, first_name, sex, birth_date, address, phone,
                        school, profile_type, teacher_status, email_confirmed_at)
  values (new.id, new.email,
          left(coalesce(m->>'full_name', ''), 120),
          left(coalesce(m->>'last_name', ''), 60),
          left(coalesce(m->>'first_name', ''), 60),
          sx, bd,
          left(coalesce(m->>'address', ''), 200),
          left(coalesce(m->>'phone', ''), 20),
          left(coalesce(m->>'school', ''), 160),
          t,
          case when t in ('enseignant','formateur') then 'en_attente' else 'aucun' end,
          new.email_confirmed_at)
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Mise à jour du profil quand l'adresse est confirmée (clic sur le lien de l'e-mail)
create or replace function public.handle_user_updated() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  update profiles set email_confirmed_at = new.email_confirmed_at, email = new.email where id = new.id;
  return new;
end $$;

drop trigger if exists on_auth_user_updated on auth.users;
create trigger on_auth_user_updated after update of email_confirmed_at, email on auth.users
  for each row execute function public.handle_user_updated();

-- Un participant ne peut modifier que ses informations personnelles, son établissement, son profil et sa dernière activité.
-- Rôle, statut et validation enseignant : réservés aux administrateurs.
create or replace function public.protect_profile() returns trigger
language plpgsql set search_path = public as $$
begin
  if current_user in ('authenticated','anon') and not public.is_admin() then
    new.id := old.id;
    new.role := old.role;
    new.teacher_status := old.teacher_status;
    new.status := old.status;
    new.email := old.email;
    new.email_confirmed_at := old.email_confirmed_at;
    new.created_at := old.created_at;
    if new.profile_type in ('enseignant','formateur') and old.teacher_status = 'aucun' then
      new.teacher_status := 'en_attente';          -- devient une demande à valider
    end if;
  end if;
  if new.profile_type not in ('eleve','etudiant','enseignant','formateur','public') then new.profile_type := old.profile_type; end if;
  new.full_name := left(new.full_name, 120);
  new.last_name := left(new.last_name, 60);
  new.first_name := left(new.first_name, 60);
  new.address := left(new.address, 200);
  new.phone := left(new.phone, 20);
  if new.sex not in ('', 'F', 'M') then new.sex := old.sex; end if;
  if new.birth_date < date '1900-01-01' or new.birth_date > current_date then new.birth_date := old.birth_date; end if;
  new.school := left(new.school, 160);
  return new;
end $$;

drop trigger if exists protect_profile on public.profiles;
create trigger protect_profile before update on public.profiles
  for each row execute function public.protect_profile();

drop policy if exists "profil: lecture" on public.profiles;
create policy "profil: lecture" on public.profiles for select to authenticated
  using (id = auth.uid() or public.is_admin());

drop policy if exists "profil: modification" on public.profiles;
create policy "profil: modification" on public.profiles for update to authenticated
  using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

-- ---------------------------------------------------------------------
-- 2. Ressources ajoutées par les enseignants (publiées après validation)
-- ---------------------------------------------------------------------
create table if not exists public.community_resources (
  id          uuid primary key default gen_random_uuid(),
  author      uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  title_fr    text not null check (char_length(title_fr) between 3 and 140),
  title_ht    text not null default '' check (char_length(title_ht) <= 140),
  summary_fr  text not null default '' check (char_length(summary_fr) <= 400),
  summary_ht  text not null default '' check (char_length(summary_ht) <= 400),
  domain      text not null check (domain in ('physique','chimie','svt','electronique','informatique','sante')),
  audiences   text[] not null default '{}'
              check (audiences <@ array['ecole','universite','pro','public']::text[]),
  kind        text not null check (kind in ('article','document','lien')),
  body        text not null default '' check (char_length(body) <= 20000),
  file_path   text,
  file_name   text check (file_name is null or char_length(file_name) <= 200),
  url         text check (url is null or (url ~* '^https://' and char_length(url) <= 500)),
  status      text not null default 'en_attente' check (status in ('en_attente','publie','refuse')),
  review_note text not null default '' check (char_length(review_note) <= 500),
  reviewed_by uuid references public.profiles(id),
  reviewed_at timestamptz,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
alter table public.community_resources add column if not exists author_name text not null default '';
alter table public.community_resources enable row level security;

-- Règles côté serveur : auteur imposé, statut « en attente » pour toute ressource nouvelle ou modifiée,
-- fichier obligatoirement rangé dans le dossier de son auteur.
create or replace function public.guard_resource() returns trigger
language plpgsql set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    if current_user in ('authenticated','anon') then new.author := auth.uid(); end if;
    if not public.is_admin() then
      new.status := 'en_attente'; new.review_note := ''; new.reviewed_by := null; new.reviewed_at := null;
    end if;
  else
    new.author := old.author; new.created_at := old.created_at;
    if not public.is_admin() then
      new.status := 'en_attente'; new.review_note := ''; new.reviewed_by := null; new.reviewed_at := null;
    elsif new.status is distinct from old.status then
      new.reviewed_by := auth.uid(); new.reviewed_at := now();
    end if;
  end if;
  -- Nom de l'auteur affiché aux autres participants (qui ne peuvent pas lire les profils)
  if tg_op = 'INSERT' then
    new.author_name := coalesce((select nullif(full_name, '') from profiles where id = new.author), 'Enseignant');
  else
    new.author_name := old.author_name;
  end if;
  if new.file_path is not null and split_part(new.file_path, '/', 1) <> new.author::text then
    raise exception 'Le fichier doit être dans le dossier de son auteur';
  end if;
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists guard_resource on public.community_resources;
create trigger guard_resource before insert or update on public.community_resources
  for each row execute function public.guard_resource();

drop policy if exists "ressources: lecture" on public.community_resources;
create policy "ressources: lecture" on public.community_resources for select to authenticated
  using (public.is_admin() or author = auth.uid() or (status = 'publie' and public.is_active()));

drop policy if exists "ressources: ajout enseignant" on public.community_resources;
create policy "ressources: ajout enseignant" on public.community_resources for insert to authenticated
  with check (public.is_teacher() and author = auth.uid());

drop policy if exists "ressources: modification" on public.community_resources;
create policy "ressources: modification" on public.community_resources for update to authenticated
  using (public.is_admin() or (author = auth.uid() and public.is_teacher() and status <> 'publie'))
  with check (public.is_admin() or (author = auth.uid() and public.is_teacher()));

drop policy if exists "ressources: suppression" on public.community_resources;
create policy "ressources: suppression" on public.community_resources for delete to authenticated
  using (public.is_admin() or (author = auth.uid() and status <> 'publie'));

-- ---------------------------------------------------------------------
-- 3. Progression des participants (pour le tableau de bord)
-- ---------------------------------------------------------------------
create table if not exists public.progress (
  user_id     uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  resource_id text not null check (char_length(resource_id) between 1 and 60),
  done_at     timestamptz not null default now(),
  score       int check (score is null or score between 0 and 100),
  total       int check (total is null or total between 1 and 100),
  primary key (user_id, resource_id)
);
alter table public.progress enable row level security;

drop policy if exists "progression: lecture" on public.progress;
create policy "progression: lecture" on public.progress for select to authenticated
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists "progression: ajout" on public.progress;
create policy "progression: ajout" on public.progress for insert to authenticated
  with check (user_id = auth.uid() and public.is_active());

drop policy if exists "progression: modification" on public.progress;
create policy "progression: modification" on public.progress for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid() and public.is_active());

-- ---------------------------------------------------------------------
-- 4. Fichiers déposés (PDF et images, 10 Mo maximum, stockage privé)
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('ressources', 'ressources', false, 10485760,
        array['application/pdf','image/png','image/jpeg','image/webp'])
on conflict (id) do update set public = false,
  file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "fichiers: depot enseignant" on storage.objects;
create policy "fichiers: depot enseignant" on storage.objects for insert to authenticated
  with check (bucket_id = 'ressources' and public.is_teacher()
              and (storage.foldername(name))[1] = auth.uid()::text);

drop policy if exists "fichiers: lecture" on storage.objects;
create policy "fichiers: lecture" on storage.objects for select to authenticated
  using (bucket_id = 'ressources' and (
           public.is_admin()
        or (storage.foldername(name))[1] = auth.uid()::text
        or (public.is_active() and exists (
              select 1 from public.community_resources r
              where r.file_path = objects.name and r.status = 'publie'))));

drop policy if exists "fichiers: suppression" on storage.objects;
create policy "fichiers: suppression" on storage.objects for delete to authenticated
  using (bucket_id = 'ressources' and (public.is_admin() or (storage.foldername(name))[1] = auth.uid()::text));

-- Comptes créés avant ce script : on leur crée un profil
insert into public.profiles (id, email, full_name, email_confirmed_at)
select u.id, u.email, coalesce(u.raw_user_meta_data->>'full_name', ''), u.email_confirmed_at
from auth.users u
where not exists (select 1 from public.profiles p where p.id = u.id);

-- ---------------------------------------------------------------------
-- 5. Premier administrateur
-- Après avoir créé VOTRE compte sur le site et cliqué sur le lien de l'e-mail,
-- exécutez cette ligne (remplacez l'adresse) :
--
--   update public.profiles set role = 'admin', teacher_status = 'approuve' where email = 'votre@adresse.com';
-- ---------------------------------------------------------------------
