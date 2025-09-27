import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import type { z } from "zod";

type AuthActionResult = {
  success?: boolean;
  error?: string;
  data?: any;
};

type AuthAction = (formData: FormData) => Promise<AuthActionResult | void>;

export interface UseAuthFormOptions<T extends z.ZodSchema> {
  schema: T;
  action: AuthAction;
  successRedirect?: string;
  onSuccess?: (data: z.infer<T>) => void;
  onError?: (error: string) => void;
}

export function useAuthForm<T extends z.ZodSchema>({
  schema,
  action,
  successRedirect,
  onSuccess,
  onError,
}: UseAuthFormOptions<T>) {
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  // Handle URL errors (e.g., from redirects)
  useState(() => {
    const urlError = searchParams.get("error");
    if (urlError === "callback_failed") {
      setSubmitError("Authentication failed. Please try again.");
    }
  });

  const handleSubmit = async (data: z.infer<T>) => {
    setIsLoading(true);
    setSubmitError(null);

    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (typeof value === "boolean") {
          formData.append(key, value.toString());
        } else if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      const result = await action(formData);
      
      if (result && 'error' in result && result.error) {
        throw new Error(result.error);
      }

      onSuccess?.(data);
      
      if (successRedirect) {
        router.push(successRedirect);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      setSubmitError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    submitError,
    handleSubmit: form.handleSubmit(handleSubmit),
    setSubmitError,
  };
}

// Rate limiting hook
export function useRateLimit(maxAttempts: number = 3, windowMs: number = 15 * 60 * 1000) {
  const [attempts, setAttempts] = useState<number[]>([]);

  const isRateLimited = () => {
    const now = Date.now();
    const recentAttempts = attempts.filter(time => now - time < windowMs);
    return recentAttempts.length >= maxAttempts;
  };

  const addAttempt = () => {
    const now = Date.now();
    setAttempts(prev => [...prev.filter(time => now - time < windowMs), now]);
  };

  const getRemainingTime = () => {
    if (!isRateLimited()) return 0;
    const oldestRecentAttempt = Math.min(...attempts.filter(time => Date.now() - time < windowMs));
    return Math.ceil((oldestRecentAttempt + windowMs - Date.now()) / 1000);
  };

  return {
    isRateLimited: isRateLimited(),
    addAttempt,
    remainingTime: getRemainingTime(),
  };
}