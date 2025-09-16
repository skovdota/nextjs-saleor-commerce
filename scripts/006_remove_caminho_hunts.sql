-- Remove Caminho Norte and Caminho Sul hunts as requested
DELETE FROM public.hunts WHERE name IN (
  'Caminho Norte',
  'Caminho Sul'
);
