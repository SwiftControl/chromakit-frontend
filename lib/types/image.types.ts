// ============================================================================
// Core Types - Match backend API spec
// ============================================================================

// Image metadata returned from backend
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

// Image upload response
export interface UploadImageResponse {
  image: ImageMetadata;
}

// Image list response
export interface ImageListResponse {
  images: ImageMetadata[];
  total: number;
  limit: number;
  offset: number;
}

// Delete image response
export interface DeleteImageResponse {
  ok: boolean;
}

// ============================================================================
// Image Processing Response - All processing operations return this
// ============================================================================

export interface ProcessingOperationResponse {
  id: string;                           // New processed image ID
  url: string;                          // Public URL to access the processed image
  width: number | null;                 // Processed image width
  height: number | null;                // Processed image height
  mime_type: string | null;             // MIME type
  operation: string;                    // Operation name
  parameters: Record<string, any>;      // Parameters used
  original_image_id: string;            // Original image ID
  created_at: string | null;            // ISO 8601 datetime
}

// ============================================================================
// Image Processing Request Parameters
// ============================================================================

export interface BrightnessParams {
  image_id: string;
  factor: number; // > 0 (1.0 = no change, >1.0 = brighter, <1.0 = darker)
}

export interface ContrastParams {
  image_id: string;
  type: "logarithmic" | "exponential";
  intensity: number; // > 0 (higher = more dramatic)
}

export interface ChannelParams {
  image_id: string;
  channel: "red" | "green" | "blue" | "cyan" | "magenta" | "yellow";
  enabled: boolean;
}

export interface GrayscaleParams {
  image_id: string;
  method: "average" | "luminosity" | "midgray";
}

export interface BinarizeParams {
  image_id: string;
  threshold: number; // 0.0 to 1.0
}

export interface NegativeParams {
  image_id: string;
}

export interface TranslateParams {
  image_id: string;
  dx: number; // Horizontal offset (positive = right)
  dy: number; // Vertical offset (positive = down)
}

export interface RotateParams {
  image_id: string;
  angle: number; // Degrees (positive = counter-clockwise)
}

export interface CropParams {
  image_id: string;
  x_start: number; // >= 0
  x_end: number;   // > x_start
  y_start: number; // >= 0
  y_end: number;   // > y_start
}

export interface ReduceResolutionParams {
  image_id: string;
  factor: number; // 2-10 (2 = half size, 3 = one-third size)
}

export interface EnlargeRegionParams {
  image_id: string;
  x_start: number;
  x_end: number;
  y_start: number;
  y_end: number;
  zoom_factor: number; // 1-10
}

export interface MergeParams {
  image1_id: string; // Base image
  image2_id: string; // Overlay image
  transparency: number; // 0.0 (transparent) to 1.0 (opaque)
}

// ============================================================================
// Histogram
// ============================================================================

export interface HistogramResponseGrayscale {
  histogram: {
    gray: number[];
  };
}

export interface HistogramResponseColor {
  histogram: {
    red: number[];
    green: number[];
    blue: number[];
  };
}

export type HistogramData = HistogramResponseGrayscale | HistogramResponseColor;

// Image state management
export interface ImageState {
  currentImageId: string | null;
  originalImageId: string | null;
  processingHistory: EditHistory[];
  isProcessing: boolean;
  currentOperation: string | null;
  uploadProgress: number;
  error: string | null;
}

// ============================================================================
// Processing History
// ============================================================================

export interface HistoryItem {
  id: string;
  user_id: string;
  image_id: string;
  operation: string;
  params: Record<string, any>;
  created_at: string; // ISO 8601 datetime
}

export interface ListHistoryResponse {
  history: HistoryItem[];
}

export interface DeleteHistoryResponse {
  ok: boolean;
}

// Legacy types - for backward compatibility
export interface EditHistory {
  id: string;
  image_id: string;
  operation_type: string;
  parameters: Record<string, any>;
  result_storage_path: string;
  created_at: string;
  original_image: {
    id: string;
    original_filename: string;
  };
}

export interface EditHistoryResponse {
  history: EditHistory[];
  total: number;
}

// Form validation schemas
export interface UploadFormData {
  file: File;
}

export interface TransformFormData {
  brightness: number;
  contrast: number;
  rotation: number;
  cropX: number;
  cropY: number;
  cropWidth: number;
  cropHeight: number;
}