import { ServerActionResult } from "@/core/types";
import { OAuthProvider } from "@/core/actions/server/auth/methods/oauth";
import { z } from "zod";
import { clientAuthSchemas } from "@/core/schemas/client/auth";

/**
 * Common props for auth components
 */
export interface AuthBaseProps {
  redirectTo?: string;
  onSuccess?: (result: ServerActionResult) => void;
  onError?: (error: string) => void;
}

/**
 * Props for EmailPasswordAuth component
 */
export interface EmailPasswordAuthProps extends AuthBaseProps {
  mode: "signin" | "signup";
}

/**
 * Props for MagicLinkAuth component
 */
export interface MagicLinkAuthProps extends AuthBaseProps {}

/**
 * Props for OAuthAuth component
 */
export interface OAuthAuthProps extends AuthBaseProps {
  provider: OAuthProvider;
}

/**
 * Props for PhoneAuth component
 */
export interface PhoneAuthProps extends AuthBaseProps {}

// Export form value types from schemas
export type EmailPasswordSignInValues = z.infer<
  typeof clientAuthSchemas.emailPassword.signIn
>;
export type EmailPasswordSignUpValues = z.infer<
  typeof clientAuthSchemas.emailPassword.signUp
>;
export type MagicLinkValues = z.infer<typeof clientAuthSchemas.magicLink.send>;
export type PhoneSignUpValues = z.infer<typeof clientAuthSchemas.phone.signUp>;
export type PhoneOtpValues = z.infer<typeof clientAuthSchemas.phone.verifyOtp>;
