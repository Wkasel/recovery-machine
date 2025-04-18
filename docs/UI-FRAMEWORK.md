# UI Framework

This document outlines how to use the UI framework components in the application.

## Related Documentation

- [Architecture Overview](./ARCHITECTURE.md)
- [Forms & Validation](./FORMS.md)
- [Authentication System](./auth.md)

## Overview

The UI framework provides a set of components and hooks for building user interfaces with consistent loading states, modals, and skeletons. It integrates seamlessly with our [forms system](./FORMS.md) and [authentication components](./auth.md).

## Architecture

```
lib/
├── ui/
│   ├── modals/                  # Modal system
│   │   ├── context.tsx          # Modal context provider
│   │   └── types.ts             # Modal type definitions
│   └── loading/                 # Loading system
│       ├── context.tsx          # Loading context provider
│       ├── hooks/               # Domain-specific loading hooks
│       │   ├── index.ts         # Barrel export
│       │   ├── auth.ts          # Auth-specific loading hooks
│       │   └── form.ts          # Form-specific loading hooks
│       └── skeletons/           # Skeleton components
│           ├── index.ts         # Barrel export
│           ├── card.tsx         # Card skeleton
│           └── form.tsx         # Form skeleton
```

## Loading System

### Integration with Server Actions

```tsx
"use client";

import { useAuthLoading } from "@/lib/ui/loading/hooks";
import { signInAction } from "@/lib/server-actions/auth";

export function SignInButton() {
  const { setLoading, isLoading } = useAuthLoading();

  const handleSignIn = async () => {
    setLoading("sign-in", true);
    try {
      await signInAction(formData);
    } finally {
      setLoading("sign-in", false);
    }
  };

  return (
    <button onClick={handleSignIn} disabled={isLoading("sign-in")}>
      {isLoading("sign-in") ? "Signing in..." : "Sign in"}
    </button>
  );
}
```

### Setup

The loading system is already set up in the application. The `LoadingProvider` is added to the application's providers in `app/providers.tsx`:

```tsx
// app/providers.tsx
export default function AppProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LoadingProvider>
          {/* Other providers */}
          {children}
        </LoadingProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
```

### Using Loading States

You can use the `useLoading` hook to manage loading states:

```tsx
"use client";

import { useLoading } from "@/lib/ui/loading/context";

export function DataFetcher() {
  const { setLoading, isLoading } = useLoading();

  const fetchData = async () => {
    setLoading("fetch-data", true);
    try {
      // Fetch data
      await apiCall();
    } finally {
      setLoading("fetch-data", false);
    }
  };

  return (
    <div>
      <button onClick={fetchData} disabled={isLoading("fetch-data")}>
        {isLoading("fetch-data") ? "Loading..." : "Fetch Data"}
      </button>

      {isLoading("fetch-data") ? <div>Loading...</div> : <div>Data</div>}
    </div>
  );
}
```

### Domain-Specific Loading

Create domain-specific loading hooks to avoid key collisions:

```tsx
// Define a domain-specific loading hook
import { createDomainLoading } from "@/lib/ui/loading/context";

export const useAuthLoading = createDomainLoading("auth");

// Use in components
function LoginForm() {
  const { setLoading, isLoading } = useAuthLoading();

  // Now loading keys are prefixed with "auth."
  setLoading("login", true); // Actually sets "auth.login"

  return isLoading("login") ? <Spinner /> : <Form />;
}
```

## Modal System

### Setup

The modal system is already set up in the application. The `ModalProvider` is added to the application's providers in `app/providers.tsx`.

### Using Modals

You can use the `useModal` hook to manage modals:

```tsx
"use client";

import { useModal } from "@/lib/ui/modals/context";

export function ModalExample() {
  const { openModal, closeModal } = useModal();

  const handleOpenModal = () => {
    const modalId = openModal({
      component: (
        <div className="p-4 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-bold">Example Modal</h2>
          <p>This is an example modal.</p>
          <button onClick={() => closeModal(modalId)}>Close</button>
        </div>
      ),
      onClose: () => {
        console.log("Modal closed");
      },
    });
  };

  return <button onClick={handleOpenModal}>Open Modal</button>;
}
```

## Skeleton Components

Use skeleton components for loading states:

```tsx
"use client";

import { CardSkeleton, FormSkeleton } from "@/lib/ui/loading/skeletons";

export function SkeletonExample() {
  return (
    <div className="space-y-4">
      <h2>Card Skeleton</h2>
      <CardSkeleton lines={5} />

      <h2>Form Skeleton</h2>
      <FormSkeleton fields={4} showButton />
    </div>
  );
}
```

## Integration with React Query

The UI framework integrates well with React Query for data fetching:

```tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { CardSkeleton } from "@/lib/ui/loading/skeletons";

export function UserProfile() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["user-profile"],
    queryFn: () => fetchUserProfile(),
  });

  if (isLoading) {
    return <CardSkeleton lines={5} />;
  }

  if (error) {
    return <div>Error loading profile</div>;
  }

  return (
    <div>
      <h2>{data.name}</h2>
      <p>{data.email}</p>
    </div>
  );
}
```

## Best Practices

1. **Use domain-specific loading hooks** to avoid key collisions
2. **Prefer skeleton components** over spinners or loading text for a better user experience
3. **Close modals when they're no longer needed** to avoid memory leaks
4. **Handle loading state transitions gracefully** to prevent UI flicker
5. **Provide appropriate feedback** during loading states to keep users informed

## Integration Examples

### With Authentication Forms

```tsx
import { useAuthLoading } from "@/lib/ui/loading/hooks";
import { FormSkeleton } from "@/lib/ui/loading/skeletons";
import { useZodForm } from "@/lib/forms/hooks/use-zod-form";

export function SignInForm() {
  const { isLoading } = useAuthLoading();
  const { form, onSubmit } = useZodForm({
    schema: signInSchema,
    action: signInAction,
  });

  if (isLoading("sign-in")) {
    return <FormSkeleton fields={2} showButton />;
  }

  return <form onSubmit={onSubmit}>{/* ... form fields ... */}</form>;
}
```

### With Server Actions

```tsx
import { useModal } from "@/lib/ui/modals/context";
import { createPostAction } from "@/lib/server-actions/posts";

export function CreatePostButton() {
  const { openModal } = useModal();

  const handleClick = () => {
    openModal({
      component: <CreatePostForm />,
      onClose: () => {
        // Refresh posts list
      },
    });
  };

  return <button onClick={handleClick}>Create Post</button>;
}
```
