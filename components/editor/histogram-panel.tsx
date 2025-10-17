"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useGetHistogramQuery } from "@/store/api/imageApi"
import { Loader2, BarChart3 } from "lucide-react"

interface HistogramPanelProps {
  imageId: string
}

export function HistogramPanel({ imageId }: HistogramPanelProps) {
  const histogramCanvasRef = useRef<HTMLCanvasElement>(null)

  // Fetch histogram data from backend - automatically refetches when imageId changes
  const {
    data: histogramData,
    isLoading,
    error,
    refetch
  } = useGetHistogramQuery(imageId, {
    // Force refetch when imageId changes to ensure fresh data
    refetchOnMountOrArgChange: true,
  })

  useEffect(() => {
    if (!histogramData || !histogramCanvasRef.current) return

    const canvas = histogramCanvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = 300
    canvas.height = 150

    // Clear canvas
    ctx.clearRect(0, 0, 300, 150)

    const { histogram } = histogramData

    // Check if it's RGB or grayscale histogram using type guard
    const isGrayscale = 'gray' in histogram

    if (isGrayscale) {
      // Draw grayscale histogram
      const maxValue = Math.max(...histogram.gray)
      const binWidth = 300 / 256

      ctx.fillStyle = "rgba(107, 114, 128, 0.7)"

      for (let i = 0; i < histogram.gray.length; i++) {
        const height = maxValue > 0 ? (histogram.gray[i] / maxValue) * 150 : 0
        ctx.fillRect(i * binWidth, 150 - height, Math.max(binWidth, 1), height)
      }
    } else {
      // Draw RGB histogram
      const maxValue = Math.max(
        ...histogram.red,
        ...histogram.green,
        ...histogram.blue
      )
      const binWidth = 300 / 256

      // Draw red channel
      ctx.fillStyle = "rgba(239, 68, 68, 0.5)"
      for (let i = 0; i < histogram.red.length; i++) {
        const height = maxValue > 0 ? (histogram.red[i] / maxValue) * 150 : 0
        ctx.fillRect(i * binWidth, 150 - height, Math.max(binWidth, 1), height)
      }

      // Draw green channel
      ctx.fillStyle = "rgba(34, 197, 94, 0.5)"
      for (let i = 0; i < histogram.green.length; i++) {
        const height = maxValue > 0 ? (histogram.green[i] / maxValue) * 150 : 0
        ctx.fillRect(i * binWidth, 150 - height, Math.max(binWidth, 1), height)
      }

      // Draw blue channel
      ctx.fillStyle = "rgba(59, 130, 246, 0.5)"
      for (let i = 0; i < histogram.blue.length; i++) {
        const height = maxValue > 0 ? (histogram.blue[i] / maxValue) * 150 : 0
        ctx.fillRect(i * binWidth, 150 - height, Math.max(binWidth, 1), height)
      }
    }
  }, [histogramData])

  if (error) {
    return (
      <div className="p-4 h-full">
        <Card className="h-full">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Histogram
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center text-sm text-muted-foreground py-8">
              Failed to load histogram
              <button 
                onClick={() => refetch()} 
                className="ml-2 text-primary hover:underline"
              >
                Retry
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-4 h-full">
      <Card className="h-full">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Histogram
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : histogramData ? (
            <>
              <div className="bg-muted/30 rounded-lg p-3 border">
                <canvas ref={histogramCanvasRef} className="w-full" />
              </div>
              <div className="space-y-3">
                <h4 className="text-sm font-medium">Channels</h4>
                {'gray' in histogramData.histogram ? (
                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-4 w-4 rounded bg-gray-500/70 border" />
                    <span className="text-muted-foreground">Intensity</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <div className="h-4 w-4 rounded bg-red-500/50 border border-red-500/30" />
                      <span className="text-muted-foreground">Red Channel</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="h-4 w-4 rounded bg-green-500/50 border border-green-500/30" />
                      <span className="text-muted-foreground">Green Channel</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <div className="h-4 w-4 rounded bg-blue-500/50 border border-blue-500/30" />
                      <span className="text-muted-foreground">Blue Channel</span>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center py-12">
              <p className="text-sm text-muted-foreground">No histogram data available</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
