create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  email text unique,
  role text check (role in ('user','admin')) default 'user',
  active_until timestamptz,
  created_at timestamptz default now()
);

create table if not exists decks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  course text,
  tags text[] default '{}',
  created_at timestamptz default now()
);

create table if not exists cards (
  id uuid primary key default gen_random_uuid(),
  deck_id uuid references decks(id) on delete cascade,
  front text not null,
  back text not null,
  tags text[] default '{}',
  media_refs text[] default '{}',
  created_at timestamptz default now()
);
create index on cards(deck_id);

create table if not exists card_progress (
  user_id uuid references profiles(id) on delete cascade,
  card_id uuid references cards(id) on delete cascade,
  ease numeric default 2.5,
  interval_days int default 0,
  reps int default 0,
  lapses int default 0,
  last_review_at timestamptz,
  due_at timestamptz,
  primary key (user_id, card_id)
);
create index on card_progress(user_id, due_at);

create table if not exists questions (
  id uuid primary key default gen_random_uuid(),
  stem text not null,
  choices text[] not null,
  correct_index int not null,
  explanation text,
  topic text not null,
  subtopic text,
  difficulty int check (difficulty between 1 and 5) default 3,
  tags text[] default '{}',
  created_at timestamptz default now()
);

create table if not exists exams (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  policy_json jsonb not null default '{}',
  created_at timestamptz default now()
);

create table if not exists exam_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  exam_id uuid references exams(id) on delete set null,
  started_at timestamptz default now(),
  finished_at timestamptz,
  score numeric,
  breakdown_json jsonb default '{}'
);
create index on exam_attempts(user_id);

create table if not exists exam_answers (
  attempt_id uuid references exam_attempts(id) on delete cascade,
  question_id uuid references questions(id) on delete cascade,
  chosen_index int,
  is_correct boolean,
  time_ms int,
  primary key (attempt_id, question_id)
);
