# Supabase Queries Cleanup Plan

## Current State

The project currently has a mix of old and new patterns:

1. Legacy flat files:
   - `auth.ts` - Contains both server and client queries
   - `users.ts` - Contains both server and client queries
   - `organizations.ts` - Contains both server and client queries

2. Modern split pattern:
   - `auth/` folder:
     - `client.ts` - Contains only client queries
     - `server.ts` - Contains only server queries with "use server" directive
     - `index.ts` - Re-exports both client and server

## Cleanup Steps

1. **Short-term (current PR)**:
   - ✅ Fixed immediate "use server" errors with server.ts and server-utils.ts
   - ✅ Updated imports across the codebase
   - ✅ Fixed OAuth methods to work with Next.js server actions

2. **Medium-term**:
   - Gradually deprecate the legacy flat files:
     - Add deprecation warnings to the old patterns
     - Update imports in components to use the new pattern
     - Eventually remove the legacy files

3. **Long-term structure**:
   - Continue with the pattern established in the `auth/` folder:
   - Create users/ folder:
     - `client.ts`
     - `server.ts`
     - `index.ts`
   - Create organizations/ folder:
     - `client.ts`
     - `server.ts`
     - `index.ts`

## Files that can be deleted (after updating imports)

No files should be deleted immediately. Instead:

1. Mark files as deprecated:
   ```typescript
   /**
    * @deprecated Use client.ts or server.ts directly instead
    */
   ```

2. Once all component imports are updated:
   - `auth.ts` can be deleted (already have auth/ folder)
   - `users.ts` can be converted to the folder structure
   - `organizations.ts` can be converted to the folder structure

## Implementation Guide

1. For each new pattern, ensure:
   - `server.ts` files only contain async functions with "use server" directive
   - `client.ts` files contain client-side queries
   - `index.ts` provides a clean re-export API

2. When updating components:
   - Use `import { clientAuth } from "@/core/supabase/queries/auth/client"` for client components
   - Use `import { getUser } from "@/core/supabase/queries/auth/server"` for server components
