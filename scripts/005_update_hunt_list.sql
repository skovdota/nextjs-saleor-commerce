-- Remove old hunts that are no longer needed
DELETE FROM public.hunts WHERE name IN (
  'Asura Palace',
  'Banuta', 
  'Catacombs',
  'Glooth Bandits',
  'Hero Cave',
  'Roshamuul Prison'
);

-- Adding new Ferumbras Seal hunts to replace the old ones
INSERT INTO public.hunts (name, description, max_duration_hours) VALUES
  ('Caminho Norte', 'Caminho Seal Norte - Área norte do complexo', 3),
  ('Caminho Sul', 'Caminho Seal Sul - Área sul do complexo', 3),
  ('Plague Seal', 'Plague Seal - Área infectada com criaturas venenosas', 3),
  ('Undead Seal', 'Undead Seal - Área com mortos-vivos', 3),
  ('Infernatil Seal', 'Infernatil Seal - Área infernal com demônios', 3),
  ('Pumin Seal', 'Pumin Seal 1-2 - Área com criaturas terrestres', 3),
  ('DT Seal', 'DT Seal - Área do Desert Dungeon', 3),
  ('Jugger Seal', 'Jugger Seal - Área com juggernaut', 3),
  ('Bazir Seal', 'Bazir Seal - Área final do complexo', 3)
ON CONFLICT (name) DO NOTHING;
