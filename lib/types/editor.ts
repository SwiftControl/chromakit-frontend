export interface ImageData {
  id: string
  user_id: string
  original_filename: string
  storage_path: string
  file_size: number
  mime_type: string
  width: number
  height: number
  created_at: string
  updated_at: string
}

export interface EditorState {
  brightness: number
  contrast: number
  rotation: number
  scale: number
  flipHorizontal: boolean
  flipVertical: boolean
  filter: string
  showRed: boolean
  showGreen: boolean
  showBlue: boolean
  showHistogram: boolean
  compareMode: boolean
}
