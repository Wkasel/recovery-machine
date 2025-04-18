# Forms System

This document outlines how to use the form system in the application.

## Related Documentation

- [Architecture Overview](./ARCHITECTURE.md)
- [Authentication System](./auth.md)
- [Server Actions](../lib/server-actions/README.md)

## Overview

The forms system combines React Hook Form, Zod validation, and server actions to create a type-safe, performant form handling solution. It integrates with our [authentication system](./auth.md) and [server actions](../lib/server-actions/README.md) for a seamless development experience.

## Architecture

```
lib/
├── forms/
│   ├── hooks/
│   │   └── use-zod-form.ts      # Custom hook for React Hook Form + Zod integration
│   └── validators/              # Zod schemas organized by domain
│       ├── index.ts             # Barrel export
│       ├── auth.ts              # Auth-related schemas
│       └── user.ts              # User-related schemas
```

## Using the Form System

### Basic Usage with Server Actions

```tsx
"use client";

import { useZodForm } from "@/lib/forms/hooks/use-zod-form";
import { signInSchema } from "@/lib/forms/validators/auth";
import { signInAction } from "@/lib/server-actions/auth";

export function SignInForm() {
  const { form, isPending, onSubmit } = useZodForm({
    schema: signInSchema,
    action: signInAction,
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" {...form.register("email")} />
        {form.formState.errors.email && <p>{form.formState.errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input id="password" type="password" {...form.register("password")} />
        {form.formState.errors.password && <p>{form.formState.errors.password.message}</p>}
      </div>

      <button type="submit" disabled={isPending}>
        {isPending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
```

### Integration with UI Framework

```tsx
import { FormSkeleton } from "@/lib/ui/loading/skeletons";
import { useAuthLoading } from "@/lib/ui/loading/hooks";

export function SignInForm() {
  const { form, isPending } = useZodForm({
    schema: signInSchema,
    action: signInAction,
  });

  if (isPending) {
    return <FormSkeleton fields={2} showButton />;
  }

  return <form>{/* ... form fields ... */}</form>;
}
```

### With Success and Error Handling

```tsx
const { form, isPending, onSubmit } = useZodForm({
  schema: signInSchema,
  action: signInAction,
  options: {
    onSuccess: (data) => {
      toast({ title: "Success", description: "Signed in successfully" });
      router.push("/dashboard");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    },
  },
});
```

### Form Validation Schemas

Create your Zod schemas in the appropriate domain file:

```tsx
// lib/forms/validators/auth.ts
import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type SignInFormValues = z.infer<typeof signInSchema>;
```

### Server Actions

Connect your form to a server action:

```tsx
// lib/server-actions/auth/sign-in.ts
"use server";

import { z } from "zod";
import { createServerSupabaseClient } from "@/core/supabase/server";
import { signInSchema } from "@/lib/forms/validators/auth";

export async function signInAction(formData: FormData) {
  try {
    // Extract and validate form data
    const parsed = signInSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    // Call Supabase auth
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.signInWithPassword(parsed);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0]?.message || "Invalid input",
      };
    }

    return { success: false, error: "Something went wrong" };
  }
}
```

## Best Practices

1. **Create domain-specific schemas** in appropriate validator files to keep related validations together
2. **Use type inference** with `z.infer<typeof schema>` to ensure type safety
3. **Always handle loading states** using the `isPending` value from `useZodForm`
4. **Provide error feedback** by displaying form validation errors and server errors to users
5. **Centralize server actions** in the appropriate domain folders under `lib/server-actions`
