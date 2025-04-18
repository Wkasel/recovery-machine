# Next.js and Supabase Enhanced Starter Kit

A production-ready starter kit built with Next.js 14 and Supabase, featuring enhanced type safety, server actions, and comprehensive authentication.

## Documentation Quick Links

- [Getting Started Guide](./docs/GETTING-STARTED.md) ← Start here!
- [Architecture Overview](./docs/ARCHITECTURE.md)
- [Authentication System](./docs/auth.md)
- [Forms & Validation](./docs/FORMS.md)
- [UI Framework](./docs/UI-FRAMEWORK.md)
- [Server Actions](./lib/server-actions/README.md)

## Enhanced Features

- **Type-Safe Server Actions**

  - Factory pattern for standardized actions
  - Middleware-based action system
  - Role-based access control
  - Error boundary integration
  - Zod schema validation

- **Authentication & Authorization**

  - Multiple auth methods (OAuth, Email/Password, Magic Link, Phone)
  - Type-safe auth actions with factory pattern
  - Unified error handling with `AuthError` class
  - Protected routes and API endpoints
  - Role-based access control
  - Admin middleware
  - Comprehensive UI components

- **Modern Architecture**

  - Next.js App Router
  - Server Components by default
  - Edge-ready middleware
  - Factory patterns for scalability
  - See [Architecture Documentation](./docs/ARCHITECTURE.md)

- **Developer Experience**

  - TypeScript strict mode
  - Standardized error handling
  - Factory patterns for code reuse
  - Structured logging system
  - Proper development tooling

- **UI/UX**

  - Unified `AuthProvider` component
  - Responsive navigation system
  - Dark mode support
  - Loading states
  - Error boundaries
  - [shadcn/ui](https://ui.shadcn.com/) components

- **Security**
  - HTTP security headers
  - CORS configuration
  - Rate limiting
  - Input validation with Zod
  - Environment variable management

## Documentation Structure

```
docs/
├── ARCHITECTURE.md     # System architecture and patterns
├── auth.md            # Authentication system documentation
├── FORMS.md           # Forms system and validation
└── UI-FRAMEWORK.md    # UI components and patterns

lib/
└── server-actions/
    └── README.md      # Server actions documentation
```

Each documentation file covers a specific aspect of the system:

- **ARCHITECTURE.md**: Overall system design, data flow, and best practices
- **auth.md**: Complete authentication system documentation
- **FORMS.md**: Form handling, validation, and server action integration
- **UI-FRAMEWORK.md**: UI components, loading states, and modals
- **server-actions/README.md**: Server action patterns and implementation

## Quick Start

1. Clone the repository
2. Copy `.env.example` to `.env.local`
3. Configure your Supabase credentials
4. Run the development server:

```bash
npm install
npm run dev
```

## Development Workflow

1. Server Components First

   - Use server components by default
   - Only use client components when necessary

2. Type-Safe Actions

   - Use factory patterns for server actions
   - Implement middleware for cross-cutting concerns
   - Validate with Zod schemas

3. Error Handling
   - Use `AppError` and `AuthError` classes
   - Implement error boundaries
   - Use structured logging
   - Provide user-friendly error messages

## Deployment

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Fwith-supabase&project-name=nextjs-with-supabase&repository-name=nextjs-with-supabase&demo-title=nextjs-with-supabase&demo-description=This+starter+configures+Supabase+Auth+to+use+cookies%2C+making+the+user%27s+session+available+throughout+the+entire+Next.js+app+-+Client+Components%2C+Server+Components%2C+Route+Handlers%2C+Server+Actions+and+Middleware.&demo-url=https%3A%2F%2Fdemo-nextjs-with-supabase.vercel.app%2F&external-id=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Fwith-supabase&demo-image=https%3A%2F%2Fdemo-nextjs-with-supabase.vercel.app%2Fopengraph-image.png)

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Project Structure

```
27c-next/
├── app/                    # Next.js app directory
├── components/            # React components
├── core/                  # Core application logic
│   ├── actions/          # Server actions
│   ├── errors/           # Error handling
│   ├── forms/            # Form handling
│   ├── schemas/          # Validation schemas
│   └── services/         # Application services
├── lib/                   # Shared utilities
│   ├── types/            # TypeScript types
│   └── utils/            # Utility functions
├── config/               # Configuration
│   └── constants/        # Application constants
├── public/               # Static assets
└── docs/                 # Documentation
```

### Key Directories

- `core/`: Contains the core application logic and business rules

  - `actions/`: Server actions for handling form submissions and API requests
  - `services/`: Application services (auth, database, etc.)
  - `errors/`: Error handling and custom error classes
  - `schemas/`: Zod validation schemas
  - `forms/`: Form handling logic and validation

- `lib/`: Shared utilities and types

  - `types/`: TypeScript type definitions
  - `utils/`: Utility functions and helpers
  - `analytics/`: Analytics utilities
  - `seo/`: SEO utilities
  - `logger/`: Logging utilities

- `config/`: Application configuration
  - `constants/`: Application-wide constants
  - `env.ts`: Environment configuration
  - `metadata.ts`: Site metadata
  - `navigation.ts`: Navigation configuration

### Best Practices

1. **Feature Organization**

   - Keep related code together
   - Use barrel files (index.ts) for exports
   - Place types close to their implementations

2. **Code Structure**

   - Use absolute imports with `@/` prefix
   - Keep components small and focused
   - Follow the single responsibility principle

3. **Type Safety**

   - Use TypeScript strictly
   - Define interfaces for all data structures
   - Use Zod for runtime validation

4. **Error Handling**

   - Use custom error classes
   - Provide user-friendly error messages
   - Log errors appropriately

5. **Testing**
   - Write tests close to implementation
   - Use meaningful test descriptions
   - Follow the Arrange-Act-Assert pattern
