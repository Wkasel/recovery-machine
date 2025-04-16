# Codebase Scale & Optimization Plan

## Progress Checklist

### ✅ Completed

- [x] Created unified `AppProvider` in `app/providers.tsx` (wraps ThemeProvider, Toaster, etc.)
- [x] Updated `app/layout.tsx` to use only `AppProvider`
- [x] Scaffolded `services/` directory:
  - [x] `supabase/client.ts`
  - [x] `supabase/types.ts`
  - [x] `supabase/queries/auth.ts`
  - [x] `supabase/queries/users.ts`
- [x] Scaffolded `lib/logger/` directory:
  - [x] `index.ts`
  - [x] `transport.ts`
  - [x] `formatters.ts`
- [x] Scaffolded `types/` directory:
  - [x] `index.ts`
  - [x] `supabase.ts`
  - [x] `env.ts`

### 🔜 Next Up

- [ ] Audit existing app code for:
  - [ ] Supabase client usage (migrate to `services/supabase/client.ts`)
  - [ ] Logger usage (migrate to `lib/logger/`)
  - [ ] Type definitions (move to `types/`)
  - [ ] Any other service logic (move to `services/`)
- [ ] Migrate and refactor code to new structure
- [ ] Integrate logger with error system if not already
- [ ] Continue with next phases from the scale plan (TanStack Query, hooks, realtime, etc.)

---

## 1. Component Architecture & UI Organization

### ShadcN Component Structure

```
components/
├── ui/            # ShadcN base components
├── shared/        # Shared business components
│   ├── forms/     # Form components & compositions
│   ├── layouts/   # Shared layout components
│   └── data/      # Data display components
├── [module]/      # Module-specific components
│   ├── index.ts   # Barrel exports
│   └── types.ts   # Module-specific types
```

### Next.js App Router Layout Structure

```
app/
├── layout.tsx           # Root layout
├── providers.tsx        # Root providers
├── [module]/           # Feature modules
│   ├── layout.tsx      # Module layout
│   ├── page.tsx        # Module page
│   ├── component/     # Module-specific components
│   └── hooks/          # Module-specific hooks
```

## 2. Data Management & Services

### Supabase Integration with TanStack Query

```typescript
// services/supabase/
├── client.ts           # Supabase client configuration
├── types.ts           # Generated Supabase types
└── queries/           # TanStack Query hooks
    ├── auth.ts
    ├── users.ts
    └── [entity].ts
```

### Service Layer

```typescript
// services/
├── index.ts           # Service barrel exports
├── supabase/         # Supabase services
├── analytics/        # Analytics services
└── storage/          # Storage services
```

## 3. Error Handling & Logging

### Custom Error System

```typescript
// lib/errors/
├── types.ts          # Error types & interfaces
├── AppError.ts       # Base custom error class
├── AuthError.ts      # Auth-specific errors
├── ApiError.ts       # API-specific errors
└── DatabaseError.ts  # Database-specific errors
```

### Error Boundaries

```typescript
// components/error-boundary/
├── RootErrorBoundary.tsx     # Application root error boundary
└── ModuleErrorBoundary.tsx   # Module-specific error boundary
```

### Logging System

```typescript
// lib/logger/
├── index.ts          # Logger instance & configuration
├── transport.ts      # Log transport setup
└── formatters.ts     # Log formatters
```

## 4. Authentication & Authorization

### Auth Hooks & Utilities

```typescript
// hooks/auth/
├── useAuth.ts        # Authentication state & methods
├── useSession.ts     # Session management
└── usePermissions.ts # Permission checking
```

### Auth Middleware

```typescript
// middleware/
├── auth.ts           # Auth middleware
└── permissions.ts    # Permission middleware
```

## 5. State Management & Data Flow

### TanStack Query Setup

```typescript
// lib/query/
├── config.ts         # Query client configuration
├── hooks.ts          # Base query hooks
└── mutations.ts      # Base mutation hooks
```

### Supabase Realtime

```typescript
// lib/realtime/
├── config.ts         # Realtime client setup
├── hooks.ts          # Realtime subscription hooks
└── channels.ts       # Channel management
```

## 6. Performance & Optimization

### Route Handlers & API

```typescript
app/api/
├── [module]/
│   └── route.ts      # Route handlers (Next.js 13+ style)
└── middleware.ts     # API middleware
```

### Asset Optimization

1. Next.js Image optimization
2. Dynamic imports for heavy components
3. Route prefetching

## 7. Development Experience

### TypeScript Configuration

```typescript
// types/
├── index.ts          # Type exports
├── supabase.ts       # Supabase types
└── env.ts           # Environment variables types
```

### Code Quality

1. ESLint with Next.js and TypeScript rules
2. Prettier configuration
3. Husky pre-commit hooks
4. TypeScript strict mode

## Implementation Order

1. **Phase 1: Foundation & Structure**

   - Service layer setup
   - Error handling system
   - Logging infrastructure
   - TypeScript configuration

2. **Phase 2: Data & State**

   - TanStack Query integration
   - Supabase service layer
   - Realtime subscriptions
   - Custom hooks

3. **Phase 3: Component Architecture**

   - ShadcN component organization
   - Module structure
   - Layout system
   - Error boundaries

4. **Phase 4: Auth & Security**

   - Auth hooks and utilities
   - Middleware implementation
   - Permission system
   - Security headers

5. **Phase 5: Performance**
   - Route optimization
   - Asset optimization
   - Monitoring setup
   - Performance testing

## Best Practices & Standards

1. **Component Guidelines**

   - Co-locate components with their pages when highly specific
   - Use shared components for reusable UI
   - Implement proper prop typing
   - Use ShadcN patterns for consistency

2. **Data Management**

   - Use TanStack Query for server state
   - Implement optimistic updates
   - Handle loading and error states
   - Use proper cache invalidation

3. **Error Handling**

   - Custom error classes for different scenarios
   - Proper error boundaries placement
   - Consistent error logging
   - User-friendly error messages

4. **Performance**
   - Implement proper loading states
   - Use suspense boundaries
   - Optimize images and assets
   - Monitor performance metrics

## Notes

- Follow Next.js App Router patterns for routing and layouts
- Use ShadcN component patterns consistently
- Implement proper TypeScript types throughout
- Maintain consistent error handling and logging
- Focus on performance and user experience
- Keep security as a primary concern
