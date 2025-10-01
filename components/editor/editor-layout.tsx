"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { EditorHeader } from "./editor-header"
import { EditorSidebar } from "./editor-sidebar"
import { EditorCanvas } from "./editor-canvas"
import { EditorToolbar } from "./editor-toolbar"
import { useToast } from "@/hooks/use-toast"
import type { ImageData, EditorState } from "@/lib/types/editor"
import {
  useAdjustBrightnessMutation,
  useAdjustContrastMutation,
  useAdjustChannelMutation,
  useConvertToGrayscaleMutation,
  useBinarizeImageMutation,
  useApplyNegativeMutation,
  useRotateImageMutation,
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

  const updateState = (updates: Partial<EditorState>) => {
    const newState = { ...editorState, ...updates }
    setEditorState(newState)

    // Add to history
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(newState)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  // Process image operations - Updated to handle ProcessingOperationResponse
  const processImage = async (operation: string, params: any) => {
    if (isProcessing) return

    setIsProcessing(true)
    try {
      let result

      switch (operation) {
        case 'brightness':
          result = await adjustBrightness({
            image_id: currentImageId,
            factor: params.factor
          }).unwrap()
          break
        case 'contrast':
          result = await adjustContrast({
            image_id: currentImageId,
            type: params.type,
            intensity: params.intensity
          }).unwrap()
          break
        case 'channel':
          result = await adjustChannel({
            image_id: currentImageId,
            channel: params.channel,
            enabled: params.enabled
          }).unwrap()
          break
        case 'grayscale':
          result = await convertToGrayscale({
            image_id: currentImageId,
            method: params.method
          }).unwrap()
          break
        case 'binarize':
          result = await binarizeImage({
            image_id: currentImageId,
            threshold: params.threshold
          }).unwrap()
          break
        case 'negative':
          result = await applyNegative({
            image_id: currentImageId
          }).unwrap()
          break
        case 'rotate':
          result = await rotateImage({
            image_id: currentImageId,
            angle: params.angle
          }).unwrap()
          break
        default:
          throw new Error(`Unknown operation: ${operation}`)
      }

      // All processing operations now return ProcessingOperationResponse with id and url
      if (result && result.id) {
        // Update the current image ID to the newly processed image
        setCurrentImageId(result.id)

        // Update the current image URL if provided by the API
        if (result.url) {
          setCurrentImageUrl(result.url)
        }

        toast({
          title: "Success",
          description: `${result.operation} applied successfully`,
        })
      }
    } catch (error: any) {
      console.error('Processing error:', error)
      toast({
        title: "Error",
        description: error.data?.detail || `Failed to apply ${operation}`,
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

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

  const reset = () => {
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
    setCurrentImageId(originalImageId) // Reset to original image
    updateState(initialState)
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
          />
        </main>
      </div>
    </div>
  )
}
