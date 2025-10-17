"use client"

import { Button } from "@/components/ui/button"
import { BarChart3, GitCompare } from "lucide-react"
import type { EditorState } from "@/types"

interface EditorToolbarProps {
  editorState: EditorState
  updateState: (updates: Partial<EditorState>) => void
}

export function EditorToolbar({ editorState, updateState }: EditorToolbarProps) {
  return (
    <div className="flex h-12 items-center gap-2 border-b border-border bg-muted/30 px-4">
      <Button
        variant={editorState.showHistogram ? "default" : "ghost"}
        size="sm"
        onClick={() => updateState({ showHistogram: !editorState.showHistogram })}
      >
        <BarChart3 className="mr-2 h-4 w-4" />
        Histogram
      </Button>
      <Button
        variant={editorState.compareMode ? "default" : "ghost"}
        size="sm"
        onClick={() => updateState({ compareMode: !editorState.compareMode })}
      >
        <GitCompare className="mr-2 h-4 w-4" />
        Compare
      </Button>
    </div>
  )
}
