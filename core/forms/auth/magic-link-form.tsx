import { useZodForm } from "../hooks/use-zod-form";
import { clientAuthSchemas } from "@/core/schemas/client/auth";
import { sendMagicLinkAction } from "@/core/actions/server/auth/magic-link";

export interface UseMagicLinkFormOptions {
  onEmailSent?: () => void;
}

export function useMagicLinkForm({ onEmailSent }: UseMagicLinkFormOptions = {}) {
  return useZodForm({
    schema: clientAuthSchemas.magicLink.send,
    formOptions: {
      defaultValues: {
        email: "",
      },
    },
    options: {
      formId: "magic-link-send",
      analyticsEventName: "auth_success",
      toastMessages: {
        success: "Magic link sent to your email",
        error: "Failed to send magic link"
      },
      onSuccess: () => onEmailSent?.(),
      loadingFields: 1,
      showLoadingSkeleton: true,
      persistState: true, // In case user navigates away while waiting for email
    },
    action: sendMagicLinkAction,
  });
}

export function useVerifyMagicLinkForm() {
  return useZodForm({
    schema: clientAuthSchemas.magicLink.verify,
    formOptions: {
      defaultValues: {
        token: "",
      },
    },
    options: {
      formId: "magic-link-verify",
      analyticsEventName: "auth_success",
      toastMessages: {
        success: "Successfully verified",
        error: "Failed to verify code"
      },
      loadingFields: 1,
      showLoadingSkeleton: true,
    },
    action: sendMagicLinkAction,
  });
}
