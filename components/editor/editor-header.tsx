"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Undo2, Redo2, RotateCcw, Download, Save } from "lucide-react"
import Link from "next/link"
import type { ImageData, EditorState } from "@/lib/types/editor"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface EditorHeaderProps {
  image: ImageData
  currentImageId: string
  editorState: EditorState
  canUndo: boolean
  canRedo: boolean
  onUndo: () => void
  onRedo: () => void
  onReset: () => void
  userId: string
  isProcessing: boolean
}

export function EditorHeader({
  image,
  currentImageId,
  editorState,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onReset,
  userId,
  isProcessing,
}: EditorHeaderProps) {
  const [isExporting, setIsExporting] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleExport = () => {
    setIsExporting(true)
    window.dispatchEvent(new CustomEvent("export-image"))
    setTimeout(() => setIsExporting(false), 1000)
  }

  const handleSave = async () => {
    setIsSaving(true)

    try {
      // Get the canvas data
      const canvas = document.querySelector("canvas") as HTMLCanvasElement
      if (!canvas) throw new Error("Canvas not found")

      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((b) => {
          if (b) resolve(b)
          else reject(new Error("Failed to create blob"))
        }, "image/png")
      })

      // Upload to storage
      const fileName = `${userId}/edited/${Date.now()}-${image.original_filename}`
      const { data: uploadData, error: uploadError } = await supabase.storage.from("images").upload(fileName, blob)

      if (uploadError) throw uploadError

      // Save edit history to database
      const { error: historyError } = await supabase.from("edit_history").insert({
        image_id: image.id,
        user_id: userId,
        operation_type: "edit",
        parameters: editorState,
        result_storage_path: uploadData.path,
      })

      if (historyError) throw historyError

      alert("Edit saved successfully!")
      router.refresh()
    } catch (error) {
      console.error("Save error:", error)
      alert("Failed to save edit. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-card px-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
        <div className="h-6 w-px bg-border" />
        <span className="text-sm font-medium">{image.original_filename}</span>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onUndo} disabled={!canUndo || isProcessing}>
          <Undo2 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={onRedo} disabled={!canRedo || isProcessing}>
          <Redo2 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={onReset} disabled={isProcessing}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset
        </Button>
        <div className="h-6 w-px bg-border" />
        <Button variant="outline" size="sm" onClick={handleSave} disabled={isSaving || isProcessing}>
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "Saving..." : "Save"}
        </Button>
        <Button size="sm" onClick={handleExport} disabled={isExporting || isProcessing}>
          <Download className="mr-2 h-4 w-4" />
          {isExporting ? "Exporting..." : "Export"}
        </Button>
      </div>
    </header>
  )
}
