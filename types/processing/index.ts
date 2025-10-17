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
  image_id: string;
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
