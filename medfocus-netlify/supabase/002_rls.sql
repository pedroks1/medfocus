alter table profiles enable row level security;
alter table card_progress enable row level security;
alter table exam_attempts enable row level security;
alter table exam_answers enable row level security;

-- profiles: usuário vê e atualiza o próprio perfil; admin vê tudo
create policy profiles_select_self on profiles for select using (id = auth.uid());
create policy profiles_update_self on profiles for update using (id = auth.uid());
create policy profiles_admin_all on profiles for all using (exists (
  select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'
));

-- card_progress
create policy cp_user_all on card_progress for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- exam_attempts
create policy attempts_user_all on exam_attempts for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- exam_answers
create policy answers_user_sel on exam_answers for select using (exists (
  select 1 from exam_attempts a where a.id = attempt_id and a.user_id = auth.uid()
));
create policy answers_user_insupd on exam_answers for insert with check (exists (
  select 1 from exam_attempts a where a.id = attempt_id and a.user_id = auth.uid()
));
create policy answers_user_upd on exam_answers for update using (exists (
  select 1 from exam_attempts a where a.id = attempt_id and a.user_id = auth.uid()
));

-- opcional: função para estender acesso
create or replace function extend_active_until(p_user_id uuid, p_days int)
returns void language plpgsql security definer as $$
begin
  update profiles
  set active_until = coalesce(active_until, now()) + make_interval(days => p_days)
  where id = p_user_id;
end; $$;
