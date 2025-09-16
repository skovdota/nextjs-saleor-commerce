"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

interface Profile {
  character_name: string
  guild: string | null
}

interface UserNavProps {
  user: any
}

export function UserNav({ user }: UserNavProps) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const router = useRouter()

  useEffect(() => {
    const getProfile = async () => {
      const supabase = createClient()
      const { data } = await supabase.from("profiles").select("character_name, guild").eq("id", user.id).single()
      setProfile(data)
    }

    if (user) {
      getProfile()
    }
  }, [user])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  const initials = profile?.character_name
    ? profile.character_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user.email?.charAt(0).toUpperCase() || "U"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-primary-foreground">{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-popover border-border" align="end" forceMount>
        <DropdownMenuLabel className="font-normal text-popover-foreground">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{profile?.character_name || "Usuário"}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            {profile?.guild && <p className="text-xs leading-none text-muted-foreground">Guild: {profile.guild}</p>}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-popover-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer"
          onClick={() => router.push("/profile/edit")}
        >
          Editar Perfil
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive hover:bg-destructive hover:text-destructive-foreground cursor-pointer"
          onClick={handleSignOut}
        >
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
