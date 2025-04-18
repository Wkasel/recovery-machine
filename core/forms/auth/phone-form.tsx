import { sendPhoneOtp, verifyPhoneOtp } from "@/core/actions/server/auth/methods/phone";
import { clientAuthSchemas } from "@/core/schemas/client/auth";
import { useRouter } from "next/navigation";
import { useZodForm } from "../hooks/use-zod-form";

export interface UsePhoneFormOptions {
  onCodeSent?: () => void;
  redirectTo?: string;
}

export function usePhoneForm({ onCodeSent }: UsePhoneFormOptions = {}) {
  return useZodForm({
    schema: clientAuthSchemas.phone.sendOtp,
    formOptions: {
      defaultValues: {
        phone: "",
      },
    },
    options: {
      formId: "phone-send-otp",
      analyticsEventName: "auth_success",
      toastMessages: {
        success: "Verification code sent",
        error: "Failed to send code",
      },
      onSuccess: () => onCodeSent?.(),
      loadingFields: 1,
      showLoadingSkeleton: true,
      persistState: true, // In case user navigates away while waiting for SMS
    },
    action: sendPhoneOtp,
  });
}

export function useVerifyPhoneForm({ redirectTo = "/protected" }: UsePhoneFormOptions = {}) {
  const router = useRouter();

  return useZodForm({
    schema: clientAuthSchemas.phone.verifyOtp,
    formOptions: {
      defaultValues: {
        token: "",
      },
    },
    options: {
      formId: "phone-verify-otp",
      analyticsEventName: "auth_success",
      toastMessages: {
        success: "Successfully signed in",
        error: "Failed to verify code",
      },
      onSuccess: () => router.push(redirectTo),
      loadingFields: 1,
      showLoadingSkeleton: true,
    },
    action: verifyPhoneOtp,
  });
}
