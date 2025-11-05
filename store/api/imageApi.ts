import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { createClient } from '@/lib/supabase/client';
import type {
  ImageMetadata,
  UploadImageResponse,
  DeleteImageResponse,
  ProcessingOperationResponse,
  BrightnessParams,
  ContrastParams,
  ChannelParams,
  GrayscaleParams,
  BinarizeParams,
  NegativeParams,
  TranslateParams,
  RotateParams,
  CropParams,
  ReduceResolutionParams,
  EnlargeRegionParams,
  MergeParams,
  ResetParams,
  HistogramData,
  DeleteHistoryResponse,
  BatchProcessingParams,
  BatchProcessingResponse,
} from '@/types';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  prepareHeaders: async (headers, { getState, endpoint }) => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (session?.access_token) {
      headers.set('Authorization', `Bearer ${session.access_token}`);
    }

    // Don't set content-type for uploadImage endpoint - let the browser set it with the boundary
    if (endpoint !== 'uploadImage' && !headers.get('content-type')) {
      headers.set('content-type', 'application/json');
    }

    return headers;
  },
});

export const imageApi = createApi({
  reducerPath: 'imageApi',
  baseQuery,
  tagTypes: ['Image', 'ImageList', 'History', 'User'],
  endpoints: (builder) => ({
    // Health Check
    healthCheck: builder.query<{ status: string; version: string }, void>({
      query: () => '/',
    }),



    // Image Upload - Returns UploadImageResponse according to API spec
    uploadImage: builder.mutation<UploadImageResponse, FormData>({
      query: (formData) => ({
        url: '/images/upload',
        method: 'POST',
        body: formData,
        formData: true,
      }),
      invalidatesTags: ['ImageList'],
    }),

    // Get User Images - Returns ListImagesResponse according to API spec
    getUserImages: builder.query<{
      images: ImageMetadata[];
      total: number;
      limit: number;
      offset: number;
    }, { limit?: number; offset?: number; sort?: string }>({
      query: ({ limit = 20, offset = 0, sort = 'created_at' } = {}) => 
        `/images?limit=${limit}&offset=${offset}&sort=${sort}`,
      providesTags: ['ImageList'],
    }),

    // Get Single Image
    getImage: builder.query<ImageMetadata, string>({
      query: (imageId) => `/images/${imageId}`,
      providesTags: (result, error, imageId) => [{ type: 'Image', id: imageId }],
    }),

    // Get Image File URL (for display)
    getImageUrl: builder.query<string, string>({
      queryFn: (imageId) => {
        const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/images/${imageId}/download`;
        return { data: url };
      },
    }),

    // Delete Image - Returns DeleteImageResponse according to API spec
    deleteImage: builder.mutation<DeleteImageResponse, string>({
      query: (imageId) => ({
        url: `/images/${imageId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['ImageList', 'History'],
    }),

    // Image Processing Operations - All return ProcessingOperationResponse
    batchProcessing: builder.mutation<BatchProcessingResponse, BatchProcessingParams>({
      query: (params) => ({
        url: '/processing/batch',
        method: 'POST',
        body: params,
      }),
      invalidatesTags: (result) => result ? ['ImageList', 'History', { type: 'Image', id: result.id }] : ['ImageList', 'History'],
    }),

    adjustBrightness: builder.mutation<ProcessingOperationResponse, BrightnessParams>({
      query: (params) => ({
        url: '/processing/brightness',
        method: 'POST',
        body: params,
      }),
      invalidatesTags: (result) => result ? ['ImageList', 'History', { type: 'Image', id: result.id }] : ['ImageList', 'History'],
    }),

    adjustContrast: builder.mutation<ProcessingOperationResponse, ContrastParams>({
      query: (params) => ({
        url: '/processing/contrast',
        method: 'POST',
        body: params,
      }),
      invalidatesTags: (result) => result ? ['ImageList', 'History', { type: 'Image', id: result.id }] : ['ImageList', 'History'],
    }),

    adjustChannel: builder.mutation<ProcessingOperationResponse, ChannelParams>({
      query: (params) => ({
        url: '/processing/channel',
        method: 'POST',
        body: params,
      }),
      invalidatesTags: (result) => result ? ['ImageList', 'History', { type: 'Image', id: result.id }] : ['ImageList', 'History'],
    }),

    convertToGrayscale: builder.mutation<ProcessingOperationResponse, GrayscaleParams>({
      query: (params) => ({
        url: '/processing/grayscale',
        method: 'POST',
        body: params,
      }),
      invalidatesTags: (result) => result ? ['ImageList', 'History', { type: 'Image', id: result.id }] : ['ImageList', 'History'],
    }),

    binarizeImage: builder.mutation<ProcessingOperationResponse, BinarizeParams>({
      query: (params) => ({
        url: '/processing/binarize',
        method: 'POST',
        body: params,
      }),
      invalidatesTags: (result) => result ? ['ImageList', 'History', { type: 'Image', id: result.id }] : ['ImageList', 'History'],
    }),

    applyNegative: builder.mutation<ProcessingOperationResponse, NegativeParams>({
      query: (params) => ({
        url: '/processing/negative',
        method: 'POST',
        body: params,
      }),
      invalidatesTags: (result) => result ? ['ImageList', 'History', { type: 'Image', id: result.id }] : ['ImageList', 'History'],
    }),

    translateImage: builder.mutation<ProcessingOperationResponse, TranslateParams>({
      query: (params) => ({
        url: '/processing/translate',
        method: 'POST',
        body: params,
      }),
      invalidatesTags: (result) => result ? ['ImageList', 'History', { type: 'Image', id: result.id }] : ['ImageList', 'History'],
    }),

    rotateImage: builder.mutation<ProcessingOperationResponse, RotateParams>({
      query: (params) => ({
        url: '/processing/rotate',
        method: 'POST',
        body: params,
      }),
      invalidatesTags: (result) => result ? ['ImageList', 'History', { type: 'Image', id: result.id }] : ['ImageList', 'History'],
    }),

    cropImage: builder.mutation<ProcessingOperationResponse, CropParams>({
      query: (params) => ({
        url: '/processing/crop',
        method: 'POST',
        body: params,
      }),
      invalidatesTags: (result) => result ? ['ImageList', 'History', { type: 'Image', id: result.id }] : ['ImageList', 'History'],
    }),

    reduceResolution: builder.mutation<ProcessingOperationResponse, ReduceResolutionParams>({
      query: (params) => ({
        url: '/processing/reduce-resolution',
        method: 'POST',
        body: params,
      }),
      invalidatesTags: (result) => result ? ['ImageList', 'History', { type: 'Image', id: result.id }] : ['ImageList', 'History'],
    }),

    enlargeRegion: builder.mutation<ProcessingOperationResponse, EnlargeRegionParams>({
      query: (params) => ({
        url: '/processing/enlarge-region',
        method: 'POST',
        body: params,
      }),
      invalidatesTags: (result) => result ? ['ImageList', 'History', { type: 'Image', id: result.id }] : ['ImageList', 'History'],
    }),

    mergeImages: builder.mutation<ProcessingOperationResponse, MergeParams>({
      query: (params) => ({
        url: '/processing/merge',
        method: 'POST',
        body: params,
      }),
      invalidatesTags: (result) => result ? ['ImageList', 'History', { type: 'Image', id: result.id }] : ['ImageList', 'History'],
    }),

    resetToOriginal: builder.mutation<ProcessingOperationResponse, ResetParams>({
      query: (params) => ({
        url: '/processing/reset',
        method: 'POST',
        body: params,
      }),
      invalidatesTags: (result) => result ? ['ImageList', 'History', { type: 'Image', id: result.id }] : ['ImageList', 'History'],
    }),

    // Get Histogram
    getHistogram: builder.query<HistogramData, string>({
      query: (imageId) => `/processing/${imageId}/histogram`,
      providesTags: (result, error, imageId) => [{ type: 'Image', id: imageId }],
    }),

    // Edit History
    getEditHistory: builder.query<{
      history: Array<{
        id: string;
        user_id: string;
        image_id: string;
        operation: string;
        image: ImageMetadata;
        params: Record<string, any>;
        created_at: string;
      }>;
      total?: number;
    }, { limit?: number; offset?: number; image_id?: string }>({
      query: ({ limit = 50, offset = 0, image_id } = {}) => {
        const params = new URLSearchParams({
          limit: limit.toString(),
          offset: offset.toString(),
        });
        if (image_id) params.append('image_id', image_id);
        return `/history?${params.toString()}`;
      },
      providesTags: ['History'],
    }),

    getImageHistory: builder.query<{
      history: Array<{
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
      }>;
      total: number;
    }, string>({
      query: (imageId) => `/history/${imageId}`,
      providesTags: (result, error, imageId) => [{ type: 'History', id: imageId }],
    }),

    deleteHistoryEntry: builder.mutation<DeleteHistoryResponse, string>({
      query: (historyId) => ({
        url: `/history/${historyId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['History'],
    }),
  }),
});

export const {
  useHealthCheckQuery,
  useUploadImageMutation,
  useGetUserImagesQuery,
  useGetImageQuery,
  useGetImageUrlQuery,
  useDeleteImageMutation,
  useBatchProcessingMutation,
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
  useResetToOriginalMutation,
  useGetHistogramQuery,
  useGetEditHistoryQuery,
  useGetImageHistoryQuery,
  useDeleteHistoryEntryMutation,
} = imageApi;