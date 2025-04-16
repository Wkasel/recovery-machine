# Debug Utilities

## Overview

The debug utilities provide a development-only toolset for inspecting and debugging Supabase authentication state in the browser. These utilities are automatically initialized in development mode and can be accessed via the browser console.

## Usage

The debug utilities are available in the browser console via `window.__DEBUG__`:

```typescript
// Get current session
await window.__DEBUG__.getSession();

// Get current user
await window.__DEBUG__.getUser();

// Refresh the session
await window.__DEBUG__.refreshSession();

// Dump all session info
window.__DEBUG__.dumpSessionInfo();
```

## Features

- **Session Inspection**: View current auth session details
- **User Information**: Access current user data
- **Session Management**: Refresh auth sessions
- **Development Only**: Automatically disabled in production
- **Type-Safe**: Full TypeScript support
- **Non-Intrusive**: Zero impact on production builds

## Implementation

The debug utilities are implemented using:

- React hooks for lifecycle management
- Client-side only execution
- Automatic initialization via `DebugProvider`
- Environment-aware configuration

## Security

The debug utilities:

- Only run in development mode
- Are completely stripped from production builds
- Don't expose sensitive credentials
- Use existing auth sessions

## Development

To modify or extend the debug utilities:

1. Edit `lib/hooks/useDebug.ts` for core functionality
2. Update `components/debug-provider.tsx` for initialization
3. Ensure changes are development-only
4. Maintain type safety

# Hooks

> TanStack Query hooks and config are now in `lib/query/`.
