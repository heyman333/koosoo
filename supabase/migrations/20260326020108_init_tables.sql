-- 방명록 메시지
create table messages (
  id      bigint generated always as identity primary key,
  name    text   not null,
  message text   not null,
  at      bigint not null
);

alter table messages enable row level security;
create policy "anyone can read messages"  on messages for select using (true);
create policy "anyone can insert messages" on messages for insert with check (true);

-- 참석 여부 (RSVP)
create table rsvp (
  id         bigint      generated always as identity primary key,
  name       text        not null,
  attend     boolean     not null,
  side       text        check (side in ('groom', 'bride')),
  headcount  int,
  meal       boolean,
  created_at timestamptz not null default now()
);

alter table rsvp enable row level security;
create policy "anyone can insert rsvp" on rsvp for insert with check (true);
