# Design System Architecture

## Overview

This design system provides a comprehensive foundation for building consistent, accessible, and maintainable user interfaces in the Recovery Machine application.

## Core Principles

### 1. **Token-Based Design**
- All visual properties use design tokens from a centralized system
- CSS custom properties enable dynamic theming
- TypeScript types ensure type safety

### 2. **Component Variants**
- All components use `class-variance-authority` for variant management
- Consistent API across all components
- Extensible design patterns

### 3. **Semantic Color System**
- Light/dark mode support with CSS custom properties
- Semantic naming (primary, secondary, accent, destructive)
- Automatic contrast handling

### 4. **Composable Architecture**
- Small, focused components that can be combined
- Layout primitives (Container, Stack, Spacer, Grid, Flex)
- Enhanced UI components with additional functionality

## Architecture Components

### Design Tokens (`src/lib/design-tokens.ts`)
Centralized token system providing:
- Spacing scale (0-96)
- Typography hierarchy 
- Border radius values
- Shadow system
- Animation timings
- Z-index scale
- Component-specific tokens

### Layout System (`src/components/layout/`)

#### Container
```tsx
<Container size="lg" padding="md">
  Content with consistent max-width and padding
</Container>
```

#### Stack (VStack/HStack)
```tsx
<VStack spacing="lg" align="center">
  <div>Item 1</div>
  <div>Item 2</div>
</VStack>
```

#### Grid & Flex
```tsx
<Grid cols="3" gap="md" responsive>
  {items.map(item => <div key={item.id}>{item}</div>)}
</Grid>
```

#### Spacer
```tsx
<Spacer size="lg" axis="y" />
```

### Enhanced UI Components (`src/components/ui/`)

#### Enhanced Button
- Comprehensive variant system
- Loading states with animations
- Icon support (start/end)
- Size variants (xs to xl)
- Specialized components (IconButton, LoadingButton)

#### Enhanced Input
- Multiple variants (default, ghost, underline)
- State management (error, warning, success)
- Icon support with positioning
- Helper text and error messaging
- Specialized inputs (SearchInput, PasswordInput)

### Theme System (`src/components/theme/`)

#### ThemeProvider
```tsx
<ThemeProvider defaultTheme="system" enableSystem>
  <App />
</ThemeProvider>
```

#### Theme Utilities
- `useThemeConfig()` hook for advanced theme management
- Theme toggle utilities
- Icon mapping for theme states

### Authentication Components (`src/components/auth/`)

#### AuthForm
- Unified sign-in/sign-up component
- Form validation with Zod schemas
- Error handling and loading states
- OAuth integration ready
- Consistent styling with design system

## Component Design Patterns

### 1. **Variant Props Pattern**
```tsx
interface ComponentProps extends VariantProps<typeof componentVariants> {
  // Additional props
}

const componentVariants = cva("base-classes", {
  variants: {
    size: { sm: "...", md: "...", lg: "..." },
    variant: { default: "...", outline: "..." },
  }
});
```

### 2. **Forwarded Refs Pattern**
```tsx
const Component = React.forwardRef<HTMLElement, ComponentProps>(
  ({ className, ...props }, ref) => (
    <element ref={ref} className={cn(componentVariants({ ...props }), className)} />
  )
);
```

### 3. **Composition Pattern**
```tsx
// Base component with variants
const Card = ({ variant, size, ...props }) => (...)

// Specialized components
const CardHeader = ({ spacing, padding, ...props }) => (...)
const CardContent = ({ padding, spacing, ...props }) => (...)
```

## File Organization

```
src/
├── components/
│   ├── layout/           # Layout primitives
│   │   ├── Container.tsx
│   │   ├── Stack.tsx
│   │   ├── Spacer.tsx
│   │   └── Grid.tsx
│   ├── ui/              # Enhanced UI components
│   │   ├── enhanced-button.tsx
│   │   ├── enhanced-input.tsx
│   │   └── ...
│   ├── theme/           # Theme components
│   │   └── ThemeProvider.tsx
│   ├── auth/            # Authentication components
│   │   └── AuthForm.tsx
│   └── index.ts         # Barrel exports
├── lib/
│   └── design-tokens.ts # Design token definitions
└── styles/
    └── design-system.css # CSS custom properties & base styles
```

## Usage Guidelines

### 1. **Import from Barrel Exports**
```tsx
import { Container, VStack, Button, Input } from "@/src/components";
```

### 2. **Use Design Tokens**
```tsx
// Prefer design tokens over arbitrary values
<div className="p-4">        // Good: uses spacing-4 token
<div className="p-[17px]">   // Avoid: arbitrary value
```

### 3. **Leverage Component Variants**
```tsx
<Button variant="outline" size="lg" loading={isSubmitting}>
  Submit
</Button>
```

### 4. **Compose with Layout Primitives**
```tsx
<Container size="lg">
  <VStack spacing="xl" align="center">
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>Title</CardTitle>
      </CardHeader>
      <CardContent>
        Content
      </CardContent>
    </Card>
  </VStack>
</Container>
```

## Theme Implementation

### CSS Custom Properties
All colors use CSS custom properties for dynamic theming:

```css
:root {
  --primary: 160 84% 39%;
  --primary-foreground: 0 0% 98%;
  /* ... */
}

.dark {
  --primary: 160 84% 39%;
  --primary-foreground: 222.2 84% 4.9%;
  /* ... */
}
```

### Theme-Aware Components
Components automatically adapt to theme changes:

```tsx
// Automatically uses theme colors
<Button variant="primary">Themed Button</Button>
```

## Accessibility

### Built-in Accessibility Features
- Semantic HTML elements
- ARIA labels and descriptions
- Focus management
- Color contrast compliance
- Screen reader support

### Focus Management
```tsx
<Button
  variant="outline"
  className="focus-visible:ring-2 focus-visible:ring-primary"
>
  Accessible Button
</Button>
```

## Performance Optimizations

### Efficient Re-renders
- Forwarded refs prevent unnecessary re-renders
- Memoized variant calculations
- Minimal CSS-in-JS usage

### Bundle Size
- Tree-shakeable exports
- Minimal dependencies
- Optimized Tailwind CSS output

## Migration Strategy

### From Inline Styles
```tsx
// Before
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">

// After  
<Container>
  <HStack justify="between" align="center">
</Container>
```

### From Custom Components
```tsx
// Before
<CustomButton className="bg-blue-500 hover:bg-blue-600">

// After
<Button variant="primary">
```

## Extension Points

### Adding New Variants
```tsx
const buttonVariants = cva("...", {
  variants: {
    variant: {
      // Add new variant
      brand: "bg-brand-500 text-white hover:bg-brand-600",
    }
  }
});
```

### Custom Component Creation
```tsx
const MyComponent = cva("base-classes", {
  variants: { /* your variants */ }
});

export interface MyComponentProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof myComponentVariants> {}
```

## Best Practices

1. **Always use design tokens** for spacing, colors, and typography
2. **Prefer composition** over complex prop APIs
3. **Use semantic variants** (primary, secondary) over visual ones (blue, red)
4. **Implement loading states** for async actions
5. **Include error states** for form inputs
6. **Test with both themes** (light/dark)
7. **Validate accessibility** with screen readers
8. **Document component APIs** with TypeScript

## Future Enhancements

1. **Motion System**: Animation presets and transitions
2. **Form Components**: Advanced form primitives
3. **Data Display**: Table, List, and Card variants
4. **Navigation**: Menu, Breadcrumb, and Sidebar components
5. **Feedback**: Toast, Modal, and Alert systems
6. **Layout Templates**: Page layouts and patterns