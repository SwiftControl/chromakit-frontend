import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ImageState, HistoryItem } from '@/types';

const initialState: ImageState = {
  currentImageId: null,
  originalImageId: null,
  processingHistory: [],
  isProcessing: false,
  currentOperation: null,
  uploadProgress: 0,
  error: null,
};

const imageSlice = createSlice({
  name: 'image',
  initialState,
  reducers: {
    setCurrentImage: (state, action: PayloadAction<string>) => {
      state.currentImageId = action.payload;
      if (!state.originalImageId) {
        state.originalImageId = action.payload;
      }
    },
    setOriginalImage: (state, action: PayloadAction<string>) => {
      state.originalImageId = action.payload;
    },
    setProcessing: (state, action: PayloadAction<boolean>) => {
      state.isProcessing = action.payload;
    },
    setCurrentOperation: (state, action: PayloadAction<string | null>) => {
      state.currentOperation = action.payload;
    },
    addOperation: (state, action: PayloadAction<HistoryItem>) => {
      state.processingHistory.push(action.payload);
    },
    clearHistory: (state) => {
      state.processingHistory = [];
    },
    setUploadProgress: (state, action: PayloadAction<number>) => {
      state.uploadProgress = action.payload;
    },
    resetToOriginal: (state) => {
      if (state.originalImageId) {
        state.currentImageId = state.originalImageId;
      }
    },
    clearImage: (state) => {
      state.currentImageId = null;
      state.originalImageId = null;
      state.processingHistory = [];
      state.uploadProgress = 0;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isProcessing = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setCurrentImage,
  setOriginalImage,
  setProcessing,
  setCurrentOperation,
  addOperation,
  clearHistory,
  setUploadProgress,
  resetToOriginal,
  clearImage,
  setError,
  clearError,
} = imageSlice.actions;

export default imageSlice.reducer;