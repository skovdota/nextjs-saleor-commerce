import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>
}) {
  const params = await searchParams

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-md">
        <Card className="border-border bg-card">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-destructive">Erro de Autenticação</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            {params?.error ? (
              <p className="text-sm text-muted-foreground">Erro: {params.error}</p>
            ) : (
              <p className="text-sm text-muted-foreground">Ocorreu um erro durante a autenticação.</p>
            )}
            <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/auth/login">Tentar Novamente</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
