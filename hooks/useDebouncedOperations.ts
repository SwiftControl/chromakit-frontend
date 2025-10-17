import { useRef, useEffect, useCallback } from 'react'

interface DebouncedOperationsConfig {
  /**
   * Returns the debounce delay for a specific operation
   */
  getDelay: (operation: string) => number
  /**
   * Checks if an operation is currently processing
   */
  isProcessing: boolean
}

/**
 * Hook for managing debounced operations with de-duplication
 * Each operation type has its own queue and debounce timer
 * @param config - Configuration for debounce delays and processing state
 * @returns Object with methods to execute and schedule operations
 */
export function useDebouncedOperations<TOperation extends string, TParams extends Record<string, any>>(
  config: DebouncedOperationsConfig
) {
  const debounceTimers = useRef<Record<string, ReturnType<typeof setTimeout> | null>>({})
  const pendingByOp = useRef<Record<string, TParams | null>>({})
  const lastExecutedKey = useRef<Record<string, string | null>>({})
  const executorRef = useRef<((operation: TOperation, params: TParams) => Promise<void>) | null>(null)

  /**
   * Creates a stable stringified representation of an object for comparison
   */
  const stableStringify = useCallback((obj: any): string => {
    if (obj === null || typeof obj !== 'object') return JSON.stringify(obj)
    const keys = Object.keys(obj).sort()
    const sorted: Record<string, any> = {}
    for (const k of keys) sorted[k] = obj[k]
    return JSON.stringify(sorted)
  }, [])

  /**
   * Generates a unique key for an operation and its parameters
   */
  const paramKey = useCallback(
    (operation: string, params: TParams) => `${operation}:${stableStringify(params)}`,
    [stableStringify]
  )

  /**
   * Checks if an operation can start and executes it if conditions are met
   * Handles de-duplication by comparing with last executed parameters
   */
  const maybeStartOperation = useCallback(
    (operation: TOperation) => {
      if (config.isProcessing || !executorRef.current) return
      
      const nextParams = pendingByOp.current[operation]
      if (!nextParams) return
      
      pendingByOp.current[operation] = null

      const nextKey = paramKey(operation, nextParams)
      if (lastExecutedKey.current[operation] === nextKey) return

      void executorRef.current(operation, nextParams)
    },
    [config.isProcessing, paramKey]
  )

  /**
   * Handles operation completion and processes any pending operations
   */
  const onOperationComplete = useCallback(
    (operation: TOperation, params: TParams) => {
      lastExecutedKey.current[operation] = paramKey(operation, params)
      
      if (pendingByOp.current[operation]) {
        setTimeout(() => maybeStartOperation(operation), 0)
      }
    },
    [paramKey, maybeStartOperation]
  )

  /**
   * Schedules an operation with debouncing and de-duplication
   */
  const scheduleOperation = useCallback(
    (operation: TOperation, params: TParams) => {
      const delay = config.getDelay(operation)

      const existing = pendingByOp.current[operation]
      if (existing && stableStringify(existing) === stableStringify(params)) {
        return
      }
      
      pendingByOp.current[operation] = params

      if (debounceTimers.current[operation]) {
        clearTimeout(debounceTimers.current[operation]!)
      }

      if (delay > 0) {
        debounceTimers.current[operation] = setTimeout(() => {
          debounceTimers.current[operation] = null
          maybeStartOperation(operation)
        }, delay)
      } else {
        maybeStartOperation(operation)
      }
    },
    [config, stableStringify, maybeStartOperation]
  )

  /**
   * Sets the executor function that will be called to process operations
   */
  const setExecutor = useCallback((executor: (operation: TOperation, params: TParams) => Promise<void>) => {
    executorRef.current = executor
  }, [])

  /**
   * Cleanup effect to clear all debounce timers on unmount
   */
  useEffect(() => {
    return () => {
      Object.values(debounceTimers.current).forEach((t) => t && clearTimeout(t))
    }
  }, [])

  return {
    scheduleOperation,
    setExecutor,
    onOperationComplete,
  }
}
