/**
 * Reusable debounce composable with request cancellation support
 * Provides debounced and throttled functions for optimal performance
 */

type CancellablePromise<T> = Promise<T> & {
  cancel: () => void;
};

export function useDebounce() {
  /**
   * Creates a debounced function that delays execution until after wait milliseconds
   * have passed since the last invocation. Supports request cancellation.
   *
   * @param fn - Function to debounce
   * @param wait - Milliseconds to wait
   * @returns Debounced function
   */
  function debounce<T extends (...args: any[]) => any>(
    fn: T,
    wait: number = 500
  ): ((...args: Parameters<T>) => CancellablePromise<ReturnType<T>>) & { cancel: () => void } {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let currentRequest: { cancel: () => void } | null = null;

    const debouncedFn = ((...args: Parameters<T>) => {
      return new Promise<ReturnType<T>>((resolve, reject) => {
        // Clear existing timeout
        if (timeoutId !== null) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }

        // Cancel previous request if it exists
        if (currentRequest) {
          currentRequest.cancel();
          currentRequest = null;
        }

        // Set new timeout
        timeoutId = setTimeout(async () => {
          timeoutId = null;

          try {
            // Create cancellable request wrapper
            let isCancelled = false;
            const cancel = () => {
              isCancelled = true;
            };

            currentRequest = { cancel };

            // Execute function
            const result = await fn(...args);

            // Check if cancelled before resolving
            if (isCancelled) {
              reject(new Error("Request was cancelled"));
              return;
            }

            currentRequest = null;
            resolve(result);
          } catch (error) {
            currentRequest = null;
            reject(error);
          }
        }, wait);

        // Make the promise cancellable
      }) as CancellablePromise<ReturnType<T>>;
    }) as ((...args: Parameters<T>) => CancellablePromise<ReturnType<T>>) & { cancel: () => void };

    // Add cancel method to debounced function
    debouncedFn.cancel = () => {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      if (currentRequest) {
        currentRequest.cancel();
        currentRequest = null;
      }
    };

    return debouncedFn;
  }

  /**
   * Creates a throttled function that limits execution to at most once per wait milliseconds.
   *
   * @param fn - Function to throttle
   * @param wait - Milliseconds to wait between executions
   * @returns Throttled function
   */
  function throttle<T extends (...args: any[]) => any>(
    fn: T,
    wait: number = 100
  ): ((...args: Parameters<T>) => void) & { cancel: () => void } {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let lastCallTime = 0;

    const throttledFn = ((...args: Parameters<T>) => {
      const now = Date.now();
      const timeSinceLastCall = now - lastCallTime;

      // If enough time has passed, execute immediately
      if (timeSinceLastCall >= wait) {
        lastCallTime = now;
        fn(...args);
        return;
      }

      // Otherwise, schedule execution
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        lastCallTime = Date.now();
        fn(...args);
        timeoutId = null;
      }, wait - timeSinceLastCall);
    }) as ((...args: Parameters<T>) => void) & { cancel: () => void };

    throttledFn.cancel = () => {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    };

    return throttledFn;
  }

  /**
   * Creates a debounced function with request cancellation support.
   * Specifically designed for async API calls.
   *
   * @param fn - Async function to debounce
   * @param wait - Milliseconds to wait
   * @returns Debounced function with cancellation support
   */
  function debounceAsync<T extends (...args: any[]) => Promise<any>>(
    fn: T,
    wait: number = 500
  ): ((...args: Parameters<T>) => CancellablePromise<ReturnType<T>>) & { cancel: () => void } {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let currentAbortController: AbortController | null = null;
    let currentPromise: CancellablePromise<ReturnType<T>> | null = null;

    const debouncedFn = ((...args: Parameters<T>) => {
      // Clear existing timeout
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }

      // Cancel previous request
      if (currentAbortController) {
        currentAbortController.abort();
        currentAbortController = null;
      }

      // Create new abort controller for this request
      const abortController = new AbortController();
      currentAbortController = abortController;

      // Create cancellable promise
      const promise = new Promise<ReturnType<T>>((resolve, reject) => {
        timeoutId = setTimeout(async () => {
          timeoutId = null;

          // Check if cancelled
          if (abortController.signal.aborted) {
            reject(new Error("Request was cancelled"));
            return;
          }

          try {
            // Check if request was cancelled before executing
            if (abortController.signal.aborted) {
              reject(new Error("Request was cancelled"));
              return;
            }

            // Execute function with abort signal
            const result = await fn(...args);

            // Check again after execution
            if (abortController.signal.aborted) {
              reject(new Error("Request was cancelled"));
              return;
            }

            // Only resolve if this is still the current request
            if (currentAbortController === abortController) {
              currentAbortController = null;
              resolve(result);
            } else {
              reject(new Error("Request was cancelled"));
            }
          } catch (error: any) {
            // Don't reject if request was cancelled
            if (error.name === "AbortError" || abortController.signal.aborted) {
              reject(new Error("Request was cancelled"));
              return;
            }

            // Only reject if this is still the current request
            if (currentAbortController === abortController) {
              currentAbortController = null;
              reject(error);
            } else {
              reject(new Error("Request was cancelled"));
            }
          }
        }, wait);
      }) as CancellablePromise<ReturnType<T>>;

      // Add cancel method to promise
      promise.cancel = () => {
        abortController.abort();
        if (timeoutId !== null) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
        if (currentAbortController === abortController) {
          currentAbortController = null;
        }
      };

      currentPromise = promise;
      return promise;
    }) as ((...args: Parameters<T>) => CancellablePromise<ReturnType<T>>) & { cancel: () => void };

    // Add cancel method to debounced function
    debouncedFn.cancel = () => {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      if (currentAbortController) {
        currentAbortController.abort();
        currentAbortController = null;
      }
      if (currentPromise) {
        currentPromise.cancel();
        currentPromise = null;
      }
    };

    return debouncedFn;
  }

  return {
    debounce,
    throttle,
    debounceAsync,
  };
}

