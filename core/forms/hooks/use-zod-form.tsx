"use client";

import { AppError } from "@/core/errors/base/AppError";
import { Logger } from "@/lib/logger/Logger";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useTransition, useState } from "react";
import { FieldValues, SubmitHandler, useForm, UseFormProps, Path, PathValue } from "react-hook-form";
import { ZodSchema } from "zod";
import { toast } from "sonner";
import { Event } from "@/lib/types/analytics";
import { FormSkeleton } from "@/lib/ui/loading/skeletons";
import type { FC } from "react";

export interface FormPersistOptions {
  /**
   * Storage to use for persistence
   * @default localStorage
   */
  storage?: Storage;
  /**
   * Fields to exclude from persistence
   */
  exclude?: string[];
  /**
   * Callback when data is restored from storage
   */
  onDataRestored?: (data: any) => void;
  /**
   * Whether to validate restored data
   * @default true
   */
  validate?: boolean;
  /**
   * Whether to mark restored fields as dirty
   * @default false
   */
  dirty?: boolean;
  /**
   * Whether to mark restored fields as touched
   * @default false
   */
  touch?: boolean;
  /**
   * Timeout in milliseconds after which stored data is considered stale
   */
  timeout?: number;
  /**
   * Callback when stored data is considered stale
   */
  onTimeout?: () => void;
}

export interface FormActionOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  analyticsEventName?: Event["name"];
  toastMessages?: {
    success?: string;
    error?: string;
  };
  formId?: string;
  loadingFields?: number;
  /**
   * Whether to persist form state in localStorage
   * Useful for long forms where users might navigate away
   */
  persistState?: boolean;
  /**
   * Custom key for localStorage
   * Defaults to formId if not provided
   */
  persistKey?: string;
  /**
   * Whether to show the loading skeleton while the form is submitting
   * @default false - Form will stay visible with disabled inputs while submitting
   */
  showLoadingSkeleton?: boolean;
  /**
   * Form persistence options
   */
  persist?: FormPersistOptions;
}

/**
 * Custom hook that integrates React Hook Form with Zod and handles server actions
 *
 * @param schema - Zod schema for form validation
 * @param action - Server action function to call on submit
 * @param options - Additional options for form handling
 * @param formOptions - Additional options for useForm
 * @returns React Hook Form methods and submission handler
 *
 * @example
 * ```tsx
 * const {
 *   register,
 *   formState,
 *   handleAction,
 *   isLoading,
 *   LoadingSkeleton,
 *   clearStorage // Clear persisted form data
 * } = useZodForm({
 *   schema: loginSchema,
 *   action: signInAction,
 *   options: {
 *     formId: "login-form",
 *     analyticsEventName: "auth_success",
 *     toastMessages: {
 *       success: "Successfully signed in!",
 *       error: "Failed to sign in. Please try again."
 *     },
 *     loadingFields: 2,
 *     // Form persistence options
 *     persistState: true,
 *     persistKey: "login-form-state",
 *     persist: {
 *       exclude: ["password"], // Fields to exclude from persistence
 *       timeout: 3600000, // Clear after 1 hour
 *       onTimeout: () => console.log("Form data expired"),
 *       validate: true, // Validate restored data
 *       dirty: false, // Don't mark restored fields as dirty
 *       touch: false // Don't mark restored fields as touched
 *     }
 *   },
 *   formOptions: {
 *     defaultValues: {
 *       email: "",
 *       password: "",
 *     }
 *   },
 * });
 *
 * return (
 *   <>
 *     {isLoading && options.showLoadingSkeleton ? (
 *       <LoadingSkeleton />
 *     ) : (
 *       <form action={handleAction}>
 *         <input {...register("email")} />
 *         {formState.errors.email && <p>{formState.errors.email.message}</p>}
 *         <button type="submit" disabled={isLoading}>Submit</button>
 *       </form>
 *     )}
 *   </>
 * );
 * ```
 */
export function useZodForm<TSchema extends ZodSchema, TFieldValues extends FieldValues = any>({
  schema,
  action,
  options = {},
  formOptions = {},
}: {
  schema: TSchema;
  action: (formData: FormData) => Promise<any>;
  options?: FormActionOptions;
  formOptions?: UseFormProps<TFieldValues>;
}) {
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);
  const [shouldShowSkeleton, setShouldShowSkeleton] = useState(false);

  const form = useForm<TFieldValues>({
    resolver: zodResolver(schema),
    ...formOptions,
  });

  // Form persistence
  const persistKey = options.persistKey || options.formId;
  const persist = options.persist;
  const getStorage = () => persist?.storage || window.localStorage;

  // Restore form data
  useEffect(() => {
    if (persist && persistKey) {
      const str = getStorage().getItem(persistKey);
      if (str) {
        try {
          const { _timestamp = null, ...values } = JSON.parse(str);
          const currTimestamp = Date.now();

          // Check if data is stale
          if (persist.timeout && currTimestamp - _timestamp > persist.timeout) {
            persist.onTimeout?.();
            getStorage().removeItem(persistKey);
            return;
          }

          // Filter excluded fields
          const dataToRestore = persist.exclude?.length
            ? Object.entries(values)
                .filter(([key]) => !persist.exclude?.includes(key))
                .reduce((obj, [key, val]) => ({ ...obj, [key]: val }), {})
            : values;

          // Validate against schema if needed
          if (persist.validate !== false) {
            const result = schema.safeParse(dataToRestore);
            if (!result.success) {
              getStorage().removeItem(persistKey);
              return;
            }
          }

          // Restore data
          Object.entries(dataToRestore).forEach(([key, value]) => {
            form.setValue(
              key as Path<TFieldValues>,
              value as PathValue<TFieldValues, Path<TFieldValues>>,
              {
                shouldValidate: persist.validate !== false,
                shouldDirty: persist.dirty || false,
                shouldTouch: persist.touch || false,
              }
            );
          });

          persist.onDataRestored?.(dataToRestore);
        } catch (error) {
          // Invalid JSON or validation error, remove it
          getStorage().removeItem(persistKey);
        }
      }
    }
  }, [persistKey, schema]);

  // Save form state on change
  useEffect(() => {
    if (persist && persistKey) {
      const subscription = form.watch((values) => {
        const dataToSave = persist.exclude?.length
          ? Object.entries(values)
              .filter(([key]) => !persist.exclude?.includes(key))
              .reduce((obj, [key, val]) => ({ ...obj, [key]: val }), {})
          : values;

        if (Object.keys(dataToSave).length) {
          const data = persist.timeout ? { ...dataToSave, _timestamp: Date.now() } : dataToSave;
          getStorage().setItem(persistKey, JSON.stringify(data));
        }
      });
      return () => subscription.unsubscribe();
    }
  }, [form.watch, persistKey, persist]);

  const handleSubmit: SubmitHandler<TFieldValues> = async (data) => {
    try {
      setIsLoading(true);
      setShouldShowSkeleton(options.showLoadingSkeleton || false);
      const formData = new FormData();

      // Convert form data to FormData for server action
      Object.entries(data).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append(key, value);
        } else if (value instanceof Date) {
          formData.append(key, value.toISOString());
        } else if (value !== null && value !== undefined) {
          formData.append(key, String(value));
        }
      });

      // Call server action
      const result = await action(formData);

      if (result?.success === false) {
        throw new Error(result.error || "Form submission failed");
      }

      // Clear persisted data on success
      if (persist && persistKey) {
        getStorage().removeItem(persistKey);
      }

      // Track success event if specified
      if (options.analyticsEventName) {
        const event: Event = {
          name: options.analyticsEventName,
          properties: {
            formId: options.formId,
            success: true,
            ...result,
          },
        };
        // analytics.track(event);
      }

      // Show success toast if specified
      if (options.toastMessages?.success) {
        toast.success(options.toastMessages.success);
      }

      if (options.onSuccess) {
        options.onSuccess(result);
      }

      return result;
    } catch (error) {
      // Log error with context
      Logger.getInstance().error(
        "Form submission failed",
        {
          component: "useZodForm",
          formId: options.formId,
          errorType: error instanceof AppError ? error.type : undefined,
        },
        AppError.from(error)
      );

      // Track error event
      if (options.analyticsEventName) {
        const event: Event = {
          name: "action_error",
          properties: {
            formId: options.formId,
            error: error instanceof Error ? error.message : String(error),
            errorType: error instanceof AppError ? error.type : undefined,
          },
        };
        // analytics.track(event);
      }

      // Show error toast if specified
      if (options.toastMessages?.error) {
        toast.error(options.toastMessages.error);
      }

      if (options.onError) {
        options.onError(error instanceof Error ? error : new Error(String(error)));
      }

      throw error;
    } finally {
      setIsLoading(false);
      setShouldShowSkeleton(false);
    }
  };

  // Create a form action handler for server actions
  const handleAction = useCallback(
    async (formData: FormData) => {
      startTransition(async () => {
        try {
          setIsLoading(true);
          setShouldShowSkeleton(options.showLoadingSkeleton || false);
          await action(formData);
        } catch (error) {
          // Error is handled by the action itself
        } finally {
          setIsLoading(false);
          setShouldShowSkeleton(false);
        }
      });
    },
    [action, startTransition, options.showLoadingSkeleton]
  );

  const onSubmit = form.handleSubmit((data) => {
    startTransition(async () => {
      try {
        await handleSubmit(data);
      } catch (error) {
        // Error is already logged and handled by handleSubmit
      }
    });
  });

  // Create loading skeleton component
  const LoadingSkeleton: FC = useCallback(() => {
    return <FormSkeleton fields={options.loadingFields} />;
  }, [options.loadingFields]);

  // Return all form methods directly to fix TypeScript errors
  return {
    form,
    register: form.register,
    formState: form.formState,
    getValues: form.getValues,
    setValue: form.setValue,
    reset: form.reset,
    watch: form.watch,
    trigger: form.trigger,
    control: form.control,
    handleSubmit: form.handleSubmit,
    handleAction,
    isPending,
    isLoading,
    shouldShowSkeleton,
    onSubmit,
    LoadingSkeleton,
    clearStorage: useCallback(() => {
      if (persistKey) {
        getStorage().removeItem(persistKey);
      }
    }, [persistKey]),
  };
}
