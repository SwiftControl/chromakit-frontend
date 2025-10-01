"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { EditorState } from "@/lib/types/editor"

interface EditorSidebarProps {
  editorState: EditorState
  updateState: (updates: Partial<EditorState>) => void
  processImage: (operation: string, params: any) => Promise<void>
  isProcessing: boolean
}

export function EditorSidebar({ editorState, updateState, processImage, isProcessing }: EditorSidebarProps) {
  // Handle brightness changes with API call
  const handleBrightnessChange = async (value: number) => {
    updateState({ brightness: value })
    if (value !== 0) {
      // Convert from -100/100 to factor (0.0 to 2.0)
      const factor = value >= 0 ? 1 + (value / 100) : 1 - (Math.abs(value) / 100) * 0.8
      await processImage('brightness', { factor })
    }
  }

  // Handle contrast changes with API call  
  const handleContrastChange = async (value: number) => {
    updateState({ contrast: value })
    if (value !== 0) {
      const type = value > 0 ? 'exponential' : 'logarithmic'
      const intensity = Math.abs(value) / 50 // Convert -100/100 to 0-2 range
      await processImage('contrast', { type, intensity })
    }
  }

  // Handle rotation with API call
  const handleRotationChange = async (value: number) => {
    updateState({ rotation: value })
    if (value !== 0) {
      await processImage('rotate', { angle: value })
    }
  }

  // Handle filter changes with API call
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
      // Add other filters as needed
    }
  }

  // Handle RGB channel changes
  const handleChannelChange = async (channel: 'red' | 'green' | 'blue', enabled: boolean) => {
    updateState({ 
      [`show${channel.charAt(0).toUpperCase() + channel.slice(1)}`]: enabled 
    } as Partial<EditorState>)
    
    await processImage('channel', { channel, enabled })
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
