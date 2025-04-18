// Core components
export {
  type AuthMethod,
  AuthMethodSelector,
  AuthProvider,
} from "@/core/forms/auth";
export { AuthContextProvider, useAuth } from "./AuthContext";

// UI Components
export { default as GoogleOneTap } from "./GoogleOneTap";
export { default as GoogleSignInButton } from "./GoogleSignInButton";
export { default as MagicLink } from "./MagicLink";
export { default as PhoneSignIn } from "./PhoneSignIn";

// Error boundary re-exports
export {
  ModuleErrorBoundary,
  RootErrorBoundary,
} from "@/components/error-boundary";

// Re-export types from auth methods
export type {
  AuthBaseProps,
  EmailPasswordAuthProps,
  // Form value types
  EmailPasswordSignInValues,
  EmailPasswordSignUpValues,
  MagicLinkAuthProps,
  MagicLinkValues,
  OAuthAuthProps,
  PhoneAuthProps,
  PhoneOtpValues,
  PhoneSignUpValues,
} from "./types";

// Re-export form hooks
export {
  useMagicLinkForm,
  type UseMagicLinkFormOptions,
  useVerifyMagicLinkForm,
} from "@/core/forms/auth/magic-link-form";

export {
  usePhoneForm,
  type UsePhoneFormOptions,
  useVerifyPhoneForm,
} from "@/core/forms/auth/phone-form";

export {
  useGoogleSignIn,
  type UseOAuthFormOptions,
} from "@/core/forms/auth/oauth-form";
