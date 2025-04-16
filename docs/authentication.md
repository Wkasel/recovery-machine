# Authentication Setup

## Current Implementation

The application uses Supabase Authentication with the following features:

### Authentication Flow

- Email/Password based authentication
- Email verification required for new signups
- Password reset functionality
- Protected routes using middleware
- Server-side authentication handling

### Key Components

1. **Client Setup** (`utils/supabase/client.ts`)

- Browser-side Supabase client initialization
- Used for client-side auth operations

2. **Server Setup** (`utils/supabase/server.ts`)

- Server-side Supabase client with cookie handling
- Used for server-side auth operations

3. **Middleware** (`middleware.ts` & `utils/supabase/middleware.ts`)

- Handles session management
- Protects routes under `/protected/*`
- Redirects authenticated users from `/` to `/protected`
- Redirects unauthenticated users to `/sign-in`

4. **Auth Actions** (`app/actions.ts`)

- `signUpAction`: Handles user registration with email verification
- `signInAction`: Handles email/password login
- `signOutAction`: Handles user logout
- `forgotPasswordAction`: Handles password reset requests
- `resetPasswordAction`: Handles password reset completion

5. **Auth Pages**

- `/sign-up`: User registration page
- `/sign-in`: Login page
- `/forgot-password`: Password reset request page
- `/protected/reset-password`: Password reset completion page
- `/auth/callback`: Handles auth redirects and code exchange

### Environment Configuration

Required environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous API key

### Security Features

- CSRF protection through Supabase's built-in security
- Secure session management using cookies
- Protected routes with middleware checks
- Email verification required for new accounts
- Rate limiting on email operations

### Current Limitations

- Email-only authentication method
- Basic password reset flow
- Default email templates
- Standard rate limits on email operations
