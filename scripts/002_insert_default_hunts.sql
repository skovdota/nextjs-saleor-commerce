-- Insert default hunt spots
INSERT INTO public.hunts (name, description, max_duration_hours) VALUES
  ('Ferumbras Seal - Caminho Norte', 'Área norte do Ferumbras Seal, ideal para knights e paladins', 2),
  ('Ferumbras Seal - Caminho Sul', 'Área sul do Ferumbras Seal, boa para mages', 2),
  ('Roshamuul Prison', 'Prison de Roshamuul, hunt para high levels', 3),
  ('Asura Palace', 'Palace das Asuras, hunt clássica para profit', 2),
  ('Banuta', 'Banuta -4 e -6, hunt de hydras e serpent spawns', 2),
  ('Glooth Bandits', 'Oramond Glooth Bandits, hunt popular', 2),
  ('Catacombs', 'Edron Catacombs, hunt de bone beasts', 1),
  ('Hero Cave', 'Edron Hero Cave, hunt para mid levels', 2)
ON CONFLICT (name) DO NOTHING;
