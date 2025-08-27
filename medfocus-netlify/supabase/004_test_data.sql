insert into decks (title, course, tags) values
('Farmacologia Cardiovascular', 'Terapêutica 2', '{ICC,HTA}');

-- pegue o id do deck criado (substitua abaixo)
-- select id, title from decks;

-- Exemplo: substitua 11111111-1111-1111-1111-111111111111 pelo id real
insert into cards (deck_id, front, back, tags) values
('11111111-1111-1111-1111-111111111111','IECA: mecanismo de ação?','Inibe ECA → ↓Ang II; ↑bradicinina (vasodilatação).','{HTA}'),
('11111111-1111-1111-1111-111111111111','Tiazídico: efeito adverso clássico?','Hiponatremia, hipocalemia, gota (↑ ácido úrico).','{HTA}');

insert into questions (stem, choices, correct_index, explanation, topic, subtopic, difficulty) values
('Primeira linha para HTA sem comorbidades?', '{IECA,Betabloqueador,Diurético tiazídico,IECA+BB}', 2, 'Tiazídico tem melhor evidência populacional', 'Cardiologia','HTA',2),
('EI com febre e sopro: melhor exame inicial?', '{Hemoculturas,Eco TT,Eco TE,ECG}', 0, 'Hemoculturas antes de antibiótico', 'Infecciosas','Endocardite',2);
