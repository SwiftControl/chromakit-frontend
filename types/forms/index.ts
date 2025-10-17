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
