import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { HuntGrid } from "@/components/hunt-grid"
import { UserNav } from "@/components/user-nav"
import { RealtimeStatus } from "@/components/realtime-status"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user has completed profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile) {
    redirect("/profile/complete")
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-card-foreground">Tibia Hunt Monitor</h1>
            <p className="text-sm text-muted-foreground">Gerencie suas hunts em tempo real</p>
          </div>
          <UserNav user={user} />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-2">Spots de Hunt Disponíveis</h2>
            <p className="text-muted-foreground">
              Clique em um spot para iniciar uma sessão ou entrar na fila de espera
            </p>
          </div>
          <RealtimeStatus />
        </div>
        <HuntGrid userId={user.id} />
      </main>
    </div>
  )
}
