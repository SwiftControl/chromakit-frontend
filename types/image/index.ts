export interface ImageMetadata {
  id: string;
  user_id: string;
  path: string;
  width: number;
  height: number;
  mime_type: string;
  created_at: string;
  original_id: string | null;
  original_filename: string | null;
  file_size: number | null;
  url: string | null;
}

export interface UploadImageResponse {
  image: ImageMetadata;
}

export interface ImageListResponse {
  images: ImageMetadata[];
  total: number;
  limit: number;
  offset: number;
}

export interface DeleteImageResponse {
  ok: boolean;
}

export interface ImageState {
  currentImageId: string | null;
  originalImageId: string | null;
  processingHistory: HistoryItem[];
  isProcessing: boolean;
  currentOperation: string | null;
  uploadProgress: number;
  error: string | null;
}

export interface HistoryItem {
  id: string;
  user_id: string;
  image_id: string;
  operation: string;
  params: Record<string, any>;
  created_at: string;
}

export interface ListHistoryResponse {
  history: HistoryItem[];
}

export interface DeleteHistoryResponse {
  ok: boolean;
}
