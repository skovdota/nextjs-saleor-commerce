import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export default async function HomePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    // Check if user has completed profile
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    if (!profile) {
      redirect("/profile/complete")
    } else {
      redirect("/dashboard")
    }
  } else {
    redirect("/auth/login")
  }
}
