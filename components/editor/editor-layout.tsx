"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { EditorHeader } from "./editor-header"
import { EditorSidebar } from "./editor-sidebar"
import { EditorCanvas } from "./editor-canvas"
import { EditorToolbar } from "./editor-toolbar"
import { useToast } from "@/hooks/use-toast"
import { useDebouncedOperations } from "@/hooks/useDebouncedOperations"
import type { ImageData, EditorState } from "@/types"
import {
  useAdjustBrightnessMutation,
  useAdjustContrastMutation,
  useAdjustChannelMutation,
  useConvertToGrayscaleMutation,
  useBinarizeImageMutation,
  useApplyNegativeMutation,
  useRotateImageMutation,
  useResetToOriginalMutation,
} from "@/store/api/imageApi"

interface EditorLayoutProps {
  image: ImageData
  imageUrl: string
  userId: string
}

export function EditorLayout({ image, imageUrl, userId }: EditorLayoutProps) {
  const [editorState, setEditorState] = useState<EditorState>({
    brightness: 0,
    contrast: 0,
    rotation: 0,
    scale: 1,
    flipHorizontal: false,
    flipVertical: false,
    filter: "none",
    showRed: true,
    showGreen: true,
    showBlue: true,
    showHistogram: false,
    compareMode: false,
  })

  const [currentImageId, setCurrentImageId] = useState<string>(image.id)
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null)
  const [originalImageId] = useState<string>(image.id)
  const [isProcessing, setIsProcessing] = useState(false)
  const [history, setHistory] = useState<EditorState[]>([editorState])
  const [historyIndex, setHistoryIndex] = useState(0)
  
  const { toast } = useToast()
  const router = useRouter()

  // API mutations
  const [adjustBrightness] = useAdjustBrightnessMutation()
  const [adjustContrast] = useAdjustContrastMutation()
  const [adjustChannel] = useAdjustChannelMutation()
  const [convertToGrayscale] = useConvertToGrayscaleMutation()
  const [binarizeImage] = useBinarizeImageMutation()
  const [applyNegative] = useApplyNegativeMutation()
  const [rotateImage] = useRotateImageMutation()
  const [resetToOriginal] = useResetToOriginalMutation()

  /**
   * Returns the debounce delay in milliseconds for a given operation
   */
  const getDebounceDelay = useCallback((operation: string) => {
    switch (operation) {
      case 'brightness':
      case 'contrast':
      case 'rotate':
      case 'channel':
        return 300
      default:
        return 0
    }
  }, [])

  const debouncedOps = useDebouncedOperations({
    getDelay: getDebounceDelay,
    isProcessing,
  })

  /**
   * Updates the editor state and adds the change to history
   */
  const updateState = (updates: Partial<EditorState>) => {
    const newState = { ...editorState, ...updates }
    setEditorState(newState)

    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(newState)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  /**
   * Executes an image processing operation and handles the response
   */
  const executeOperation = useCallback(async (operation: string, params: any) => {
    setIsProcessing(true)
    try {
      let result

      switch (operation) {
        case 'brightness':
          result = await adjustBrightness({
            image_id: currentImageId,
            factor: params.factor,
          }).unwrap()
          break
        case 'contrast':
          result = await adjustContrast({
            image_id: currentImageId,
            type: params.type,
            intensity: params.intensity,
          }).unwrap()
          break
        case 'channel':
          result = await adjustChannel({
            image_id: currentImageId,
            channel: params.channel,
            enabled: params.enabled,
          }).unwrap()
          break
        case 'grayscale':
          result = await convertToGrayscale({
            image_id: currentImageId,
            method: params.method,
          }).unwrap()
          break
        case 'binarize':
          result = await binarizeImage({
            image_id: currentImageId,
            threshold: params.threshold,
          }).unwrap()
          break
        case 'negative':
          result = await applyNegative({
            image_id: currentImageId,
          }).unwrap()
          break
        case 'rotate':
          result = await rotateImage({
            image_id: currentImageId,
            angle: params.angle,
          }).unwrap()
          break
        default:
          throw new Error(`Unknown operation: ${operation}`)
      }

      if (result && result.id) {
        console.log('Operation result:', result) // Debug log
        setCurrentImageId(result.id)
        
        // The API returns a URL in the format: /images/{id}/download
        // We need to convert it to the full URL
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
        const fullUrl = result.url.startsWith('http') 
          ? result.url 
          : `${apiUrl}${result.url}`
        
        console.log('Setting image URL:', fullUrl) // Debug log
        setCurrentImageUrl(fullUrl)

        debouncedOps.onOperationComplete(operation, params)

        toast({
          title: "Success",
          description: `${result.operation} applied successfully`,
        })
      }
    } catch (error: any) {
      console.error('Processing error:', error)
      toast({
        title: "Error",
        description: error?.data?.detail || `Failed to apply ${operation}`,
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }, [
    currentImageId,
    adjustBrightness,
    adjustContrast,
    adjustChannel,
    convertToGrayscale,
    binarizeImage,
    applyNegative,
    rotateImage,
    toast,
    debouncedOps,
  ])

  debouncedOps.setExecutor(executeOperation)

  /**
   * Schedules an image processing operation with debouncing and de-duplication
   * @param operation - The type of operation to perform
   * @param params - The parameters for the operation
   */
  const processImage = useCallback(async (operation: string, params: any) => {
    debouncedOps.scheduleOperation(operation, params)
  }, [debouncedOps])

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setEditorState(history[historyIndex - 1])
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setEditorState(history[historyIndex + 1])
    }
  }

  const reset = async () => {
    try {
      setIsProcessing(true)
      
      // Call the reset API endpoint to get the original image
      const result = await resetToOriginal({
        image_id: currentImageId,
      }).unwrap()

      if (result && result.id) {
        console.log('Reset result:', result)
        
        // Update to the original image
        setCurrentImageId(result.id)
        
        // Build full URL for the reset image
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
        const fullUrl = result.url.startsWith('http') 
          ? result.url 
          : `${apiUrl}${result.url}`
        
        console.log('Setting reset image URL:', fullUrl)
        setCurrentImageUrl(fullUrl)

        // Reset editor state to defaults
        const initialState: EditorState = {
          brightness: 0,
          contrast: 0,
          rotation: 0,
          scale: 1,
          flipHorizontal: false,
          flipVertical: false,
          filter: "none",
          showRed: true,
          showGreen: true,
          showBlue: true,
          showHistogram: false,
          compareMode: false,
        }
        
        // Reset history
        setHistory([initialState])
        setHistoryIndex(0)
        setEditorState(initialState)

        toast({
          title: "Success",
          description: "Image reset to original version",
        })
      }
    } catch (error: any) {
      console.error('Reset error:', error)
      toast({
        title: "Error",
        description: error?.data?.detail || "Failed to reset image",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <EditorHeader
        image={image}
        currentImageId={currentImageId}
        editorState={editorState}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onUndo={undo}
        onRedo={redo}
        onReset={reset}
        userId={userId}
        isProcessing={isProcessing}
      />

      <div className="flex flex-1 overflow-hidden">
        <EditorSidebar 
          editorState={editorState} 
          updateState={updateState}
          processImage={processImage}
          isProcessing={isProcessing}
        />

        <main className="flex flex-1 flex-col overflow-hidden">
          <EditorToolbar editorState={editorState} updateState={updateState} />
          <EditorCanvas
            image={image}
            currentImageId={currentImageId}
            currentImageUrl={currentImageUrl}
            originalImageId={originalImageId}
            editorState={editorState}
            isProcessing={isProcessing}
          />
        </main>
      </div>
    </div>
  )
}
