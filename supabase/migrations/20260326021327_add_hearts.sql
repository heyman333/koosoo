create table hearts (
  id    int    primary key default 1,
  count bigint not null default 0,
  check (id = 1)
);
insert into hearts (id, count) values (1, 0);

alter table hearts enable row level security;
create policy "anyone can read hearts"   on hearts for select using (true);
create policy "anyone can update hearts" on hearts for update using (true);

create or replace function increment_hearts(delta int)
returns bigint language sql as $$
  update hearts set count = count + delta where id = 1 returning count;
$$;
