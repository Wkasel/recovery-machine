# Authentication System Documentation

## Index

1. [Overview](#overview)
2. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Basic Setup](#basic-setup)
   - [Customization Guide](#customization-guide)
3. [Architecture](#architecture)
4. [Server Actions](#server-actions)
   - [Action Factory](#action-factory)
   - [Error Handling](#error-handling)
   - [Authentication Methods](#authentication-methods)
5. [Client Components](#client-components)
   - [Basic Components](#basic-components)
   - [Combined Components](#combined-components)
6. [Example Pages](#example-pages)
7. [Extending the System](#extending-the-authentication-system)
8. [Best Practices](#best-practices)
9. [Troubleshooting](#troubleshooting)
10. [Conclusion](#conclusion)

## Overview

Our authentication system uses a standardized approach with factory patterns to reduce boilerplate, ensure consistent error handling, and provide type safety across all auth operations. The system is built on Supabase authentication with a server-side first approach, leveraging Next.js server actions.

## Getting Started

### Prerequisites

1. Supabase Account and Project

   ```bash
   # Install Supabase CLI
   npm install -g supabase

   # Login to Supabase
   supabase login
   ```

2. Environment Setup

   ```bash
   # Copy environment template
   cp .env.example .env.local

   # Add your Supabase credentials
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

### Basic Setup

1. Install Dependencies

   ```bash
   npm install @supabase/supabase-js @supabase/auth-helpers-nextjs zod
   ```

2. Initialize Authentication

   ```typescript
   // app/providers.tsx
   import { AuthProvider } from '@/components/auth';

   export default function Providers({ children }) {
     return (
       <AuthProvider
         defaultMethod="email-password"
         availableMethods={["email-password"]}
         redirectTo="/dashboard"
       >
         {children}
       </AuthProvider>
     );
   }
   ```

3. Create Auth Pages

   ```typescript
   // app/auth/sign-in/page.tsx
   import { AuthLayout } from '@/components/auth';
   import { EmailPasswordAuth } from '@/components/auth/methods';

   export default function SignInPage() {
     return (
       <AuthLayout
         title="Sign in"
         showSignUpLink
       >
         <EmailPasswordAuth mode="signin" />
       </AuthLayout>
     );
   }
   ```

### Customization Guide

1. Styling

   ```typescript
   // lib/auth/theme.ts
   export const authTheme = {
     colors: {
       primary: '#0070f3',
       // Add your brand colors
     },
     fonts: {
       // Custom fonts
     },
     // Other theme variables
   };

   // components/auth/AuthLayout.tsx
   import { authTheme } from '@/lib/auth/theme';

   <AuthLayout
     theme={authTheme}
     // Other props
   >
   ```

2. Custom Error Messages

   ```typescript
   // lib/errors/AuthError.ts
   export class AuthError extends AppError {
     static customMessages = {
       invalid_credentials: "Your custom message here",
       // Add more custom messages
     };
   }
   ```

3. Additional Auth Methods

   ```typescript
   // Enable more auth methods
   <AuthProvider
     availableMethods={[
       "email-password",
       "magic-link",
       "oauth",
       "phone"
     ]}
     oauthProviders={["google", "github"]}
   />
   ```

4. Custom Validation Rules

   ```typescript
   // lib/validation/auth.ts
   export const passwordSchema = z
     .string()
     .min(8, "Password must be at least 8 characters")
     .regex(/[A-Z]/, "Must contain uppercase letter")
     .regex(/[0-9]/, "Must contain number");

   export const customSignUpSchema = z.object({
     email: z.string().email(),
     password: passwordSchema,
     // Add custom fields
   });
   ```

5. Custom Redirect Logic
   ```typescript
   // lib/auth/redirects.ts
   export const getRedirectUrl = (user: User) => {
     if (user.user_metadata.role === "admin") {
       return "/admin/dashboard";
     }
     return "/dashboard";
   };
   ```

## Architecture

```
/lib
  /server-actions
    /auth
      /core
        action-factory.ts      // Factory functions for creating auth actions
        types.ts              // Shared types for auth actions
      email-password-auth.ts   // Email/password authentication actions
      oauth-auth.ts            // OAuth authentication actions
      user-profile.ts          // User profile management actions
      auth-callback.ts         // Auth callback handler for redirects
      magic-link-auth.ts       // Magic link authentication actions
      phone-auth.ts            // Phone authentication actions

/components
  /auth
    /methods
      EmailPasswordAuth.tsx    // Email/password component
      MagicLinkAuth.tsx        // Magic link component
      OAuthAuth.tsx            // OAuth component
      PhoneAuth.tsx            // Phone authentication component
    /ui
      AuthLayout.tsx           // Shared layout for auth pages
    AuthProvider.tsx           // Combined auth provider with method selection
    index.ts                   // Re-exports for easier imports
```

## Server Actions

### Action Factory

The action factory (`action-factory.ts`) provides standardized server actions with built-in error handling, logging, and type safety. It defines a standard result type:

```typescript
type ServerActionResult<T = void> = {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
};
```

The factory provides two core functions:

#### createAuthAction

Creates form-based actions with validation and standardized error handling:

```typescript
export const myAction = createAuthAction(
  "myActionName", // For logging and tracking
  myValidationSchema, // Zod schema for form validation
  async (validatedData) => {
    // Implementation with type-safe validated data
    return {
      success: true,
      message: "Success message",
      data: {
        /* optional typed data */
      },
    };
  }
);
```

#### createRedirectAction

Creates actions that handle redirects (particularly for OAuth flows):

```typescript
export const myRedirectAction = createRedirectAction(
  "myRedirectActionName",
  async (param1, param2) => {
    // Implementation that returns a URL
    return "https://example.com/redirect";
  }
);
```

### Error Handling

The system uses a standardized `AuthError` class for all authentication errors:

```typescript
// Standard error types
throw AuthError.invalidCredentials();
throw AuthError.sessionExpired();
throw AuthError.unauthorized();
throw AuthError.emailNotVerified();

// Converting external errors
throw AuthError.fromSupabaseError(error);

// Custom error with context
throw new AuthError("Custom error message", cause, {
  subType: "custom_error",
  context: {
    /* additional info */
  },
});
```

All errors are automatically:

- Logged with appropriate context
- Converted to user-friendly messages
- Formatted in a consistent response structure
- Type-safe through the entire chain

### Authentication Methods

#### Email/Password Authentication

```typescript
// Sign in
const result = await signInWithEmailPassword(formData);
if (!result.success) {
  // Type-safe error handling
  console.error(result.error);
}

// Sign up with automatic validation
const result = await signUpWithEmailPassword(formData);
```

#### OAuth Authentication

```typescript
// Sign in with OAuth
const url = await signInWithOAuth("google");
window.location.href = url;

// Link an OAuth provider to existing account
const url = await linkOAuthProvider("github");
window.location.href = url;
```

#### Magic Link Authentication

```typescript
// Send magic link
const result = await sendMagicLink(formData);

// Verify OTP (if automatic redirect doesn't work)
const result = await verifyMagicLinkOtp(formData);
```

#### Phone Authentication

```typescript
// Send OTP to phone
const result = await sendPhoneOtp(formData);

// Verify phone OTP
const result = await verifyPhoneOtp(formData);

// Sign up with phone
const result = await signUpWithPhone(formData);
```

#### User Profile Management

```typescript
// Get current user
const result = await getCurrentUser();

// Update user profile
const result = await updateUserProfile(formData);

// Update user email
const result = await updateUserEmail(formData);

// Update user password
const result = await updateUserPassword(formData);
```

## Client Components

### Basic Components

#### Email/Password Authentication Component

```tsx
<EmailPasswordAuth
  mode="signin" // or "signup"
  redirectTo="/dashboard"
  onSuccess={(result) => console.log(result)}
  onError={(error) => console.error(error)}
/>
```

#### Magic Link Authentication Component

```tsx
<MagicLinkAuth
  onSuccess={(result) => console.log(result)}
  onError={(error) => console.error(error)}
/>
```

#### OAuth Authentication Component

```tsx
<OAuthAuth providers={["google", "github"]} onError={(error) => console.error(error)} />
```

#### Phone Authentication Component

```tsx
<PhoneAuth
  redirectTo="/dashboard"
  onSuccess={(result) => console.log(result)}
  onError={(error) => console.error(error)}
/>
```

### Combined Components

#### Auth Provider

Combines multiple authentication methods with tab-based switching:

```tsx
<AuthProvider
  defaultMethod="oauth"
  availableMethods={["oauth", "email-password", "magic-link", "phone"]}
  oauthProviders={["google", "github"]}
  redirectTo="/dashboard"
  rememberDevice={true}
  footerContent={<div>Custom footer content</div>}
/>
```

#### Auth Layout

Provides a consistent layout for authentication pages:

```tsx
<AuthLayout
  title="Sign in to your account"
  description="Enter your credentials to access your account"
  logo="/logo.png"
  showSignUpLink={true}
  showSignInLink={false}
>
  {/* Auth content */}
</AuthLayout>
```

## Example Pages

### Sign In Page

```tsx
export default function SignInPage() {
  return (
    <AuthLayout
      title="Sign in to your account"
      description="Enter your credentials to access your account"
      showSignUpLink
    >
      <AuthProvider
        defaultMethod="oauth"
        availableMethods={["oauth", "email-password", "magic-link", "phone"]}
        redirectTo="/dashboard"
      />
    </AuthLayout>
  );
}
```

### Sign Up Page

```tsx
export default function SignUpPage() {
  return (
    <AuthLayout
      title="Create your account"
      description="Sign up to get started with our platform"
      showSignInLink
    >
      <EmailPasswordAuth mode="signup" redirectTo="/auth/verify" />
    </AuthLayout>
  );
}
```

## Extending the Authentication System

### 1. Adding a New Authentication Method

To add a new authentication method:

1. Create a new file in `/lib/server-actions/auth/` for server actions
2. Create a new component in `/components/auth/methods/` for the UI
3. Add the new method to the `AuthMethod` type in `AuthProvider.tsx`

### 2. Adding a New OAuth Provider

Update the `OAuthProvider` type in `oauth-auth.ts` and ensure the provider icon is added to the `OAuthAuth` component.

### 3. Customizing Error Messages

Extend the `AuthError` class with new error types:

```typescript
// In AuthError.ts
static myCustomError(cause?: unknown): AuthError {
  return new AuthError("Custom error message", cause, {
    subType: "my_custom_error",
  });
}

// Then in toUserMessage()
case "my_custom_error":
  return "User-friendly custom error message";
```

### 4. Creating Custom Validation Schemas

Create reusable validation schemas:

```typescript
// In a schemas file
export const emailSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

export const passwordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const signInSchema = z.object({
  ...emailSchema.shape,
  ...passwordSchema.shape,
});
```

## Best Practices

1. **Use Server Actions for Data Operations**

   - Form submissions, validations, and API calls should use server actions
   - Client components should focus on UI and user interaction

2. **Consistent Error Handling**

   - Always use `AuthError` for authentication errors
   - Make sure errors have user-friendly messages
   - Log errors on the server for debugging

3. **Validation**

   - Always validate both on the client and server
   - Use Zod schemas for consistent validation

4. **Security**

   - Never expose sensitive information in error messages
   - Use HTTPS for all communication
   - Implement rate limiting for authentication attempts

5. **UI/UX**
   - Provide clear feedback during authentication
   - Show loading states during async operations
   - Handle errors gracefully and with helpful messages

## Troubleshooting

### Common Issues

1. **Session Not Persisting**

   - Check that cookies are being set correctly
   - Verify that `createServerSupabaseClient` is used on the server

2. **OAuth Redirect Errors**

   - Verify redirect URLs are configured correctly in Supabase
   - Check callback URL parameters are properly encoded

3. **Validation Errors**
   - Check that form field names match schema property names
   - Ensure validation schemas are properly defined

### Debugging

Use the Logger service to debug authentication issues:

```typescript
Logger.getInstance().debug("Debug message", {
  component: "componentName",
  action: "actionName",
  data: {
    /* relevant debug data */
  },
});
```

Enable debug mode in development:

```typescript
Logger.getInstance().setLevel("debug");
```

### Type Safety

Our authentication system is built with TypeScript and leverages type safety throughout:

1. **Server Action Results**

   ```typescript
   type ServerActionResult<T = void> =
     | {
         success: true;
         data?: T;
         message?: string;
       }
     | {
         success: false;
         error: string;
       };
   ```

2. **Validation Schemas with Action Factory**

   ```typescript
   const signInSchema = z.object({
     email: z.string().email("Please enter a valid email"),
     password: z.string().min(8, "Password must be at least 8 characters"),
   });

   const signInAction = createAuthAction("sign-in", signInSchema, async (data) => {
     // data is fully typed based on the schema
     const { email, password } = data;
     // ... implementation
   });
   ```

3. **Error Types**
   ```typescript
   type AuthErrorSubType =
     | "invalid_credentials"
     | "session_expired"
     | "unauthorized"
     | "email_not_verified";
   ```

### OAuth Implementation

The `createRedirectAction` function handles OAuth flows with built-in error handling:

```typescript
const oauthSignInAction = createRedirectAction("oauth-sign-in", async (provider: OAuthProvider) => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) throw AuthError.oauthError(error);
  return data;
});
```

Key benefits:

- Automatic error conversion to `AuthError`
- Consistent logging across all OAuth providers
- Type-safe provider handling
- Standardized redirect flow

### Validation Best Practices

1. **Reusable Schema Composition**

   ```typescript
   // Base schemas
   const emailSchema = z.object({
     email: z.string().email("Please enter a valid email"),
   });

   const passwordSchema = z.object({
     password: z.string().min(8, "Password must be at least 8 characters"),
   });

   // Combined schemas
   const signInSchema = z.object({
     ...emailSchema.shape,
     ...passwordSchema.shape,
   });

   const signUpSchema = signInSchema
     .extend({
       name: z.string().min(2, "Please enter your name"),
       confirmPassword: z.string(),
     })
     .refine((data) => data.password === data.confirmPassword, {
       message: "Passwords don't match",
     });
   ```

2. **Using Schemas with Action Factory**

   ```typescript
   const signUpAction = createAuthAction("sign-up", signUpSchema, async (data) => {
     // data is fully typed from schema
     const { email, password, name } = data;

     // Implementation
     const { data: user, error } = await supabase.auth.signUp({
       email,
       password,
       options: {
         data: { name },
       },
     });

     if (error) throw AuthError.signUpFailed(error);
     return { user };
   });
   ```

Benefits:

- Type inference from schema to handler
- Automatic validation
- Consistent error messages
- Reusable schema components

## Conclusion

The authentication system provides a comprehensive, type-safe, and consistent way to handle user authentication. By leveraging the factory pattern, we've reduced boilerplate and standardized error handling, making it easy to add and extend authentication methods.
