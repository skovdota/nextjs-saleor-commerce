"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

export default function CompleteProfilePage() {
  const [characterName, setCharacterName] = useState("")
  const [secondaryCharacter, setSecondaryCharacter] = useState("")
  const [guild, setGuild] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
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

      // Check if profile already exists
      const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      if (profile) {
        router.push("/dashboard")
      }
    }

    getUser()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (!characterName.trim()) {
      setError("Nome do personagem é obrigatório")
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.from("profiles").insert({
        id: user.id,
        character_name: characterName.trim(),
        secondary_character: secondaryCharacter.trim() || null,
        guild: guild.trim() || null,
      })

      if (error) throw error

      router.push("/dashboard")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Erro ao salvar perfil")
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
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
            <CardTitle className="text-2xl font-bold text-card-foreground">Complete seu Perfil</CardTitle>
            <CardDescription className="text-muted-foreground">
              Adicione informações sobre seus personagens do Tibia
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
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={isLoading}
              >
                {isLoading ? "Salvando..." : "Completar Perfil"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
