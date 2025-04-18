# Codebase Reorganization Plan

## Current Issues

1. Duplicate action handling between `app/actions.ts` and `lib/server-actions`
2. Scattered core functionality across multiple directories
3. Inconsistent organization of errors, schemas, and forms
4. Mixed client/server code organization

## New Structure

### 1. Actions Consolidation

```
lib/
  └── actions/
      ├── client/           # Client-side actions
      │   └── index.ts
      └── server/           # Server actions (merge app/actions.ts here)
          ├── auth/
          ├── posts/
          ├── users/
          └── index.ts
```

### 2. Core Services Layer

```
core/                       # New core services directory
  ├── supabase/            # Move from services/
  │   ├── client.ts
  │   ├── server.ts
  │   ├── middleware.ts
  │   └── queries/
  ├── schemas/             # Move from lib/schemas
  │   ├── shared/         # Shared between client/server
  │   ├── client/
  │   └── server/
  ├── forms/              # Move from lib/forms
  │   ├── validators/
  │   └── hooks/
  └── errors/             # Move from lib/errors
      ├── base/
      │   └── AppError.ts
      ├── auth/
      │   └── AuthError.ts
      ├── data/
      │   └── DatabaseError.ts
      └── api/
          └── ApiError.ts
```

## Implementation Steps

1. **Create Core Directory Structure**

   - Create `core/` directory at root level
   - Set up subdirectories for each service

2. **Move Supabase Services**

   - Move files from `services/supabase/` to `core/supabase/`
   - Update import paths in all files
   - Delete old directory

3. **Reorganize Errors**

   - Create new error directory structure in `core/errors/`
   - Move and reorganize error files
   - Update import paths

4. **Consolidate Actions**

   - Move server actions from `app/actions.ts` to appropriate files in `lib/actions/server/`
   - Update client actions organization
   - Remove `app/actions.ts`

5. **Update Schema Organization**

   - Move schemas to `core/schemas/`
   - Split into client/server/shared
   - Update import paths

6. **Move Forms**
   - Relocate forms to `core/forms/`
   - Update import paths

## Benefits

1. Clear separation of concerns
2. Better organized core services
3. Consistent import paths (`@/core/*`)
4. Reduced duplication
5. Better type safety and error handling
6. Clearer client/server boundaries

## Post-Migration Tasks

1. Update documentation
2. Update import paths in all components
3. Add index files for better exports
4. Update tsconfig paths
5. Test all functionality
6. Update CI/CD if needed
