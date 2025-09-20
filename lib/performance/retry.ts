/**
 * Retry Logic for Failed Requests
 */

export interface RetryOptions {
  maxAttempts?: number;
  baseDelay?: number;
  maxDelay?: number;
  backoffMultiplier?: number;
  retryCondition?: (error: any) => boolean;
  onRetry?: (attempt: number, error: any) => void;
}

const defaultOptions: Required<RetryOptions> = {
  maxAttempts: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  backoffMultiplier: 2,
  retryCondition: (error) => {
    // Retry on network errors and 5xx status codes
    if (error?.code === "NETWORK_ERROR") return true;
    if (error?.status >= 500 && error?.status < 600) return true;
    if (error?.name === "TimeoutError") return true;
    return false;
  },
  onRetry: () => {},
};

export async function withRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const config = { ...defaultOptions, ...options };
  let lastError: any;

  for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      // Don't retry if this is the last attempt
      if (attempt === config.maxAttempts) {
        break;
      }

      // Don't retry if the condition doesn't match
      if (!config.retryCondition(error)) {
        break;
      }

      // Calculate delay with exponential backoff
      const delay = Math.min(
        config.baseDelay * Math.pow(config.backoffMultiplier, attempt - 1),
        config.maxDelay
      );

      config.onRetry(attempt, error);

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

export function createRetryWrapper<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  options: RetryOptions = {}
) {
  return async (...args: T) => withRetry(async () => fn(...args), options);
}

// Payment-specific retry logic
export const retryPaymentRequest = createRetryWrapper(
  async (request: () => Promise<any>) => request(),
  {
    maxAttempts: 2, // Only retry once for payments to avoid duplicate charges
    baseDelay: 2000,
    retryCondition: (error) => {
      // Only retry on network errors or server errors, not client errors
      if (error?.status >= 400 && error?.status < 500) return false;
      return defaultOptions.retryCondition(error);
    },
    onRetry: (attempt, error) => {
      console.warn(`Payment request failed, retrying (attempt ${attempt}):`, error);
    },
  }
);

// Database operation retry logic
export const retryDatabaseOperation = createRetryWrapper(
  async (operation: () => Promise<any>) => operation(),
  {
    maxAttempts: 3,
    baseDelay: 500,
    retryCondition: (error) => {
      // Retry on connection errors and timeouts
      if (error?.code === "PGRST001") return true; // PostgREST connection error
      if (error?.message?.includes("timeout")) return true;
      if (error?.message?.includes("connection")) return true;
      return false;
    },
    onRetry: (attempt, error) => {
      console.warn(`Database operation failed, retrying (attempt ${attempt}):`, error);
    },
  }
);
