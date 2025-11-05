import { useState, useCallback, useRef, useEffect } from 'react';
import { useImageOperations } from './useImageOperations';
import type { BatchOperation } from '@/types';

/**
 * Options for configuring batch operations behavior.
 * 
 * @property debounceMs - Delay in milliseconds before executing operations (default: 300)
 * @property autoExecute - Whether to automatically execute operations after debounce (default: true)
 */
interface UseBatchOperationsOptions {
  debounceMs?: number;
  autoExecute?: boolean;
}

/**
 * Advanced hook for accumulating and batch-processing multiple image operations.
 * Automatically debounces operations and executes them in a single API call.
 * Ideal for real-time UI controls that generate many rapid changes.
 * 
 * Features:
 * - Debounced execution to prevent API spam
 * - Operation deduplication (replaces duplicate operations)
 * - Automatic or manual execution modes
 * - Type-safe operation builders
 * 
 * @param imageId - ID of the image to process
 * @param options - Configuration options
 * 
 * @returns Object with operation builders and control methods
 * 
 * @example
 * ```typescript
 * const {
 *   addBrightness,
 *   addLogContrast,
 *   pendingOperations,
 *   executeOperations
 * } = useBatchOperations(imageId, { debounceMs: 500 });
 * 
 * addBrightness(1.2);
 * addLogContrast(1.5);
 * 
 * ```
 */
export const useBatchOperations = (
  imageId: string | null,
  options: UseBatchOperationsOptions = {}
) => {
  const { debounceMs = 300, autoExecute = true } = options;
  const { handleBatchOperations, isProcessing } = useImageOperations();
  
  const [pendingOperations, setPendingOperations] = useState<BatchOperation[]>([]);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isExecutingRef = useRef(false);

  /**
   * Adds an operation to the pending queue.
   * Automatically deduplicates operations of the same type.
   * 
   * @param operation - Operation to add to the queue
   */
  const addOperation = useCallback((operation: BatchOperation) => {
    setPendingOperations((prev) => {
      const operationName = operation.operation;
      const existingIndex = prev.findIndex(op => {
        if (operationName.startsWith('channel_') && op.operation.startsWith('channel_')) {
          return op.operation === operationName;
        }
        if (operationName.startsWith('grayscale_') && op.operation.startsWith('grayscale_')) {
          return true;
        }
        return op.operation === operationName;
      });

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = operation;
        return updated;
      }
      
      return [...prev, operation];
    });
  }, []);

  /**
   * Clears all pending operations and cancels any scheduled execution.
   */
  const clearOperations = useCallback(() => {
    setPendingOperations([]);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
  }, []);

  /**
   * Immediately executes all pending operations.
   * Can be called manually when autoExecute is false.
   */
  const executeOperations = useCallback(async () => {
    if (!imageId || pendingOperations.length === 0 || isExecutingRef.current) {
      return;
    }

    isExecutingRef.current = true;
    
    try {
      await handleBatchOperations(imageId, pendingOperations);
      setPendingOperations([]);
    } catch (error) {
      console.error('Batch operations failed:', error);
    } finally {
      isExecutingRef.current = false;
    }
  }, [imageId, pendingOperations, handleBatchOperations]);

  useEffect(() => {
    if (!autoExecute || pendingOperations.length === 0) {
      return;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      executeOperations();
    }, debounceMs);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [pendingOperations, autoExecute, debounceMs, executeOperations]);

  const addBrightness = useCallback((factor: number) => {
    addOperation({ operation: 'brightness', params: { factor } });
  }, [addOperation]);

  const addLogContrast = useCallback((k: number) => {
    addOperation({ operation: 'log_contrast', params: { k } });
  }, [addOperation]);

  const addExpContrast = useCallback((k: number) => {
    addOperation({ operation: 'exp_contrast', params: { k } });
  }, [addOperation]);

  const addChannel = useCallback((channel: 'red' | 'green' | 'blue' | 'cyan' | 'magenta' | 'yellow', enabled: boolean) => {
    const operation = `channel_${channel}` as BatchOperation['operation'];
    addOperation({ operation, params: { enabled } } as BatchOperation);
  }, [addOperation]);

  const addGrayscale = useCallback((method: 'average' | 'luminosity' | 'midgray') => {
    const operation = `grayscale_${method}` as BatchOperation['operation'];
    addOperation({ operation, params: {} } as BatchOperation);
  }, [addOperation]);

  const addBinarize = useCallback((threshold: number) => {
    addOperation({ operation: 'binarize', params: { threshold } });
  }, [addOperation]);

  const addInvert = useCallback(() => {
    addOperation({ operation: 'invert', params: {} });
  }, [addOperation]);

  const addRotate = useCallback((angle: number) => {
    addOperation({ operation: 'rotate', params: { angle } });
  }, [addOperation]);

  const addTranslate = useCallback((dx: number, dy: number) => {
    addOperation({ operation: 'translate', params: { dx, dy } });
  }, [addOperation]);

  const addCrop = useCallback((x_start: number, x_end: number, y_start: number, y_end: number) => {
    addOperation({ operation: 'crop', params: { x_start, x_end, y_start, y_end } });
  }, [addOperation]);

  const addReduceResolution = useCallback((factor: number) => {
    addOperation({ operation: 'reduce_resolution', params: { factor } });
  }, [addOperation]);

  const addEnlargeRegion = useCallback((x_start: number, x_end: number, y_start: number, y_end: number, factor: number) => {
    addOperation({ operation: 'enlarge_region', params: { x_start, x_end, y_start, y_end, factor } });
  }, [addOperation]);

  const addMergeImages = useCallback((other_image_id: string, transparency: number) => {
    addOperation({ operation: 'merge_images', params: { other_image_id, transparency } });
  }, [addOperation]);

  return {
    pendingOperations,
    isProcessing,
    addOperation,
    clearOperations,
    executeOperations,
    addBrightness,
    addLogContrast,
    addExpContrast,
    addChannel,
    addGrayscale,
    addBinarize,
    addInvert,
    addRotate,
    addTranslate,
    addCrop,
    addReduceResolution,
    addEnlargeRegion,
    addMergeImages,
  };
};
