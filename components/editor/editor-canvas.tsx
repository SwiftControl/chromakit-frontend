"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, RotateCcw, Maximize2, Minimize2, Loader2 } from "lucide-react"
import { useGetHistogramQuery } from "@/store/api/imageApi"
import { createClient } from "@/lib/supabase/client"
import { HistogramPanel } from "./histogram-panel"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

import type { ImageData, EditorState } from "@/lib/types/editor"

interface EditorCanvasProps {
  image: ImageData
  currentImageId: string
  currentImageUrl: string | null
  originalImageId: string
  editorState: EditorState
}

export function EditorCanvas({ image, currentImageId, currentImageUrl, originalImageId, editorState }: EditorCanvasProps) {
  const showComparison = editorState.compareMode
  const showHistogram = editorState.showHistogram
  const [imageLoaded, setImageLoaded] = useState(false)
  const [originalLoaded, setOriginalLoaded] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [imageError, setImageError] = useState<string | null>(null)

  const { toast } = useToast()
  const supabase = createClient()

  // Get authenticated image URLs (fallback when no URL from API)
  const getAuthenticatedImageUrl = async (imageId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        throw new Error('No authentication token')
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      return `${apiUrl}/images/${imageId}/download`
    } catch (error) {
      console.error('Error getting authenticated URL:', error)
      return null
    }
  }

  const [displayImageUrl, setDisplayImageUrl] = useState<string | null>(null)
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null)

  // Load current image URL - prefer URL from API (currentImageUrl), fallback to building URL from imageId
  useEffect(() => {
    const loadImageUrl = async () => {
      try {
        setImageError(null)
        setImageLoaded(false)

        // Use the URL from API response if available, otherwise build URL from imageId
        if (currentImageUrl) {
          setDisplayImageUrl(currentImageUrl)
        } else {
          const url = await getAuthenticatedImageUrl(currentImageId)
          if (url) {
            setDisplayImageUrl(url)
          } else {
            setImageError('Failed to load image URL')
          }
        }
      } catch (error) {
        setImageError('Failed to load image')
      }
    }

    loadImageUrl()
  }, [currentImageId, currentImageUrl])

  useEffect(() => {
    if (showComparison && originalImageId !== currentImageId) {
      const loadOriginalUrl = async () => {
        try {
          setOriginalLoaded(false)
          const url = await getAuthenticatedImageUrl(originalImageId)
          if (url) {
            setOriginalImageUrl(url)
          }
        } catch (error) {
          console.error('Failed to load original image:', error)
        }
      }
      
      loadOriginalUrl()
    }
  }, [showComparison, originalImageId, currentImageId])

  // Custom image component with auth headers
  const AuthenticatedImage = ({ 
    src, 
    alt, 
    onLoad, 
    onError, 
    className 
  }: {
    src: string | null
    alt: string
    onLoad?: () => void
    onError?: () => void
    className?: string
  }) => {
    const [imgSrc, setImgSrc] = useState<string | null>(null)
    
    useEffect(() => {
      if (!src) return
      
      const loadImage = async () => {
        try {
          const { data: { session } } = await supabase.auth.getSession()
          if (!session?.access_token) {
            onError?.()
            return
          }
          
          const response = await fetch(src, {
            headers: {
              'Authorization': `Bearer ${session.access_token}`,
            },
          })
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          
          const blob = await response.blob()
          const objectUrl = URL.createObjectURL(blob)
          setImgSrc(objectUrl)
          onLoad?.()
          
          // Cleanup
          return () => {
            URL.revokeObjectURL(objectUrl)
          }
        } catch (error) {
          console.error('Failed to load authenticated image:', error)
          onError?.()
        }
      }
      
      loadImage()
    }, [src, onLoad, onError])
    
    if (!imgSrc) {
      return (
        <div className={`flex items-center justify-center bg-muted/20 ${className || ''}`}>
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )
    }
    
    return (
      <img
        src={imgSrc}
        alt={alt}
        className={className}
        style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
      />
    )
  }

  // Get authenticated image URLs
  const getImageUrl = (imageId: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    return `${apiUrl}/images/${imageId}/download`
  }

  const handleDownload = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.access_token) {
        toast({
          title: "Authentication Required",
          description: "Please log in to download the image",
          variant: "destructive",
        })
        return
      }
      
      const url = getImageUrl(currentImageId)
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      })
      
      if (!response.ok) {
        throw new Error('Failed to download image')
      }
      
      const blob = await response.blob()
      const downloadUrl = URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = image.original_filename || `image-${currentImageId}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      URL.revokeObjectURL(downloadUrl)
      toast({
        title: "Success",
        description: "Image downloaded successfully",
      })
    } catch (error) {
      console.error('Download error:', error)
      toast({
        title: "Error", 
        description: "Failed to download image",
        variant: "destructive",
      })
    }
  }

  const handleExport = () => {
    // Trigger download
    handleDownload()
  }

  // Listen for export events
  useEffect(() => {
    const handleExportEvent = () => {
      handleExport()
    }

    window.addEventListener("export-image", handleExportEvent)
    return () => window.removeEventListener("export-image", handleExportEvent)
  }, [])

  if (imageError) {
    return (
      <div className="flex flex-1 items-center justify-center bg-muted/20">
        <div className="text-center space-y-4">
          <p className="text-destructive">{imageError}</p>
          <Button 
            variant="outline" 
            onClick={() => {
              setImageError(null)
              setImageLoaded(false)
            }}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      <div className={`flex flex-1 items-center justify-center overflow-auto bg-muted/20 p-8 ${isFullscreen ? 'fixed inset-0 z-50 bg-background' : ''}`}>
        {/* Image Controls */}
        <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="bg-background/80 backdrop-blur-sm"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="bg-background/80 backdrop-blur-sm"
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        </div>

                {showComparison && originalImageId !== currentImageId ? (
          <div className="flex w-full space-x-4">
            <div className="flex-1">
              <h3 className="mb-2 text-sm font-medium">Original</h3>
              <AuthenticatedImage
                src={originalImageUrl}
                alt="Original image"
                onLoad={() => setOriginalLoaded(true)}
                onError={() => setImageError('Failed to load original image')}
                className="w-full"
              />
            </div>
            <div className="flex-1">
              <h3 className="mb-2 text-sm font-medium">Current</h3>
              <AuthenticatedImage
                src={displayImageUrl}
                alt={image.original_filename}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError('Failed to load image')}
                className="w-full"
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <div className="border border-border shadow-lg rounded-lg overflow-hidden bg-white max-h-[80vh] max-w-[80vw]">
              <AuthenticatedImage
                src={displayImageUrl}
                alt={image.original_filename}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError('Failed to load image')}
                className="w-full h-full"
              />
            </div>
          </div>
        )}
      </div>

      {showHistogram && imageLoaded && (
        <HistogramPanel key={currentImageId} imageId={currentImageId} />
      )}
    </div>
  )
}
