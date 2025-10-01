"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Trash2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface EditHistoryItem {
  id: string
  image_id: string
  operation_type: string
  parameters: Record<string, unknown>
  result_storage_path: string | null
  created_at: string
  images: {
    original_filename: string
  }
}

interface EditHistoryListProps {
  history: EditHistoryItem[]
}

export function EditHistoryList({ history }: EditHistoryListProps) {
  const router = useRouter()
  const supabase = createClient()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (item: EditHistoryItem) => {
    if (!confirm("Are you sure you want to delete this edit?")) return

    setDeletingId(item.id)

    try {
      // Delete from storage if exists
      if (item.result_storage_path) {
        await supabase.storage.from("images").remove([item.result_storage_path])
      }

      // Delete from database
      const { error } = await supabase.from("edit_history").delete().eq("id", item.id)

      if (error) throw error

      router.refresh()
    } catch (error) {
      console.error("Delete error:", error)
      alert("Failed to delete edit. Please try again.")
    } finally {
      setDeletingId(null)
    }
  }

  const handleDownload = async (item: EditHistoryItem) => {
    if (!item.result_storage_path) return

    const { data } = supabase.storage.from("images").getPublicUrl(item.result_storage_path)

    const a = document.createElement("a")
    a.href = data.publicUrl
    a.download = `edited-${item.images.original_filename}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const getImageUrl = (storagePath: string | null) => {
    if (!storagePath) return null
    const { data } = supabase.storage.from("images").getPublicUrl(storagePath)
    return data.publicUrl
  }

  if (history.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-dashed border-border">
        <div className="text-center">
          <p className="text-lg font-medium text-muted-foreground">No edit history yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Your saved edits will appear here</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {history.map((item) => (
        <Card key={item.id} className="group overflow-hidden">
          <CardContent className="p-0">
            {item.result_storage_path && (
              <div className="relative aspect-square overflow-hidden bg-muted">
                <img
                  src={getImageUrl(item.result_storage_path) || "/placeholder.svg"}
                  alt={item.images.original_filename}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
            )}
            <div className="p-4">
              <p className="truncate text-sm font-medium">{item.images.original_filename}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {new Date(item.created_at).toLocaleDateString()} at {new Date(item.created_at).toLocaleTimeString()}
              </p>
              <div className="mt-4 flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 bg-transparent"
                  onClick={() => handleDownload(item)}
                  disabled={!item.result_storage_path}
                >
                  <Download className="mr-1 h-3 w-3" />
                  Download
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(item)}
                  disabled={deletingId === item.id}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
