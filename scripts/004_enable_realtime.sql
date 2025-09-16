-- Enable Realtime for the tables we want to subscribe to
ALTER PUBLICATION supabase_realtime ADD TABLE public.sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.queue;
ALTER PUBLICATION supabase_realtime ADD TABLE public.hunts;

-- Grant necessary permissions for Realtime
GRANT SELECT ON public.sessions TO anon, authenticated;
GRANT SELECT ON public.queue TO anon, authenticated;
GRANT SELECT ON public.hunts TO anon, authenticated;
