"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { HuntCard } from "@/components/hunt-card"
import type { Hunt, Session, QueueEntry, Profile } from "@/lib/types"

interface HuntGridProps {
  userId: string
}

export function HuntGrid({ userId }: HuntGridProps) {
  const [hunts, setHunts] = useState<Hunt[]>([])
  const [sessions, setSessions] = useState<Session[]>([])
  const [queue, setQueue] = useState<QueueEntry[]>([])
  const [profiles, setProfiles] = useState<Record<string, Profile>>({})
  const [isLoading, setIsLoading] = useState(true)

  const fetchData = async () => {
    const supabase = createClient()

    try {
      console.log("[v0] Fetching data...")

      // Fetch hunts
      const { data: huntsData, error: huntsError } = await supabase
        .from("hunts")
        .select("*")
        .order("name", { ascending: true })

      if (huntsError) throw huntsError

      const { data: sessionsData, error: sessionsError } = await supabase
        .from("sessions")
        .select("*")
        .eq("is_active", true)
        .gte("end_time", new Date().toISOString())

      if (sessionsError) throw sessionsError

      const { data: queueData, error: queueError } = await supabase
        .from("queue")
        .select("*")
        .order("hunt_id", { ascending: true })
        .order("position", { ascending: true })

      if (queueError) throw queueError

      const userIds = new Set([
        ...(sessionsData || []).map((s) => s.user_id),
        ...(queueData || []).map((q) => q.user_id),
      ])

      let profilesData = []
      if (userIds.size > 0) {
        const { data: profiles, error: profilesError } = await supabase
          .from("profiles")
          .select("id, character_name, guild")
          .in("id", Array.from(userIds))

        if (profilesError) throw profilesError
        profilesData = profiles || []
      }

      const profilesMap = new Map(profilesData.map((p) => [p.id, p]))

      const enrichedSessions = (sessionsData || []).map((session) => ({
        ...session,
        profiles: profilesMap.get(session.user_id) || null,
      }))

      const enrichedQueue = (queueData || []).map((queueEntry) => ({
        ...queueEntry,
        profiles: profilesMap.get(queueEntry.user_id) || null,
      }))

      console.log("[v0] Data fetched successfully:", {
        hunts: huntsData?.length,
        sessions: enrichedSessions?.length,
        queue: enrichedQueue?.length,
      })

      setHunts(huntsData || [])
      setSessions(enrichedSessions)
      setQueue(enrichedQueue)
      setProfiles(Object.fromEntries(profilesMap))
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()

    const supabase = createClient()

    // Subscribe to sessions changes
    const sessionsChannel = supabase
      .channel("sessions_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "sessions",
        },
        (payload) => {
          console.log("[v0] Sessions change detected:", payload)
          fetchData() // Refresh all data when sessions change
        },
      )
      .subscribe()

    // Subscribe to queue changes
    const queueChannel = supabase
      .channel("queue_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "queue",
        },
        (payload) => {
          console.log("[v0] Queue change detected:", payload)
          fetchData() // Refresh all data when queue changes
        },
      )
      .subscribe()

    // Subscribe to hunts changes (in case new hunts are added)
    const huntsChannel = supabase
      .channel("hunts_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "hunts",
        },
        (payload) => {
          console.log("[v0] Hunts change detected:", payload)
          fetchData() // Refresh all data when hunts change
        },
      )
      .subscribe()

    // Cleanup subscriptions on unmount
    return () => {
      supabase.removeChannel(sessionsChannel)
      supabase.removeChannel(queueChannel)
      supabase.removeChannel(huntsChannel)
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      const hasExpiredSessions = sessions.some((session) => new Date(session.end_time) <= now)

      if (hasExpiredSessions) {
        console.log("[v0] Expired sessions detected, refreshing data")
        fetchData()
      }
    }, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [sessions])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {hunts.map((hunt) => {
        const activeSession = sessions.find((s) => s.hunt_id === hunt.id)
        const huntQueue = queue.filter((q) => q.hunt_id === hunt.id)
        const userInQueue = huntQueue.find((q) => q.user_id === userId)

        const userInAnySession = sessions.find((s) => s.user_id === userId)
        const userInAnyQueue = queue.find((q) => q.user_id === userId)

        return (
          <HuntCard
            key={hunt.id}
            hunt={hunt}
            activeSession={activeSession}
            queue={huntQueue}
            userInQueue={userInQueue}
            userId={userId}
            profiles={profiles}
            userInAnySession={userInAnySession}
            userInAnyQueue={userInAnyQueue}
            onUpdate={fetchData}
          />
        )
      })}
    </div>
  )
}
