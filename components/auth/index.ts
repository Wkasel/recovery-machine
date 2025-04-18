// Core components
export { AuthProvider } from "./AuthProvider";
export type { AuthMethod } from "./AuthProvider";


// UI Components
export { default as GoogleOneTap } from "./GoogleOneTap";
export { default as GoogleSignInButton } from "./GoogleSignInButton";
export { default as MagicLink } from "./MagicLink";
export { default as PhoneSignIn } from "./PhoneSignIn";

// Re-export types from auth methods
export type {
  AuthBaseProps,
  EmailPasswordAuthProps,
  MagicLinkAuthProps,
  OAuthAuthProps,
  PhoneAuthProps,
  // Form value types
  EmailPasswordSignInValues,
  EmailPasswordSignUpValues,
  MagicLinkValues,
  PhoneSignUpValues,
  PhoneOtpValues,
} from "./types";

// Re-export form hooks
export {
  type UseMagicLinkFormOptions,
  useMagicLinkForm,
  useVerifyMagicLinkForm,
} from "@/core/forms/auth/magic-link-form";

export {
  type UsePhoneFormOptions,
  usePhoneForm,
  useVerifyPhoneForm,
} from "@/core/forms/auth/phone-form";

export {
  type UseOAuthFormOptions,
  useGoogleSignIn,
} from "@/core/forms/auth/oauth-form";
