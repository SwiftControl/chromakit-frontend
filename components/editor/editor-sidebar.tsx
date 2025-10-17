"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDebounce } from "@/hooks/useDebounce"
import type { EditorState } from "@/types"

interface EditorSidebarProps {
  editorState: EditorState
  updateState: (updates: Partial<EditorState>) => void
  processImage: (operation: string, params: any) => Promise<void>
  isProcessing: boolean
}

export function EditorSidebar({ editorState, updateState, processImage, isProcessing }: EditorSidebarProps) {
  // Debounced API calls (300ms delay)
  const debouncedBrightness = useDebounce((factor: number) => {
    processImage('brightness', { factor })
  }, 300)

  const debouncedContrast = useDebounce((type: string, intensity: number) => {
    processImage('contrast', { type, intensity })
  }, 300)

  const debouncedRotation = useDebounce((angle: number) => {
    processImage('rotate', { angle })
  }, 300)

  const debouncedChannel = useDebounce((channel: string, enabled: boolean) => {
    processImage('channel', { channel, enabled })
  }, 300)

  // Handle brightness changes with debounced API call
  const handleBrightnessChange = (value: number) => {
    // Update UI immediately
    updateState({ brightness: value })
    
    // Convert from -100/100 to factor (0.2 to 1.5)
    // More conservative range to prevent too bright/dark images
    const factor = value >= 0 
      ? 1 + (value / 200)  // Max 1.5x brighter (at value=100)
      : 1 + (value / 125)  // Min 0.2x darker (at value=-100)
    
    // API call is debounced (waits 300ms after last change)
    debouncedBrightness(factor)
  }

  // Handle contrast changes with debounced API call
  const handleContrastChange = (value: number) => {
    // Update UI immediately
    updateState({ contrast: value })
    
    const type = value > 0 ? 'exponential' : 'logarithmic'
    const intensity = Math.abs(value) / 100 // Convert -100/100 to 0-1 range
    
    // API call is debounced (waits 300ms after last change)
    debouncedContrast(type, intensity)
  }

  // Handle rotation with debounced API call
  const handleRotationChange = (value: number) => {
    // Update UI immediately
    updateState({ rotation: value })
    
    // API call is debounced (waits 300ms after last change)
    debouncedRotation(value)
  }

  // Handle filter changes with API call (no debounce needed - single action)
  const handleFilterChange = async (filter: string) => {
    updateState({ filter })
    
    switch (filter) {
      case 'grayscale':
        await processImage('grayscale', { method: 'luminosity' })
        break
      case 'negative':
        await processImage('negative', {})
        break
      case 'binarization':
        await processImage('binarize', { threshold: 0.5 })
        break
      case 'none':
        // Reset to original - could implement reset functionality
        break
    }
  }

  // Handle RGB channel changes with debounced API call
  const handleChannelChange = (channel: 'red' | 'green' | 'blue', enabled: boolean) => {
    // Update UI immediately
    updateState({ 
      [`show${channel.charAt(0).toUpperCase() + channel.slice(1)}`]: enabled 
    } as Partial<EditorState>)
    
    // API call is debounced (waits 300ms after last change)
    debouncedChannel(channel, enabled)
  }
  return (
    <aside className="w-80 overflow-y-auto border-r border-border bg-card">
      <Tabs defaultValue="adjust" className="w-full">
        <TabsList className="w-full rounded-none border-b">
          <TabsTrigger value="adjust" className="flex-1">
            Adjust
          </TabsTrigger>
          <TabsTrigger value="filters" className="flex-1">
            Filters
          </TabsTrigger>
          <TabsTrigger value="channels" className="flex-1">
            Channels
          </TabsTrigger>
        </TabsList>

        <TabsContent value="adjust" className="p-4 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Brightness & Contrast</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs">Brightness: {editorState.brightness}</Label>
                <Slider
                  value={[editorState.brightness]}
                  onValueChange={([value]) => handleBrightnessChange(value)}
                  min={-100}
                  max={100}
                  step={1}
                  disabled={isProcessing}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Contrast: {editorState.contrast}</Label>
                <Slider
                  value={[editorState.contrast]}
                  onValueChange={([value]) => handleContrastChange(value)}
                  min={-100}
                  max={100}
                  step={1}
                  disabled={isProcessing}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Transform</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs">Rotation: {editorState.rotation}°</Label>
                <Slider
                  value={[editorState.rotation]}
                  onValueChange={([value]) => handleRotationChange(value)}
                  min={0}
                  max={360}
                  step={1}
                  disabled={isProcessing}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Scale: {editorState.scale.toFixed(2)}x</Label>
                <Slider
                  value={[editorState.scale]}
                  onValueChange={([value]) => updateState({ scale: value })}
                  min={0.1}
                  max={3}
                  step={0.1}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-xs">Flip Horizontal</Label>
                <Switch
                  checked={editorState.flipHorizontal}
                  onCheckedChange={(checked) => updateState({ flipHorizontal: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-xs">Flip Vertical</Label>
                <Switch
                  checked={editorState.flipVertical}
                  onCheckedChange={(checked) => updateState({ flipVertical: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="filters" className="p-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Apply Filter</CardTitle>
            </CardHeader>
            <CardContent>
              <Select 
                value={editorState.filter} 
                onValueChange={handleFilterChange}
                disabled={isProcessing}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="grayscale">Grayscale</SelectItem>
                  <SelectItem value="negative">Negative</SelectItem>
                  <SelectItem value="binarization">Binarization</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="channels" className="p-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">RGB Channels</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Red Channel</Label>
                <Switch
                  checked={editorState.showRed}
                  onCheckedChange={(checked) => handleChannelChange('red', checked)}
                  disabled={isProcessing}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-xs">Green Channel</Label>
                <Switch
                  checked={editorState.showGreen}
                  onCheckedChange={(checked) => handleChannelChange('green', checked)}
                  disabled={isProcessing}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-xs">Blue Channel</Label>
                <Switch
                  checked={editorState.showBlue}
                  onCheckedChange={(checked) => handleChannelChange('blue', checked)}
                  disabled={isProcessing}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </aside>
  )
}
