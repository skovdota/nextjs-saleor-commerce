export interface User {
  id: string
  email: string
}

export interface Profile {
  id: string
  character_name: string
  secondary_character: string | null
  guild: string | null
  created_at: string
  updated_at: string
}

export interface Hunt {
  id: string
  name: string
  description: string | null
  max_duration_hours: number
  created_at: string
}

export interface Session {
  id: string
  hunt_id: string
  user_id: string
  start_time: string
  end_time: string
  duration_hours: number
  is_active: boolean
  created_at: string
  hunt?: Hunt
  profile?: Profile
}

export interface QueueEntry {
  id: string
  hunt_id: string
  user_id: string
  position: number
  created_at: string
  hunt?: Hunt
  profile?: Profile
}
