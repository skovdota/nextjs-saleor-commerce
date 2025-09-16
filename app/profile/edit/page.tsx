"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

interface Profile {
  id: string
  character_name: string
  secondary_character: string | null
  guild: string | null
}

export default function EditProfilePage() {
  const [characterName, setCharacterName] = useState("")
  const [secondaryCharacter, setSecondaryCharacter] = useState("")
  const [guild, setGuild] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      setUser(user)

      // Get existing profile
      const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      if (error || !profile) {
        router.push("/profile/complete")
        return
      }

      setProfile(profile)
      setCharacterName(profile.character_name)
      setSecondaryCharacter(profile.secondary_character || "")
      setGuild(profile.guild || "")
    }

    getUser()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !profile) return

    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (!characterName.trim()) {
      setError("Nome do personagem é obrigatório")
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          character_name: characterName.trim(),
          secondary_character: secondaryCharacter.trim() || null,
          guild: guild.trim() || null,
        })
        .eq("id", user.id)

      if (error) throw error

      router.push("/dashboard")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Erro ao atualizar perfil")
    } finally {
      setIsLoading(false)
    }
  }

  if (!user || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-md">
        <Card className="border-border bg-card">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-card-foreground">Editar Perfil</CardTitle>
            <CardDescription className="text-muted-foreground">
              Atualize as informações dos seus personagens
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="characterName" className="text-card-foreground">
                  Nome do Personagem Principal *
                </Label>
                <Input
                  id="characterName"
                  type="text"
                  placeholder="Ex: Knight Slayer"
                  required
                  value={characterName}
                  onChange={(e) => setCharacterName(e.target.value)}
                  className="bg-input border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondaryCharacter" className="text-card-foreground">
                  Personagem Secundário (opcional)
                </Label>
                <Input
                  id="secondaryCharacter"
                  type="text"
                  placeholder="Ex: Magic Mage"
                  value={secondaryCharacter}
                  onChange={(e) => setSecondaryCharacter(e.target.value)}
                  className="bg-input border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="guild" className="text-card-foreground">
                  Guild (opcional)
                </Label>
                <Input
                  id="guild"
                  type="text"
                  placeholder="Ex: Knights of Honor"
                  value={guild}
                  onChange={(e) => setGuild(e.target.value)}
                  className="bg-input border-border"
                />
              </div>
              {error && <p className="text-sm text-destructive bg-destructive/10 p-2 rounded">{error}</p>}
              <div className="flex gap-2">
                <Button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={isLoading}
                >
                  {isLoading ? "Salvando..." : "Salvar Alterações"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 border-border bg-transparent"
                  onClick={() => router.push("/dashboard")}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
