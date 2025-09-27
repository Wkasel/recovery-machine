// Core components
export { AuthContextProvider, useAuth } from "./AuthContext";

// UI Components
export { default as GoogleOneTap } from "./GoogleOneTap";
export { default as GoogleSignInButton } from "./GoogleSignInButton";
export { default as MagicLink } from "./MagicLink";
export { default as PhoneSignIn } from "./PhoneSignIn";

// Error boundary re-exports
export { ModuleErrorBoundary, RootErrorBoundary } from "@/components/error-boundary";

// Re-export types from auth methods if they exist
export type {
  AuthBaseProps,
  EmailPasswordAuthProps,
  EmailPasswordSignInValues,
  EmailPasswordSignUpValues,
  MagicLinkAuthProps,
  MagicLinkValues,
  OAuthAuthProps,
  PhoneAuthProps,
  PhoneOtpValues,
  PhoneSignUpValues,
} from "./types";
