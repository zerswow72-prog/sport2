create table teams (
  id bigint generated always as identity primary key,
  name text not null,
  color text not null default '#888888'
);
create table score_log (
  id bigint generated always as identity primary key,
  team_id bigint not null references teams(id) on delete cascade,
  event_name text not null default '',
  points int not null,
  created_at timestamptz not null default now()
);

alter table teams enable row level security;
alter table score_log enable row level security;
create policy "public read teams" on teams for select using (true);
create policy "public read log"   on score_log for select using (true);
create policy "admin write teams" on teams for all to authenticated using (true) with check (true);
create policy "admin write log"   on score_log for all to authenticated using (true) with check (true);

alter publication supabase_realtime add table teams, score_log;

insert into teams (name, color) values
  ('สีแดง', '#e63946'), ('สีน้ำเงิน', '#1d4ed8'),
  ('สีเขียว', '#16a34a'), ('สีเหลือง', '#f5b700');
