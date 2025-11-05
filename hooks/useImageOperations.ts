import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/types';
import { 
  setCurrentImage, 
  setProcessing, 
  setCurrentOperation,
  addOperation,
  setError,
  clearError,
} from '@/store/slices/imageSlice';
import {
  useUploadImageMutation,
  useBatchProcessingMutation,
} from '@/store/api/imageApi';
import type { BatchOperation } from '@/types';
import { toast } from 'sonner';

/**
 * Custom hook for managing image processing operations.
 * All processing operations now use the batch processing endpoint to ensure
 * operations are applied to the root/original image, preventing cumulative degradation.
 * 
 * @returns Object containing image state and operation handlers
 * 
 * @example
 * ```typescript
 * const {
 *   currentImageId,
 *   isProcessing,
 *   handleBrightness,
 *   handleBatchOperations
 * } = useImageOperations();
 * 
 * await handleBrightness(imageId, 1.2);
 * 
 * await handleBatchOperations(imageId, [
 *   { operation: 'brightness', params: { factor: 1.2 } },
 *   { operation: 'log_contrast', params: { k: 1.5 } }
 * ]);
 * ```
 */
export const useImageOperations = () => {
  const dispatch = useDispatch();
  const image = useSelector((state: RootState) => state.image);
  
  const [uploadImage] = useUploadImageMutation();
  const [batchProcessing] = useBatchProcessingMutation();

  /**
   * Executes a processing operation with error handling and state management.
   * Handles loading states, success/error notifications, and Redux state updates.
   * 
   * @param operation - Async function that performs the API call
   * @param operationType - Human-readable name of the operation
   * @param params - Operation parameters for tracking
   */
  const executeOperation = async (
    operation: () => Promise<any>,
    operationType: string,
    params: any
  ) => {
    try {
      dispatch(setProcessing(true));
      dispatch(setCurrentOperation(operationType));
      dispatch(clearError());

      const result = await operation();
      
      if (result.data) {
        dispatch(setCurrentImage(result.data.id));
        dispatch(addOperation({
          id: result.data.id,
          user_id: result.data.user_id || '',
          image_id: params.image_id || params.image1_id,
          operation: operationType,
          params: params,
          created_at: result.data.created_at,
        }));
        toast.success(`${operationType} applied successfully`);
      }

      return result;
    } catch (error: any) {
      const errorMessage = error?.data?.detail || `Failed to apply ${operationType}`;
      dispatch(setError(errorMessage));
      toast.error(errorMessage);
      throw error;
    } finally {
      dispatch(setProcessing(false));
      dispatch(setCurrentOperation(null));
    }
  };

  /**
   * Executes a batch of operations using the unified batch processing endpoint.
   * All operations are applied to the root/original image to prevent cumulative degradation.
   * 
   * @param imageId - ID of the image to process (root will be found automatically)
   * @param operations - Array of operations to apply sequentially
   * @param operationName - Display name for the batch operation
   */
  const executeBatchOperation = async (
    imageId: string,
    operations: BatchOperation[],
    operationName: string
  ) => {
    return executeOperation(
      () => batchProcessing({ image_id: imageId, operations }),
      operationName,
      { image_id: imageId, operations }
    );
  };

  /**
   * Uploads an image file to the server.
   * 
   * @param file - Image file to upload (JPG, PNG, or BMP, max 10MB)
   * @returns Promise resolving to upload response
   */
  const handleUploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return executeOperation(
      () => uploadImage(formData),
      'upload',
      { filename: file.name }
    );
  };

  /**
   * Adjusts image brightness using the batch processing endpoint.
   * 
   * @param imageId - ID of the image to process
   * @param factor - Brightness multiplier (>1.0 = brighter, <1.0 = darker)
   */
  const handleBrightness = (imageId: string, factor: number) =>
    executeBatchOperation(
      imageId,
      [{ operation: 'brightness', params: { factor } }],
      'brightness'
    );

  /**
   * Adjusts image contrast using logarithmic or exponential methods.
   * 
   * @param imageId - ID of the image to process
   * @param type - Contrast type ('logarithmic' compresses, 'exponential' expands)
   * @param intensity - Contrast intensity factor
   */
  const handleContrast = (imageId: string, type: 'logarithmic' | 'exponential', intensity: number) =>
    executeBatchOperation(
      imageId,
      [{ operation: type === 'logarithmic' ? 'log_contrast' : 'exp_contrast', params: { k: intensity } }],
      'contrast'
    );

  /**
   * Enables or disables a specific color channel (RGB or CMY).
   * 
   * @param imageId - ID of the image to process
   * @param channel - Channel name ('red', 'green', 'blue', 'cyan', 'magenta', 'yellow')
   * @param enabled - Whether to enable (true) or disable (false) the channel
   */
  const handleChannel = (imageId: string, channel: string, enabled: boolean) => {
    const channelMap: Record<string, string> = {
      'red': 'channel_red',
      'green': 'channel_green',
      'blue': 'channel_blue',
      'cyan': 'channel_cyan',
      'magenta': 'channel_magenta',
      'yellow': 'channel_yellow',
    };
    
    const operation = channelMap[channel] as any;
    return executeBatchOperation(
      imageId,
      [{ operation, params: { enabled } }],
      `channel_${channel}`
    );
  };

  /**
   * Converts image to grayscale using specified method.
   * 
   * @param imageId - ID of the image to process
   * @param method - Conversion method ('average', 'luminosity', or 'midgray')
   */
  const handleGrayscale = (imageId: string, method: 'average' | 'luminosity' | 'midgray') =>
    executeBatchOperation(
      imageId,
      [{ operation: `grayscale_${method}` as any, params: {} }],
      'grayscale'
    );

  /**
   * Converts image to pure black and white based on threshold.
   * 
   * @param imageId - ID of the image to process
   * @param threshold - Threshold value (0.0 to 1.0)
   */
  const handleBinarize = (imageId: string, threshold: number) =>
    executeBatchOperation(
      imageId,
      [{ operation: 'binarize', params: { threshold } }],
      'binarize'
    );

  /**
   * Applies negative/invert filter to the image.
   * 
   * @param imageId - ID of the image to process
   */
  const handleNegative = (imageId: string) =>
    executeBatchOperation(
      imageId,
      [{ operation: 'invert', params: {} }],
      'negative'
    );

  /**
   * Translates (moves) the image by specified offsets.
   * 
   * @param imageId - ID of the image to process
   * @param dx - Horizontal offset in pixels (positive = right, negative = left)
   * @param dy - Vertical offset in pixels (positive = down, negative = up)
   */
  const handleTranslate = (imageId: string, dx: number, dy: number) =>
    executeBatchOperation(
      imageId,
      [{ operation: 'translate', params: { dx, dy } }],
      'translate'
    );

  /**
   * Rotates the image by specified angle.
   * 
   * @param imageId - ID of the image to process
   * @param angle - Rotation angle in degrees (positive = counter-clockwise)
   */
  const handleRotate = (imageId: string, angle: number) =>
    executeBatchOperation(
      imageId,
      [{ operation: 'rotate', params: { angle } }],
      'rotate'
    );

  /**
   * Crops the image to specified rectangular region.
   * 
   * @param imageId - ID of the image to process
   * @param x_start - Left boundary (0-indexed)
   * @param x_end - Right boundary (exclusive)
   * @param y_start - Top boundary (0-indexed)
   * @param y_end - Bottom boundary (exclusive)
   */
  const handleCrop = (imageId: string, x_start: number, x_end: number, y_start: number, y_end: number) =>
    executeBatchOperation(
      imageId,
      [{ operation: 'crop', params: { x_start, x_end, y_start, y_end } }],
      'crop'
    );

  /**
   * Reduces image resolution by specified factor.
   * 
   * @param imageId - ID of the image to process
   * @param factor - Reduction factor (2 = half size, 3 = one-third, etc.)
   */
  const handleReduceResolution = (imageId: string, factor: number) =>
    executeBatchOperation(
      imageId,
      [{ operation: 'reduce_resolution', params: { factor } }],
      'reduce_resolution'
    );

  /**
   * Extracts and enlarges a specific region of the image.
   * 
   * @param imageId - ID of the image to process
   * @param x_start - Left boundary of region
   * @param x_end - Right boundary of region
   * @param y_start - Top boundary of region
   * @param y_end - Bottom boundary of region
   * @param zoom_factor - Zoom multiplier (1-10)
   */
  const handleEnlargeRegion = (imageId: string, x_start: number, x_end: number, y_start: number, y_end: number, zoom_factor: number) =>
    executeBatchOperation(
      imageId,
      [{ operation: 'enlarge_region', params: { x_start, x_end, y_start, y_end, factor: zoom_factor } }],
      'enlarge_region'
    );

  /**
   * Merges two images together with specified transparency.
   * 
   * @param image1Id - ID of the first (base) image
   * @param image2Id - ID of the second image to blend
   * @param transparency - Blend factor (0.0 = only first image, 1.0 = second dominates)
   */
  const handleMergeImages = (image1Id: string, image2Id: string, transparency: number) =>
    executeBatchOperation(
      image1Id,
      [{ operation: 'merge_images', params: { other_image_id: image2Id, transparency } }],
      'merge'
    );

  /**
   * Executes multiple operations in a single batch request.
   * All operations are applied to the root/original image sequentially.
   * This is the recommended approach for applying multiple transformations.
   * 
   * @param imageId - ID of the image to process
   * @param operations - Array of operations to apply
   * 
   * @example
   * ```typescript
   * await handleBatchOperations(imageId, [
   *   { operation: 'brightness', params: { factor: 1.2 } },
   *   { operation: 'log_contrast', params: { k: 1.5 } },
   *   { operation: 'grayscale_luminosity', params: {} }
   * ]);
   * ```
   */
  const handleBatchOperations = (imageId: string, operations: BatchOperation[]) =>
    executeBatchOperation(
      imageId,
      operations,
      'batch_process'
    );

  return {
    ...image,
    handleUploadImage,
    handleBrightness,
    handleContrast,
    handleChannel,
    handleGrayscale,
    handleBinarize,
    handleNegative,
    handleTranslate,
    handleRotate,
    handleCrop,
    handleReduceResolution,
    handleEnlargeRegion,
    handleMergeImages,
    handleBatchOperations,
  };
};