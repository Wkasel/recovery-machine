# Next.js and Supabase Enhanced Starter Kit

A production-ready starter kit built with Next.js 14 and Supabase, featuring enhanced type safety, server actions, and comprehensive authentication.

## Enhanced Features

- **Type-Safe Server Actions**

  - Middleware-based action system
  - Role-based access control
  - Error boundary integration

- **Authentication & Authorization**

  - Supabase Auth with SSR support
  - Protected routes and API endpoints
  - Role-based access control
  - Admin middleware

- **Modern Architecture**

  - Next.js App Router
  - Server Components by default
  - Edge-ready middleware
  - See [Architecture Documentation](./docs/ARCHITECTURE.md)

- **Developer Experience**

  - TypeScript strict mode
  - Comprehensive error handling
  - Structured logging system
  - Proper development tooling

- **UI/UX**

  - Responsive navigation system
  - Dark mode support
  - Loading states
  - Error boundaries
  - [shadcn/ui](https://ui.shadcn.com/) components

- **Security**
  - HTTP security headers
  - CORS configuration
  - Rate limiting
  - Input validation
  - Environment variable management

## Quick Start

1. Clone the repository
2. Copy `.env.example` to `.env.local`
3. Configure your Supabase credentials
4. Run the development server:

```bash
npm install
npm run dev
```

## Documentation

- [Architecture & Best Practices](./docs/ARCHITECTURE.md)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)

## Development Workflow

1. Server Components First

   - Use server components by default
   - Only use client components when necessary

2. Type-Safe Actions

   - Implement server actions for data mutations
   - Use middleware for cross-cutting concerns

3. Error Handling
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
