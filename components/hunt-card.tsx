"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, Users, Crown, Timer } from "lucide-react"
import type { Hunt, Session, QueueEntry, Profile } from "@/lib/types"

interface HuntCardProps {
  hunt: Hunt
  activeSession?: Session
  queue: QueueEntry[]
  userInQueue?: QueueEntry
  userId: string
  profiles?: Record<string, Profile>
  userInAnySession?: Session
  userInAnyQueue?: QueueEntry
  onUpdate: () => void
}

export function HuntCard({
  hunt,
  activeSession,
  queue,
  userInQueue,
  userId,
  profiles,
  userInAnySession,
  userInAnyQueue,
  onUpdate,
}: HuntCardProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [selectedDuration, setSelectedDuration] = useState("2")
  const [timeRemaining, setTimeRemaining] = useState<string>("")

  const isUserInSession = activeSession?.user_id === userId
  const isHuntOccupied = !!activeSession && !isUserInSession
  const canPromote = userInQueue?.position === 1 && !activeSession

  const isUserBusyElsewhere = (userInAnySession && !isUserInSession) || (userInAnyQueue && !userInQueue)
  const canStartHunt = !isUserInSession && !activeSession && !isUserBusyElsewhere
  const canJoinQueue = !userInQueue && !isHuntOccupied && !isUserBusyElsewhere

  const formatTimeRemaining = (endTime: string) => {
    const now = new Date()
    const end = new Date(endTime)
    const diff = end.getTime() - now.getTime()

    if (diff <= 0) return "Expirado"

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    return `${hours}h ${minutes}m restantes`
  }

  const formatTimeBRT = (utcTime: string) => {
    return new Date(utcTime).toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  useEffect(() => {
    if (!activeSession) {
      setTimeRemaining("")
      return
    }

    const updateCountdown = () => {
      const remaining = formatTimeRemaining(activeSession.end_time)
      setTimeRemaining(remaining)

      if (remaining === "Expirado") {
        console.log("[v0] Session expired, triggering update")
        onUpdate()
      }
    }

    updateCountdown()

    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [activeSession, onUpdate])

  const handleStartSession = async () => {
    setIsLoading(true)
    const supabase = createClient()

    try {
      const { data, error } = await supabase.rpc("try_start_session", {
        p_hunt_id: hunt.id,
        p_duration_hours: Number.parseInt(selectedDuration),
      })

      if (error) throw error

      if (!data.success) {
        alert(data.error || "Erro ao iniciar sessão")
      } else {
        console.log("[v0] Session started successfully")
      }
    } catch (error) {
      console.error("Error starting session:", error)
      alert("Erro ao iniciar sessão")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEndSession = async () => {
    setIsLoading(true)
    const supabase = createClient()

    try {
      const { data, error } = await supabase.rpc("end_my_session", {
        p_hunt_id: hunt.id,
      })

      if (error) throw error

      if (!data.success) {
        alert(data.error || "Erro ao finalizar sessão")
      } else {
        console.log("[v0] Session ended successfully")
      }
    } catch (error) {
      console.error("Error ending session:", error)
      alert("Erro ao finalizar sessão")
    } finally {
      setIsLoading(false)
    }
  }

  const handleJoinQueue = async () => {
    setIsLoading(true)
    const supabase = createClient()

    try {
      const { data, error } = await supabase.rpc("join_hunt_queue", {
        p_hunt_id: hunt.id,
      })

      if (error) throw error

      if (!data.success) {
        alert(data.error || "Erro ao entrar na fila")
      } else {
        console.log("[v0] Joined queue successfully")
      }
    } catch (error) {
      console.error("Error joining queue:", error)
      alert("Erro ao entrar na fila")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLeaveQueue = async () => {
    setIsLoading(true)
    const supabase = createClient()

    try {
      const { data, error } = await supabase.rpc("leave_hunt_queue", {
        p_hunt_id: hunt.id,
      })

      if (error) throw error

      if (!data.success) {
        alert(data.error || "Erro ao sair da fila")
      } else {
        console.log("[v0] Left queue successfully")
      }
    } catch (error) {
      console.error("Error leaving queue:", error)
      alert("Erro ao sair da fila")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePromote = async () => {
    setIsLoading(true)
    const supabase = createClient()

    try {
      const { data, error } = await supabase.rpc("promote_queue_if_free", {
        p_hunt_id: hunt.id,
      })

      if (error) throw error

      if (!data.success) {
        alert(data.error || "Não é possível assumir agora")
      } else if (data.can_promote) {
        await handleStartSession()
      }
    } catch (error) {
      console.error("Error promoting:", error)
      alert("Erro ao assumir hunt")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-border bg-card hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg text-card-foreground">{hunt.name}</CardTitle>
            <CardDescription className="text-muted-foreground">{hunt.description}</CardDescription>
          </div>
          <Badge variant={activeSession ? "destructive" : "secondary"} className="ml-2">
            {activeSession ? "Ocupado" : "Livre"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {activeSession && (
          <div className="p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="h-4 w-4 text-primary" />
              <span className="font-medium text-foreground">
                {(activeSession as any).profiles?.character_name || "Jogador"}
              </span>
              {(activeSession as any).profiles?.guild && (
                <Badge variant="outline" className="text-xs">
                  {(activeSession as any).profiles.guild}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Timer className="h-4 w-4" />
              <span>Início: {formatTimeBRT(activeSession.start_time)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className={timeRemaining === "Expirado" ? "text-destructive font-medium" : ""}>
                {timeRemaining || formatTimeRemaining(activeSession.end_time)}
              </span>
            </div>
          </div>
        )}

        {queue.length > 0 && (
          <div className="p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-secondary" />
              <span className="font-medium text-foreground">Fila ({queue.length})</span>
            </div>
            <div className="space-y-1">
              {queue.slice(0, 3).map((entry, index) => (
                <div key={entry.id} className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">#{entry.position}</span>
                  <span className="text-foreground">
                    {(profiles?.[entry.user_id] || {}).character_name || "Jogador"}
                  </span>
                  {entry.user_id === userId && <Badge variant="outline">Você</Badge>}
                </div>
              ))}
              {queue.length > 3 && <p className="text-xs text-muted-foreground">+{queue.length - 3} mais...</p>}
            </div>
          </div>
        )}

        <div className="space-y-2">
          {isUserInSession ? (
            <Button
              onClick={handleEndSession}
              disabled={isLoading}
              className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            >
              {isLoading ? "Finalizando..." : "Finalizar Sessão"}
            </Button>
          ) : !activeSession ? (
            <div className="space-y-2">
              <div className="flex gap-2">
                <Select value={selectedDuration} onValueChange={setSelectedDuration}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1h</SelectItem>
                    <SelectItem value="2">2h</SelectItem>
                    <SelectItem value="3">3h</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleStartSession}
                  disabled={isLoading || !canStartHunt}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-50"
                >
                  {isLoading ? "Iniciando..." : "Iniciar Hunt"}
                </Button>
              </div>
              {isUserBusyElsewhere && (
                <p className="text-xs text-muted-foreground text-center">
                  {userInAnySession ? "Você já está em uma sessão ativa" : "Você já está em outra fila"}
                </p>
              )}
            </div>
          ) : canPromote ? (
            <Button
              onClick={handlePromote}
              disabled={isLoading}
              className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
            >
              {isLoading ? "Assumindo..." : "Assumir Hunt"}
            </Button>
          ) : userInQueue ? (
            <Button
              onClick={handleLeaveQueue}
              disabled={isLoading}
              variant="outline"
              className="w-full border-border bg-transparent"
            >
              {isLoading ? "Saindo..." : `Sair da Fila (Posição ${userInQueue.position})`}
            </Button>
          ) : (
            <div className="space-y-2">
              <Button
                onClick={handleJoinQueue}
                disabled={isLoading || !canJoinQueue}
                variant="outline"
                className="w-full border-border bg-transparent disabled:opacity-50"
              >
                {isLoading ? "Entrando..." : "Entrar na Fila"}
              </Button>
              {isUserBusyElsewhere && (
                <p className="text-xs text-muted-foreground text-center">
                  {userInAnySession ? "Você já está em uma sessão ativa" : "Você já está em outra fila"}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground">Duração máxima: 3h</p>
        </div>
      </CardContent>
    </Card>
  )
}
