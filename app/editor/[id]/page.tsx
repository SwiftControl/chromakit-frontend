import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { EditorLayout } from "@/components/editor/editor-layout"

export default async function EditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect("/auth/login")
  }

  // Fetch the image
  const { data: image, error: imageError } = await supabase
    .from("images")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (imageError || !image) {
    redirect("/dashboard")
  }

  return <EditorLayout image={image} imageUrl="" userId={user.id} />
}
