"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, X, FileImage, AlertCircle, CheckCircle2 } from "lucide-react"
import { useUploadImageMutation } from "@/store/api/imageApi"
import { useToast } from "@/hooks/use-toast"
import type { UploadFormData } from "@/types"

interface UploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/bmp"]
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".bmp"]

export function UploadDialog({ open, onOpenChange }: UploadDialogProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { toast } = useToast()

  const [uploadImage, { isLoading, isSuccess, error }] = useUploadImageMutation()

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return `Invalid file type. Please upload JPG, PNG, or BMP files.`
    }

    if (file.size > MAX_FILE_SIZE) {
      return `File size must be under 10MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB.`
    }

    return null
  }

  const handleFileSelect = (file: File) => {
    const error = validateFile(file)
    
    if (error) {
      setValidationError(error)
      setSelectedFile(null)
      setPreview(null)
      return
    }

    setValidationError(null)
    setSelectedFile(file)

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    try {
      const formData = new FormData()
      formData.append("file", selectedFile)

      const result = await uploadImage(formData).unwrap()

      toast({
        title: "Upload successful!",
        description: `${selectedFile.name} has been uploaded successfully.`,
      })

      // Reset state
      setSelectedFile(null)
      setPreview(null)
      setValidationError(null)

      // Close dialog
      onOpenChange(false)

      // Navigate to editor with the new image
      router.push(`/editor/${result.image.id}`)
    } catch (err: any) {
      console.error("Upload error:", err)
      toast({
        title: "Upload failed",
        description: err.data?.detail || "Failed to upload image. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleCancel = () => {
    setSelectedFile(null)
    setPreview(null)
    setValidationError(null)
    onOpenChange(false)
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    setPreview(null)
    setValidationError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Upload Image</DialogTitle>
          <DialogDescription>
            Upload a JPG, PNG, or BMP image (max 10MB) to start editing.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Drag and Drop Zone */}
          {!selectedFile && (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`
                relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
                ${dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"}
                ${isLoading ? "opacity-50 pointer-events-none" : "cursor-pointer hover:border-primary/50"}
              `}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept={ALLOWED_EXTENSIONS.join(",")}
                onChange={handleFileInputChange}
                disabled={isLoading}
              />

              <div className="flex flex-col items-center gap-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">
                    Drag and drop your image here, or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    JPG, PNG, or BMP (max 10MB)
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Validation Error */}
          {validationError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{validationError}</AlertDescription>
            </Alert>
          )}

          {/* Selected File Preview */}
          {selectedFile && preview && (
            <div className="space-y-4">
              <div className="relative rounded-lg border bg-muted/50 p-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8"
                  onClick={handleRemoveFile}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4" />
                </Button>

                <div className="flex gap-4">
                  {/* Preview Image */}
                  <div className="relative h-24 w-24 flex-shrink-0 rounded overflow-hidden bg-background">
                    <img
                      src={preview}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2">
                      <FileImage className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>

                    {isLoading && (
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Uploading...</span>
                          <span className="font-medium">Processing</span>
                        </div>
                        <Progress value={undefined} className="h-1" />
                      </div>
                    )}

                    {isSuccess && (
                      <div className="mt-3 flex items-center gap-2 text-xs text-green-600">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Upload complete!</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Upload Info */}
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  Your image will be uploaded securely and you'll be redirected to the editor.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || isLoading || !!validationError}
            >
              {isLoading ? (
                <>
                  <Upload className="mr-2 h-4 w-4 animate-pulse" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload & Edit
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
