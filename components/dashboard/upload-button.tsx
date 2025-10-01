"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

interface UploadButtonProps {
  userId: string
}

export function UploadButton({ userId }: UploadButtonProps) {
  const [isUploading, setIsUploading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file")
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB")
      return
    }

    setIsUploading(true)

    try {
      // Create a unique file path
      const fileExt = file.name.split(".").pop()
      const fileName = `${userId}/${Date.now()}.${fileExt}`

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage.from("images").upload(fileName, file)

      if (uploadError) throw uploadError

      // Get image dimensions
      const img = new Image()
      const imageUrl = URL.createObjectURL(file)
      img.src = imageUrl

      await new Promise((resolve) => {
        img.onload = resolve
      })

      // Save image metadata to database
      const { error: dbError } = await supabase.from("images").insert({
        user_id: userId,
        original_filename: file.name,
        storage_path: uploadData.path,
        file_size: file.size,
        mime_type: file.type,
        width: img.width,
        height: img.height,
      })

      URL.revokeObjectURL(imageUrl)

      if (dbError) throw dbError

      router.refresh()
    } catch (error) {
      console.error("Upload error:", error)
      alert("Failed to upload image. Please try again.")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <>
      <input
        type="file"
        id="file-upload"
        className="hidden"
        accept="image/*"
        onChange={handleFileUpload}
        disabled={isUploading}
      />
      <Button asChild disabled={isUploading}>
        <label htmlFor="file-upload" className="cursor-pointer">
          <Upload className="mr-2 h-4 w-4" />
          {isUploading ? "Uploading..." : "Upload Image"}
        </label>
      </Button>
    </>
  )
}
