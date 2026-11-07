-- Coming-soon waiting list. The public API can only call join_waitlist(); the table itself is not exposed.
create table public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  lang text not null default 'pt-PT' check (lang in ('pt-PT', 'en')),
  consent_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint waitlist_email_format check (
    char_length(email) between 6 and 254
    and email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'
  )
);
create unique index waitlist_email_key on public.waitlist (lower(email));
create index waitlist_created_at_idx on public.waitlist (created_at);

alter table public.waitlist enable row level security;
revoke all on table public.waitlist from anon, authenticated;
comment on table public.waitlist is 'Coming-soon waiting list. Written only through public.join_waitlist(); no API read access.';

create or replace function public.join_waitlist(p_email text, p_lang text default 'pt-PT', p_consent boolean default false)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_email text := lower(btrim(p_email));
begin
  if p_consent is not true then
    raise exception 'consent_required' using errcode = '22023';
  end if;
  if v_email is null
     or char_length(v_email) not between 6 and 254
     or v_email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' then
    raise exception 'invalid_email' using errcode = '22023';
  end if;
  -- coarse global throttle against scripted floods
  if (select count(*) from public.waitlist where created_at > now() - interval '1 minute') >= 30 then
    raise exception 'rate_limited' using errcode = '54000';
  end if;
  insert into public.waitlist (email, lang)
  values (v_email, case when p_lang = 'en' then 'en' else 'pt-PT' end)
  on conflict ((lower(email))) do nothing;  -- duplicates succeed silently (no enumeration)
end;
$$;

revoke all on function public.join_waitlist(text, text, boolean) from public;
grant execute on function public.join_waitlist(text, text, boolean) to anon, authenticated;
