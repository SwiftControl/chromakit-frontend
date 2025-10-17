"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, RotateCcw, Maximize2, Minimize2, Loader2 } from "lucide-react"
import { useGetHistogramQuery } from "@/store/api/imageApi"
import { createClient } from "@/lib/supabase/client"
import { HistogramPanel } from "./histogram-panel"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

import type { ImageData, EditorState } from "@/types"

interface EditorCanvasProps {
  image: ImageData
  currentImageId: string
  currentImageUrl: string | null
  originalImageId: string
  editorState: EditorState
  isProcessing?: boolean
}

export function EditorCanvas({ image, currentImageId, currentImageUrl, originalImageId, editorState, isProcessing }: EditorCanvasProps) {
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
          // Force a fresh URL by adding timestamp to prevent caching
          const urlWithTimestamp = `${currentImageUrl}${currentImageUrl.includes('?') ? '&' : '?'}t=${Date.now()}`
          setDisplayImageUrl(urlWithTimestamp)
        } else {
          const url = await getAuthenticatedImageUrl(currentImageId)
          if (url) {
            // Force a fresh URL by adding timestamp to prevent caching
            const urlWithTimestamp = `${url}${url.includes('?') ? '&' : '?'}t=${Date.now()}`
            setDisplayImageUrl(urlWithTimestamp)
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
    const [isLoading, setIsLoading] = useState(false)
    
    useEffect(() => {
      if (!src) return
      
      // Cleanup previous object URL when src changes
      let isCancelled = false
      let objectUrl: string | null = null
      
      const loadImage = async () => {
        try {
          setIsLoading(true)
          setImgSrc(null) // Clear previous image while loading
          
          const { data: { session } } = await supabase.auth.getSession()
          if (!session?.access_token) {
            if (!isCancelled) {
              onError?.()
              setIsLoading(false)
            }
            return
          }
          
          // Remove timestamp from URL for the actual fetch
          const cleanUrl = src.split('?t=')[0]
          const response = await fetch(cleanUrl, {
            headers: {
              'Authorization': `Bearer ${session.access_token}`,
            },
            cache: 'no-store', // Disable caching
          })
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          
          const blob = await response.blob()
          objectUrl = URL.createObjectURL(blob)
          
          if (!isCancelled) {
            setImgSrc(objectUrl)
            setIsLoading(false)
            onLoad?.()
          }
        } catch (error) {
          console.error('Failed to load authenticated image:', error)
          if (!isCancelled) {
            onError?.()
            setIsLoading(false)
          }
        }
      }
      
      loadImage()
      
      // Cleanup function
      return () => {
        isCancelled = true
        if (objectUrl) {
          URL.revokeObjectURL(objectUrl)
        }
      }
    }, [src, onLoad, onError])
    
    if (isLoading || !imgSrc) {
      return (
        <div className={`flex items-center justify-center bg-muted/20 ${className || ''}`}>
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            {isLoading && <p className="text-sm text-muted-foreground">Loading image...</p>}
          </div>
        </div>
      )
    }
    
    return (
      <img
        src={imgSrc}
        alt={alt}
        className={className}
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
      {/* Main Canvas Area */}
      <div className={`relative flex flex-1 items-center justify-center bg-muted/20 ${isFullscreen ? 'fixed inset-0 z-50 bg-background' : ''}`}>
        {/* Processing Overlay */}
        {(isProcessing || (!imageLoaded && !imageError)) && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-20">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-sm font-medium">
                {isProcessing ? 'Processing image...' : 'Loading image...'}
              </p>
            </div>
          </div>
        )}
        
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

        {/* Image Display */}
        {showComparison && originalImageId !== currentImageId ? (
          <div className="flex w-full h-full gap-4 p-8">
            <div className="flex-1 flex flex-col min-w-0">
              <h3 className="mb-2 text-sm font-medium text-center">Original</h3>
              <div className="flex-1 flex items-center justify-center min-h-0">
                <AuthenticatedImage
                  src={originalImageUrl}
                  alt="Original image"
                  onLoad={() => setOriginalLoaded(true)}
                  onError={() => setImageError('Failed to load original image')}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </div>
            <div className="flex-1 flex flex-col min-w-0">
              <h3 className="mb-2 text-sm font-medium text-center">Current</h3>
              <div className="flex-1 flex items-center justify-center min-h-0">
                <AuthenticatedImage
                  src={displayImageUrl}
                  alt={image.original_filename}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageError('Failed to load image')}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full p-8 flex items-center justify-center">
            <AuthenticatedImage
              src={displayImageUrl}
              alt={image.original_filename}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError('Failed to load image')}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        )}
      </div>

      {/* Histogram Panel - Side Panel */}
      {showHistogram && imageLoaded && (
        <div className="w-80 border-l bg-background overflow-auto flex-shrink-0">
          <HistogramPanel key={currentImageId} imageId={currentImageId} />
        </div>
      )}
    </div>
  )
}
