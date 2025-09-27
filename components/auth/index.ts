/**
 * Auth Components Barrel Export
 * 
 * Centralized exports for authentication-related components
 */

// === AUTH CONTEXT ===
export { AuthContextProvider, useAuth } from "./AuthContext";

// === SIGN IN COMPONENTS ===
export { default as GoogleSignInButton } from "./GoogleSignInButton";
export { default as GoogleOneTap } from "./GoogleOneTap";
export { default as MagicLink } from "./MagicLink";
export { default as PhoneSignIn } from "./PhoneSignIn";

// === TYPE EXPORTS ===
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
