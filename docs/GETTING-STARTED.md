# Getting Started Guide

## Table of Contents

1. [Initial Setup](#initial-setup)
2. [Project Configuration](#project-configuration)
3. [Authentication Setup](#authentication-setup)
4. [Development Patterns](#development-patterns)
5. [Common Pitfalls](#common-pitfalls)
6. [Best Practices](#best-practices)

## Initial Setup

### Prerequisites

1. Node.js 18+ and npm
2. Supabase account
3. Git
4. VS Code (recommended)

### Installation Steps

```bash
# Clone the repository
git clone https://github.com/your-org/your-repo.git my-project

# Install dependencies
cd my-project
npm install

# Copy environment template
cp .env.example .env.local
```

### Environment Configuration

1. Create a Supabase project at https://supabase.com
2. Add these variables to `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key # Only if using admin features
```

## Project Configuration

### 1. Update Project Information

Edit these files with your project details:

- `package.json`: Update name, version, description
- `README.md`: Update project overview
- `app/layout.tsx`: Update metadata

### 2. Configure Authentication Methods

In `app/providers.tsx`, configure your desired auth methods:

```typescript
<AuthProvider
  defaultMethod="email-password"
  availableMethods={[
    "email-password",
    "magic-link",
    // Add other methods as needed
  ]}
  redirectTo="/dashboard" // Update default redirect
/>
```

### 3. Setup Database Schema

1. Create your database schema in Supabase
2. Generate TypeScript types:

```bash
npm run types:generate # This will update lib/types/database.ts
```

## Authentication Setup

### 1. Configure Auth Settings in Supabase

1. Go to Authentication > Settings in Supabase dashboard
2. Configure Site URL: `http://localhost:3000` (development)
3. Add additional redirect URLs if needed
4. Enable/disable auth providers as needed

### 2. Setup OAuth Providers (if using)

For each OAuth provider:

1. Create provider application (Google, GitHub, etc.)
2. Add credentials in Supabase dashboard
3. Configure redirect URLs
4. Update available methods in `AuthProvider`

### 3. Customize Email Templates

1. Go to Authentication > Email Templates
2. Customize:
   - Confirmation emails
   - Magic link emails
   - Reset password emails
   - Change email address emails

## Development Patterns

### 1. Server Actions Pattern

Always use the factory pattern for server actions:

```typescript
// ✅ Good - Using factory
const myAction = createAuthAction("action-name", validationSchema, async (data) => {
  // Implementation
});

// ❌ Bad - Direct implementation
export async function myAction(formData: FormData) {
  // Direct implementation
}
```

### 2. Form Handling Pattern

Always use the form hooks with validation:

```typescript
// ✅ Good - Using form hook
const { form, isPending } = useZodForm({
  schema: mySchema,
  action: myAction,
});

// ❌ Bad - Direct form handling
const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  // Direct handling
};
```

### 3. Error Handling Pattern

Use the error classes for consistent error handling:

```typescript
// ✅ Good - Using error classes
throw AuthError.invalidCredentials();
throw AppError.notFound("User");

// ❌ Bad - Direct error throwing
throw new Error("Invalid credentials");
```

### 4. Loading State Pattern

Use domain-specific loading hooks:

```typescript
// ✅ Good - Domain-specific loading
const { isLoading } = useAuthLoading();

// ❌ Bad - Generic loading state
const [loading, setLoading] = useState(false);
```

## Common Pitfalls

### 1. Authentication Flow

- **Issue**: Session not persisting after sign in
  **Solution**: Ensure you're using `createServerSupabaseClient` on the server side

- **Issue**: Redirect loops in protected routes
  **Solution**: Check middleware configuration and auth state management

### 2. Type Safety

- **Issue**: Lost type safety in server actions
  **Solution**: Always use the factory pattern and proper validation schemas

- **Issue**: `any` types in database queries
  **Solution**: Generate and use database types

### 3. Performance

- **Issue**: Unnecessary client-side rendering
  **Solution**: Use server components by default, only use client components when needed

- **Issue**: Large bundle sizes
  **Solution**: Use dynamic imports and proper code splitting

## Best Practices

### 1. Code Organization

```typescript
// Group related functionality
lib/
  features/
    auth/
      actions/     # Auth-related server actions
      components/  # Auth-related components
      hooks/      # Auth-related hooks
      types.ts    # Auth-related types
```

### 2. Type Safety

- Always define proper interfaces/types
- Use Zod schemas for runtime validation
- Generate database types
- Avoid using `any`

### 3. Error Handling

- Use appropriate error classes
- Implement proper error boundaries
- Log errors with context
- Provide user-friendly messages

### 4. Testing

- Write unit tests for utilities
- Write integration tests for server actions
- Write E2E tests for critical flows
- Use proper mocking for external services

### 5. Security

- Never expose sensitive data in client components
- Always validate data on the server
- Use proper CORS configuration
- Implement rate limiting
- Use environment variables for sensitive data

## Next Steps

1. Review the [Architecture Documentation](./ARCHITECTURE.md)
2. Explore the [Authentication System](./auth.md)
3. Learn about [Forms & Validation](./FORMS.md)
4. Check out the [UI Framework](./UI-FRAMEWORK.md)

## Troubleshooting

If you encounter issues:

1. Check the [Common Pitfalls](#common-pitfalls) section
2. Review server logs
3. Check browser console errors
4. Verify environment variables
5. Ensure all dependencies are installed
6. Check Supabase dashboard for auth issues

## Support

- Create an issue in the repository
- Check existing issues for solutions
- Review the documentation
- Join our Discord community (if available)
