"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useZodForm } from "@/core/forms/hooks/use-zod-form";
import type { EventName } from "@/lib/types/analytics";
import { FormSkeleton } from "@/lib/ui/loading/skeletons";
import { ReactNode } from "react";
import { ZodSchema } from "zod";

interface FormBuilderProps<T extends ZodSchema> {
  title?: string;
  description?: string;
  schema: T;
  action: (formData: FormData) => Promise<any>;
  defaultValues?: Record<string, any>;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
  persistState?: boolean;
  formId?: string;
  showLoadingSkeleton?: boolean;
  loadingFields?: number;
  submitText?: string;
  cancelText?: string;
  onCancel?: () => void;
  children: ReactNode | ((methods: ReturnType<typeof useZodForm>) => ReactNode);
  footerContent?: ReactNode;
  analyticsEventName?: EventName;
  toastMessages?: {
    success?: string;
    error?: string;
  };
  /** Use a card wrapper for the form */
  useCard?: boolean;
  /** Show form actions (submit/cancel buttons) */
  showActions?: boolean;
  /** Custom className for the form */
  className?: string;
  /** Custom className for the form content */
  contentClassName?: string;
}

export function FormBuilder<T extends ZodSchema>({
  title,
  description,
  schema,
  action,
  defaultValues,
  onSuccess,
  onError,
  persistState = false,
  formId,
  showLoadingSkeleton = false,
  loadingFields = 3,
  submitText = "Submit",
  cancelText = "Cancel",
  onCancel,
  children,
  footerContent,
  analyticsEventName,
  toastMessages,
  useCard = true,
  showActions = true,
  className = "",
  contentClassName = "space-y-4",
}: FormBuilderProps<T>) {
  const form = useZodForm({
    schema,
    action,
    formOptions: {
      defaultValues,
    },
    options: {
      formId,
      analyticsEventName,
      toastMessages,
      onSuccess,
      onError,
      persistState,
      loadingFields,
      showLoadingSkeleton,
    },
  });

  // If the form is loading and we want to show a skeleton
  if (form.isLoading && showLoadingSkeleton) {
    return <FormSkeleton fields={loadingFields} />;
  }

  const formContent = (
    <form action={form.handleAction} className={className}>
      <div className={contentClassName}>
        {typeof children === "function" ? children(form) : children}
      </div>

      {showActions && (
        <div className="flex gap-2 justify-between mt-4">
          <div>{footerContent}</div>
          <div className="flex gap-2">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} disabled={form.isLoading}>
                {cancelText}
              </Button>
            )}
            <Button type="submit" disabled={form.isLoading}>
              {form.isLoading ? "Loading..." : submitText}
            </Button>
          </div>
        </div>
      )}
    </form>
  );

  if (useCard) {
    return (
      <Card className="w-full">
        {(title || description) && (
          <CardHeader>
            {title && <CardTitle>{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
        )}
        <CardContent>{formContent}</CardContent>
      </Card>
    );
  }

  return formContent;
}

export { useZodForm };
