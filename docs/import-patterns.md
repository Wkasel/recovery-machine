# Import Patterns & Barrel Export Guidelines

## Overview

This project uses a comprehensive barrel export system to simplify imports and improve code organization. This document outlines the patterns and guidelines for using the barrel export system effectively.

## Barrel Export Structure

```
components/
├── index.ts                 # Root barrel - exports everything
├── ui/index.ts             # UI components (shadcn/ui based)
├── layout/index.ts         # Layout & spacing components
├── typography/index.ts     # Typography components
├── auth/index.ts           # Authentication components
├── admin/index.ts          # Admin panel components
├── nav/index.ts            # Navigation components
├── booking/index.ts        # Booking flow components
├── sections/index.ts       # Page sections
├── seo/index.ts            # SEO components
├── analytics/index.ts      # Analytics components
├── error-boundary/index.ts # Error handling components
├── payments/index.ts       # Payment components
├── modals/index.ts         # Modal components
├── dashboard/index.ts      # Dashboard components
├── social/index.ts         # Social media components
├── performance/index.ts    # Performance tracking
├── reviews/index.ts        # Review components
├── instagram/index.ts      # Instagram integration
├── JsonLd/index.ts         # Structured data
└── form/index.ts           # Custom form components

lib/
└── index.ts                # Utilities, types, hooks, services
```

## Import Patterns

### ✅ Preferred Patterns

```typescript
// Root barrel import (recommended for most cases)
import { Button, Card, Heading, Text, Stack, Inline } from '@/components'

// Category-specific barrel import (when you need many components from one category)
import { Button, Card, Input, Badge } from '@/components/ui'

// Lib barrel import
import { cn, type User, useAuth, createUser } from '@/lib'
```

### ❌ Anti-patterns (avoid these)

```typescript
// Direct component imports
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Heading } from '@/components/typography/Typography'

// Mixed imports
import { Button } from '@/components'
import { Card } from '@/components/ui/card'
```

## Component Categories

### UI Components
Base components from shadcn/ui with enhanced variants:
- Form components: `Button`, `Input`, `Textarea`, `Label`, `Checkbox`, etc.
- Layout: `Card`, `Separator`, `AspectRatio`, `ScrollArea`
- Navigation: `Tabs`, `NavigationMenu`, `Breadcrumb`
- Feedback: `Badge`, `Alert`, `Progress`, `Skeleton`
- Overlays: `Dialog`, `Sheet`, `AlertDialog`, `Drawer`
- Data display: `Table`, `Avatar`, `Chart`, `Carousel`

### Layout Components
Spacing and grid systems:
- `Stack` - Vertical spacing
- `Inline` - Horizontal spacing
- `Container` - Consistent max-width and padding
- `Spacer` - Manual spacing
- `Grid`, `GridItem` - Grid layouts

### Typography Components
Text and heading components:
- Core: `Heading`, `Text`, `Code`, `Link`
- Semantic: `H1`, `H2`, `H3`, `H4`, `H5`, `H6`
- Text variants: `Paragraph`, `Lead`, `Large`, `Small`, `Muted`, `Caption`

### Feature Components
Business logic components organized by feature:
- `auth/*` - Authentication flows
- `booking/*` - Booking process
- `admin/*` - Admin panel
- `payments/*` - Payment processing

## TypeScript Integration

### Exporting Types

```typescript
// In component files
export type ButtonProps = {
  // ...
}

export interface CardProps {
  // ...
}

// In barrel exports
export type { ButtonProps, CardProps } from './button'

// Usage
import type { ButtonProps } from '@/components'
```

### Variant Exports

```typescript
// Export variants for external use
export { buttonVariants, cardVariants } from '@/components'

// Usage
import { buttonVariants, cva } from '@/components'
```

## Tree Shaking

The barrel export system is designed to support tree shaking:

```typescript
// This will only bundle the Button component
import { Button } from '@/components'

// Not the entire components library
```

### ESLint Rules

Enable these ESLint rules to enforce barrel imports:

```javascript
{
  "rules": {
    "no-restricted-imports": [
      "error",
      {
        "patterns": [
          "@/components/ui/*",
          "@/components/layout/*", 
          "@/components/typography/*"
        ]
      }
    ]
  }
}
```

## Performance Considerations

### Bundle Size
- Barrel exports are tree-shakeable
- Only imported components are included in bundles
- Use specific category barrels for large feature sets

### Development Experience
- Single import source reduces cognitive load
- Auto-completion works across all exports
- Consistent import patterns across the codebase

## Migration Guide

### From Direct Imports

**Before:**
```typescript
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Heading } from '@/components/typography/Typography'
import { Stack } from '@/components/layout/Spacing'
```

**After:**
```typescript
import { Button, Card, CardContent, Heading, Stack } from '@/components'
```

### Automated Migration

Use these find/replace patterns in your IDE:

1. Replace `@/components/ui/` with `@/components`
2. Replace `@/components/layout/` with `@/components`
3. Replace `@/components/typography/` with `@/components`
4. Consolidate multiple imports from `@/components`

## Best Practices

### 1. Use Root Barrel for Mixed Imports
```typescript
// ✅ Good - single import for mixed components
import { Button, Heading, Stack, useAuth } from '@/components'
```

### 2. Use Category Barrels for Feature Work
```typescript
// ✅ Good - when working heavily with UI components
import { 
  Button, 
  Card, 
  Input, 
  Badge, 
  Dialog,
  Form 
} from '@/components/ui'
```

### 3. Group Related Imports
```typescript
// ✅ Good - logical grouping
import {
  // Layout
  Stack,
  Container,
  
  // Typography  
  Heading,
  Text,
  
  // UI
  Button,
  Card
} from '@/components'
```

### 4. Consistent Import Order
```typescript
// 1. React & external libraries
import React from 'react'
import { NextPage } from 'next'

// 2. Internal components (barrel imports)
import { Button, Heading } from '@/components'

// 3. Internal utilities
import { cn } from '@/lib'

// 4. Relative imports
import './styles.css'
```

## Troubleshooting

### Common Issues

**Issue:** Import not found
```typescript
// ❌ Component not exported from barrel
import { MyComponent } from '@/components'
```

**Solution:** Check if component is exported in the appropriate barrel file.

**Issue:** Circular dependencies
```typescript
// ❌ Component importing from its own barrel
import { Button } from '@/components' // inside button.tsx
```

**Solution:** Use direct imports within the components directory.

**Issue:** Large bundle size
```typescript
// ❌ Importing unused category
import * as Components from '@/components'
```

**Solution:** Import only what you need.

## VS Code Integration

Add these settings for better development experience:

```json
{
  "typescript.preferences.includePackageJsonAutoImports": "auto",
  "typescript.suggest.autoImports": true,
  "editor.codeActionsOnSave": {
    "source.organizeImports": true
  }
}
```

## Conclusion

The barrel export system provides:
- ✅ Simplified imports
- ✅ Better developer experience  
- ✅ Consistent patterns
- ✅ Tree-shaking support
- ✅ Easier refactoring
- ✅ Reduced cognitive load

Follow these patterns to maintain a clean and scalable import structure throughout the application.