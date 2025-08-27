-- Troque pelos UUIDs reais dos usuários criados em Authentication → Users
insert into profiles (id, name, email, role)
values
    ('20e4bf56-5429-4a02-b3aa-2895661ec626', 'Dr. Pedro',   'pedro.h.a.a@hotmail.com',   'admin')
ON CONFLICT (id) DO UPDATE SET role='admin', name=excluded.name, email=excluded.email;
