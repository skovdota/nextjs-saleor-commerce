"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Badge } from "@/components/ui/badge"
import { Wifi, WifiOff } from "lucide-react"

export function RealtimeStatus() {
  const [isConnected, setIsConnected] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  useEffect(() => {
    const supabase = createClient()

    // Create a test channel to monitor connection status
    const statusChannel = supabase
      .channel("connection_status")
      .on("presence", { event: "sync" }, () => {
        setIsConnected(true)
        setLastUpdate(new Date())
      })
      .subscribe((status) => {
        console.log("[v0] Realtime connection status:", status)
        setIsConnected(status === "SUBSCRIBED")
        if (status === "SUBSCRIBED") {
          setLastUpdate(new Date())
        }
      })

    return () => {
      supabase.removeChannel(statusChannel)
    }
  }, [])

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      {isConnected ? (
        <>
          <Wifi className="h-3 w-3 text-green-500" />
          <Badge variant="outline" className="text-green-600 border-green-200">
            Tempo Real Ativo
          </Badge>
        </>
      ) : (
        <>
          <WifiOff className="h-3 w-3 text-red-500" />
          <Badge variant="outline" className="text-red-600 border-red-200">
            Desconectado
          </Badge>
        </>
      )}
      {lastUpdate && <span>Última atualização: {lastUpdate.toLocaleTimeString("pt-BR")}</span>}
    </div>
  )
}
