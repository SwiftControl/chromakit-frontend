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
  useAdjustBrightnessMutation,
  useAdjustContrastMutation,
  useAdjustChannelMutation,
  useConvertToGrayscaleMutation,
  useBinarizeImageMutation,
  useApplyNegativeMutation,
  useTranslateImageMutation,
  useRotateImageMutation,
  useCropImageMutation,
  useReduceResolutionMutation,
  useEnlargeRegionMutation,
  useMergeImagesMutation,
} from '@/store/api/imageApi';
import { toast } from 'sonner';

export const useImageOperations = () => {
  const dispatch = useDispatch();
  const image = useSelector((state: RootState) => state.image);
  
  // Mutations
  const [uploadImage] = useUploadImageMutation();
  const [adjustBrightness] = useAdjustBrightnessMutation();
  const [adjustContrast] = useAdjustContrastMutation();
  const [adjustChannel] = useAdjustChannelMutation();
  const [convertToGrayscale] = useConvertToGrayscaleMutation();
  const [binarizeImage] = useBinarizeImageMutation();
  const [applyNegative] = useApplyNegativeMutation();
  const [translateImage] = useTranslateImageMutation();
  const [rotateImage] = useRotateImageMutation();
  const [cropImage] = useCropImageMutation();
  const [reduceResolution] = useReduceResolutionMutation();
  const [enlargeRegion] = useEnlargeRegionMutation();
  const [mergeImages] = useMergeImagesMutation();

  // Helper function to handle operations
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
          image_id: params.image_id || params.image1_id,
          operation_type: operationType,
          parameters: params,
          result_storage_path: result.data.storage_path,
          created_at: result.data.created_at,
          original_image: {
            id: params.image_id || params.image1_id,
            original_filename: result.data.original_filename,
          },
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

  // Upload operation
  const handleUploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return executeOperation(
      () => uploadImage(formData),
      'upload',
      { filename: file.name }
    );
  };

  // Processing operations
  const handleBrightness = (imageId: string, factor: number) =>
    executeOperation(
      () => adjustBrightness({ image_id: imageId, factor }),
      'brightness',
      { image_id: imageId, factor }
    );

  const handleContrast = (imageId: string, type: 'logarithmic' | 'exponential', intensity: number) =>
    executeOperation(
      () => adjustContrast({ image_id: imageId, type, intensity }),
      'contrast',
      { image_id: imageId, type, intensity }
    );

  const handleChannel = (imageId: string, channel: string, enabled: boolean) =>
    executeOperation(
      () => adjustChannel({ image_id: imageId, channel: channel as any, enabled }),
      'channel',
      { image_id: imageId, channel, enabled }
    );

  const handleGrayscale = (imageId: string, method: 'average' | 'luminosity' | 'midgray') =>
    executeOperation(
      () => convertToGrayscale({ image_id: imageId, method }),
      'grayscale',
      { image_id: imageId, method }
    );

  const handleBinarize = (imageId: string, threshold: number) =>
    executeOperation(
      () => binarizeImage({ image_id: imageId, threshold }),
      'binarize',
      { image_id: imageId, threshold }
    );

  const handleNegative = (imageId: string) =>
    executeOperation(
      () => applyNegative({ image_id: imageId }),
      'negative',
      { image_id: imageId }
    );

  const handleTranslate = (imageId: string, dx: number, dy: number) =>
    executeOperation(
      () => translateImage({ image_id: imageId, dx, dy }),
      'translate',
      { image_id: imageId, dx, dy }
    );

  const handleRotate = (imageId: string, angle: number) =>
    executeOperation(
      () => rotateImage({ image_id: imageId, angle }),
      'rotate',
      { image_id: imageId, angle }
    );

  const handleCrop = (imageId: string, x_start: number, x_end: number, y_start: number, y_end: number) =>
    executeOperation(
      () => cropImage({ image_id: imageId, x_start, x_end, y_start, y_end }),
      'crop',
      { image_id: imageId, x_start, x_end, y_start, y_end }
    );

  const handleReduceResolution = (imageId: string, factor: number) =>
    executeOperation(
      () => reduceResolution({ image_id: imageId, factor }),
      'reduce_resolution',
      { image_id: imageId, factor }
    );

  const handleEnlargeRegion = (imageId: string, x_start: number, x_end: number, y_start: number, y_end: number, zoom_factor: number) =>
    executeOperation(
      () => enlargeRegion({ image_id: imageId, x_start, x_end, y_start, y_end, zoom_factor }),
      'enlarge_region',
      { image_id: imageId, x_start, x_end, y_start, y_end, zoom_factor }
    );

  const handleMergeImages = (image1Id: string, image2Id: string, transparency: number) =>
    executeOperation(
      () => mergeImages({ image1_id: image1Id, image2_id: image2Id, transparency }),
      'merge',
      { image1_id: image1Id, image2_id: image2Id, transparency }
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
  };
};