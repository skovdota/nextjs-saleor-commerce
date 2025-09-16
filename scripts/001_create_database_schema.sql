-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table for user data
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  character_name TEXT NOT NULL,
  secondary_character TEXT,
  guild TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create hunts table for hunt spots
CREATE TABLE IF NOT EXISTS public.hunts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  max_duration_hours INTEGER NOT NULL DEFAULT 2,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sessions table for active hunt sessions
CREATE TABLE IF NOT EXISTS public.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hunt_id UUID NOT NULL REFERENCES public.hunts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_hours INTEGER NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(hunt_id) -- Only one active session per hunt
);

-- Create queue table for waiting users
CREATE TABLE IF NOT EXISTS public.queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hunt_id UUID NOT NULL REFERENCES public.hunts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(hunt_id, user_id), -- User can only be in queue once per hunt
  UNIQUE(hunt_id, position) -- Each position is unique per hunt
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hunts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.queue ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for hunts (public read, admin write)
CREATE POLICY "Anyone can view hunts" ON public.hunts
  FOR SELECT USING (true);

-- RLS Policies for sessions (users can view all, but only manage their own)
CREATE POLICY "Anyone can view sessions" ON public.sessions
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own sessions" ON public.sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions" ON public.sessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sessions" ON public.sessions
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for queue (users can view all, but only manage their own)
CREATE POLICY "Anyone can view queue" ON public.queue
  FOR SELECT USING (true);

CREATE POLICY "Users can insert themselves in queue" ON public.queue
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete themselves from queue" ON public.queue
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_sessions_hunt_id ON public.sessions(hunt_id);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON public.sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_active ON public.sessions(is_active);
CREATE INDEX IF NOT EXISTS idx_queue_hunt_id ON public.queue(hunt_id);
CREATE INDEX IF NOT EXISTS idx_queue_position ON public.queue(hunt_id, position);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON public.profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
