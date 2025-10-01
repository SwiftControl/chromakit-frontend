"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useState } from "react"

interface Image {
  id: string
  original_filename: string
  storage_path: string
  file_size: number
  width: number
  height: number
  created_at: string
}

interface ImageGridProps {
  images: Image[]
}

export function ImageGrid({ images }: ImageGridProps) {
  const router = useRouter()
  const supabase = createClient()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (image: Image) => {
    if (!confirm("Are you sure you want to delete this image?")) return

    setDeletingId(image.id)

    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage.from("images").remove([image.storage_path])

      if (storageError) throw storageError

      // Delete from database
      const { error: dbError } = await supabase.from("images").delete().eq("id", image.id)

      if (dbError) throw dbError

      router.refresh()
    } catch (error) {
      console.error("Delete error:", error)
      alert("Failed to delete image. Please try again.")
    } finally {
      setDeletingId(null)
    }
  }

  const getImageUrl = (storagePath: string) => {
    const { data } = supabase.storage.from("images").getPublicUrl(storagePath)
    return data.publicUrl
  }

  if (images.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-dashed border-border">
        <div className="text-center">
          <p className="text-lg font-medium text-muted-foreground">No images yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Upload your first image to get started</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {images.map((image) => (
        <Card key={image.id} className="group overflow-hidden">
          <CardContent className="p-0">
            <div className="relative aspect-square overflow-hidden bg-muted">
              <img
                src={getImageUrl(image.storage_path) || "/placeholder.svg"}
                alt={image.original_filename}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <div className="p-4">
              <p className="truncate text-sm font-medium">{image.original_filename}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {image.width} × {image.height} • {(image.file_size / 1024).toFixed(0)} KB
              </p>
              <div className="mt-4 flex gap-2">
                <Button asChild size="sm" className="flex-1">
                  <Link href={`/editor/${image.id}`}>
                    <Edit className="mr-1 h-3 w-3" />
                    Edit
                  </Link>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(image)}
                  disabled={deletingId === image.id}
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
