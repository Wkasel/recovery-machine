import { AuthError } from "@/core/errors/auth/AuthError";
import { AppError } from "@/core/errors/base/AppError";
import { getUser } from "@/core/supabase/queries/auth";
import { getUserProfile, IUserProfile } from "@/core/supabase/queries/users";
import { Logger } from "@/lib/logger/Logger";
import { createSafeActionClient } from "next-safe-action";

// Types for our context and results
export interface ActionContext<T = unknown> {
  validatedData?: T;
  user?: IUserProfile;
  profile?: IUserProfile;
}

export interface ActionResult<T> {
  data?: T;
  error?: string;
  success: boolean;
}

export type NextFunction<T> = (context: ActionContext<T>) => Promise<Response>;

export type ActionMiddleware<T = unknown> = (
  context: ActionContext<T>,
  next: NextFunction<T>
) => Promise<Response | void>;

export type ActionHandler<T = unknown> = (context: ActionContext<T>) => Promise<Response>;

export function createAction<T = unknown>(
  handler: ActionHandler<T>,
  ...middleware: ActionMiddleware<T>[]
) {
  return async (context: ActionContext<T> = {}): Promise<Response> => {
    const chain = middleware.reduceRight(
      (next: NextFunction<T>, middleware: ActionMiddleware<T>): NextFunction<T> => {
        return async (ctx: ActionContext<T>) => {
          const result = await middleware(ctx, next);
          if (result instanceof Response) {
            return result;
          }
          return next(ctx);
        };
      },
      handler
    );
    return chain(context);
  };
}

// Middleware to validate user is authenticated
export const withAuth: ActionMiddleware = async (context, next) => {
  const { user } = context;

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  return next(context);
};

// Middleware to validate user is an admin
export const withAdmin: ActionMiddleware = async (context, next) => {
  const { user } = context;

  if (!user?.isAdmin) {
    return new Response("Forbidden", { status: 403 });
  }

  return next(context);
};

export const actionClient = createSafeActionClient({
  handleServerError(error: Error) {
    // Log the error with our logger
    Logger.getInstance().error(
      "Action error",
      {
        component: "actionClient",
      },
      AppError.from(error)
    );

    // Return user-friendly message in production
    if (process.env.NODE_ENV === "production") {
      if (error instanceof AuthError) {
        return error.toUserMessage();
      }
      return "An unexpected error occurred";
    }

    // Return detailed error in development
    return error instanceof Error ? error.message : "Unknown error";
  },
});

export const authActionClient = actionClient.use(async ({ next, ctx }) => {
  try {
    const user = await getUser();
    if (!user) {
      throw new AuthError("User not authenticated");
    }

    const profile = await getUserProfile(user.id);
    if (!profile) {
      throw new AuthError("User profile not found");
    }

    return await next({
      ctx: {
        ...ctx,
        user: profile,
      },
    });
  } catch (error) {
    Logger.getInstance().error(
      "Auth middleware failed",
      { component: "authActionClient" },
      AppError.from(error)
    );
    throw error;
  }
});

export const adminActionClient = authActionClient.use(async ({ next, ctx }) => {
  try {
    const { user } = ctx as ActionContext;
    if (!user) {
      throw new AuthError("User not authenticated");
    }

    if (!user.isAdmin) {
      throw new AuthError("User is not an admin", undefined, { subType: "unauthorized" });
    }

    return await next({
      ctx: {
        ...ctx,
        user,
      },
    });
  } catch (error) {
    Logger.getInstance().error(
      "Admin middleware failed",
      { component: "adminActionClient" },
      AppError.from(error)
    );
    throw error;
  }
});
