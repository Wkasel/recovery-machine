"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTransition } from "react";
import { ZodSchema } from "zod";

interface UseZodFormOptions<T extends ZodSchema> {
  schema: T;
  action: (formData: FormData) => Promise<any>;
  formOptions?: {
    defaultValues?: Record<string, any>;
  };
  options?: {
    onSuccess?: (data: any) => void;
    onError?: (error: Error) => void;
  };
}

export function useZodForm<T extends ZodSchema>({
  schema,
  action,
  formOptions,
  options,
}: UseZodFormOptions<T>) {
  const [isPending, startTransition] = useTransition();
  
  const form = useForm({
    resolver: zodResolver(schema),
    ...formOptions,
  });

  const handleAction = (formData: FormData) => {
    startTransition(async () => {
      try {
        const result = await action(formData);
        options?.onSuccess?.(result);
      } catch (error) {
        options?.onError?.(error as Error);
        console.error("Form action error:", error);
      }
    });
  };

  return {
    ...form,
    handleAction,
    isLoading: isPending,
  };
}