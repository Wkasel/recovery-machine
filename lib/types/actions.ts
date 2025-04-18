import { type IUserProfile } from "@/core/supabase/queries/users/server";

/**
 * Action context passed to middleware and handlers
 */
export interface ActionContext<T = unknown> {
  validatedData?: T;
  user?: IUserProfile;
  profile?: IUserProfile;
}

/**
 * Standard result type for actions
 */
export interface ActionResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Middleware types
 */
export type NextFunction<T> = (context: ActionContext<T>) => Promise<Response>;

export type ActionMiddleware<T = unknown> = (
  context: ActionContext<T>,
  next: NextFunction<T>
) => Promise<Response | void>;

export type ActionHandler<T = unknown> = (context: ActionContext<T>) => Promise<Response>;

/**
 * Auth action specific types
 */
export type ServerActionResult<T = any> =
  | { success: true; data?: T; message?: string }
  | { success: false; error: string };

export type EmailOtpType =
  | "signup"
  | "magiclink"
  | "recovery"
  | "invite"
  | "email"
  | "email_change";
