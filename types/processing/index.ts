export interface ProcessingOperationResponse {
  id: string;
  url: string;
  width: number | null;
  height: number | null;
  mime_type: string | null;
  operation: string;
  parameters: Record<string, any>;
  original_image_id: string;
  created_at: string | null;
}

export interface BrightnessParams {
  factor: number;
}

export interface ContrastParams {
  image_id: string;
  type: "logarithmic" | "exponential";
  intensity: number;
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
  threshold: number;
}

export interface NegativeParams {
  image_id: string;
}

export interface TranslateParams {
  image_id: string;
  dx: number;
  dy: number;
}

export interface RotateParams {
  image_id: string;
  angle: number;
}

export interface CropParams {
  image_id: string;
  x_start: number;
  x_end: number;
  y_start: number;
  y_end: number;
}

export interface ReduceResolutionParams {
  image_id: string;
  factor: number;
}

export interface EnlargeRegionParams {
  image_id: string;
  x_start: number;
  x_end: number;
  y_start: number;
  y_end: number;
  zoom_factor: number;
}

export interface MergeParams {
  image1_id: string;
  image2_id: string;
  transparency: number;
}

export interface ResetParams {
  image_id: string;
}

/**
 * Types of operations supported in batch processing.
 * Each type corresponds to a specific image manipulation.
 */
export type OperationType = "brightness"
| "log_contrast"
| "exp_contrast"
| "invert"
| "grayscale_average"
| "grayscale_luminosity"
| "grayscale_midgray"
| "binarize"
| "channel_red"
| "channel_green"
| "channel_blue"
| "channel_cyan"
| "channel_magenta"
| "channel_yellow"
| "translate"
| "rotate"
| "crop"
| "reduce_resolution"
| "enlarge_region"
| "merge_images";

/**
 * Single operation to be applied in batch processing.
 * 
 * @property operation - Type of operation to perform
 * @property params - Parameters specific to the operation
 */
export interface BatchOperation {
  operation: OperationType;
  params: BrightnessParams | ContrastParams | ChannelParams | GrayscaleParams | BinarizeParams | NegativeParams | TranslateParams | RotateParams | CropParams | ReduceResolutionParams | EnlargeRegionParams | MergeParams;
}

/**
 * Parameters for batch processing endpoint.
 * All operations are applied to the root/original image to prevent cumulative degradation.
 * 
 * @property image_id - ID of any image in the processing chain (root will be found automatically)
 * @property operations - Array of operations to apply sequentially
 */
export interface BatchProcessingParams {
  image_id: string;
  operations: BatchOperation[];
}

/**
 * Response from batch processing endpoint containing the processed image metadata.
 * 
 * @property id - Unique identifier for the processed image
 * @property url - Direct URL to download the processed image
 * @property width - Width of the processed image in pixels
 * @property height - Height of the processed image in pixels
 * @property mime_type - Image MIME type (e.g., 'image/jpeg')
 * @property operations_applied - Complete list of operations that were applied
 * @property original_image_id - ID of the immediate source image
 * @property root_image_id - ID of the root/original image in the processing chain
 * @property created_at - ISO timestamp of when the processing completed
 */
export interface BatchProcessingResponse {
  id: string;
  url: string;
  width: number;
  height: number;
  mime_type: string;
  operations_applied: BatchOperation[];
  original_image_id: string;
  root_image_id: string;
  created_at: string;
}
