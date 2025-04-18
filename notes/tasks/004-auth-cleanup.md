# Authentication System Cleanup Plan

## Current Issues

1. Duplicate error handling patterns across auth components
2. Mixed client-side and server-side approaches not clearly separated
3. Form handling inconsistencies
4. Component organization can be improved
5. Some potential redundancy in Google auth implementations

## Hybrid Approach Strategy

Following Supabase best practices, we should maintain both client-side and server-side capabilities:

- **Server-Side (Server Actions)**

  - Form submissions (sign in, sign up, etc.)
  - Protected route authentication
  - Initial data loading
  - Authentication state verification

- **Client-Side (React Query + Supabase Client)**
  - Real-time subscriptions
  - Interactive features requiring immediate feedback
  - Client-side caching
  - Optimistic updates
  - Auth state monitoring via `onAuthStateChange`

## Code Organization Improvements

### 1. Auth Server Actions Restructuring

```
/lib
  /server-actions
    /auth
      /core
        action-factory.ts    // Functions to create auth actions with consistent error handling
        types.ts             // Common auth action types and interfaces
      auth-actions.ts        // Main export file that contains all auth actions
      index.ts               // Re-export from auth-actions.ts for backward compatibility
```

### 2. Auth Components Organization

```
/components
  /auth
    /methods                  // Authentication method components
      GoogleAuth.tsx          // Unified Google auth component
      MagicLinkAuth.tsx       // Magic link component
      PhoneAuth.tsx           // Phone auth component
    /ui                       // Shared UI components for auth
      AuthForm.tsx            // Common form structure for auth forms
      AuthLayout.tsx          // Common layout for auth pages
    /hooks                    // Auth-specific custom hooks
      use-auth-form.tsx       // Customized form hook for auth forms
    index.tsx                 // Export everything
```

### 3. Validation Schema Organization

```
/lib
  /forms
    /validators
      /auth
        index.ts             // Export all auth schemas
        auth-schemas.ts      // Shared auth validation schemas
```

## Implementation Details

### 1. Create Auth Action Factory

Create a utility to standardize server action error handling while maintaining type safety:

```typescript
// lib/server-actions/auth/core/action-factory.ts
export type ServerActionResult<T = any> =
  | { success: true; data?: T; message?: string }
  | { success: false; error: string };

export function createAuthAction<TInput, TOutput = any>(
  actionName: string,
  schema: ZodSchema<TInput>,
  handler: (validatedData: TInput) => Promise<TOutput>
) {
  return async (formData: FormData): Promise<ServerActionResult<TOutput>> => {
    try {
      // Validation, handler execution, and standardized error handling
    } catch (error) {
      // Standardized error handling
    }
  };
}
```

### 2. Enhance `useZodForm` Hook

Update our form hook to better support both client-side validation and server action submission:

```typescript
// lib/forms/hooks/use-zod-form.ts
export function useZodForm<TSchema extends ZodSchema, TFieldValues extends FieldValues = any>({
  schema,
  action,
  options = {},
  formOptions = {},
}: {
  schema: TSchema;
  action: (formData: FormData) => Promise<any>;
  options?: FormActionOptions;
  formOptions?: UseFormProps<TFieldValues>;
}) {
  // Implementation that supports both client-side and server-side validation
}
```

### 3. Create Shared Auth UI Components

Create reusable components to standardize auth UI:

```typescript
// components/auth/ui/AuthForm.tsx
export function AuthForm({ children, title, description, footer, action }: AuthFormProps) {
  // Implementation of shared form UI
}
```

### 4. Consolidate Google Auth Methods

Review and potentially combine Google authentication methods if appropriate:

```typescript
// components/auth/methods/GoogleAuth.tsx
export default function GoogleAuth({ variant = "button" }: GoogleAuthProps) {
  // Implementation that can render either button or one-tap UI
}
```

## Dead Code to Remove

1. Any direct Supabase client initialization that's been replaced by server actions
2. Duplicate error handling logic now handled by the action factory
3. Redundant validation code now managed by shared schemas

## Implementation Plan

1. Create server action factory for standardized error handling
2. Consolidate validation schemas
3. Enhance components to leverage both server and client approaches:
   - Form submission → Server actions
   - Real-time updates → Client-side Supabase + React Query
4. Create shared UI components
5. Remove duplicate code

## Not Changing

1. Middleware for session management
2. React Query setup for client-side state management
3. Core Supabase client/server utilities
