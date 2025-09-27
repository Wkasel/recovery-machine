# Design System Implementation Guide

## Overview

This guide demonstrates how to implement and use the comprehensive design system built for the Recovery Machine application. The system eliminates inline styles, promotes consistency, and provides a maintainable foundation for UI development.

## Quick Start

### Installation & Setup

1. **Import components from the design system:**
```tsx
import { 
  Container, 
  VStack, 
  HStack, 
  Button, 
  Card,
  Input 
} from "@/src/components";
```

2. **Use layout primitives for structure:**
```tsx
export function MyComponent() {
  return (
    <Container size="lg">
      <VStack gap="xl">
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>My Feature</CardTitle>
          </CardHeader>
          <CardContent>
            <VStack gap="md">
              <Input label="Email" type="email" />
              <Button variant="primary" fullWidth>
                Submit
              </Button>
            </VStack>
          </CardContent>
        </Card>
      </VStack>
    </Container>
  );
}
```

## Component Categories

### 1. Layout Components

#### Container
Provides consistent max-width and padding across different screen sizes.

```tsx
// Different container sizes
<Container size="sm">Small container</Container>
<Container size="lg">Large container</Container>
<Container size="7xl">Extra large container</Container>

// Custom padding
<Container padding="none">No padding</Container>
<Container padding="xl">Extra padding</Container>
```

#### Stack Components
Flexbox-based layout with consistent spacing.

```tsx
// Vertical stack
<VStack gap="lg" align="center">
  <div>Item 1</div>
  <div>Item 2</div>
</VStack>

// Horizontal stack
<HStack gap="md" justify="between">
  <div>Left item</div>
  <div>Right item</div>
</HStack>

// Custom alignment and spacing
<Stack direction="row" gap="xl" align="baseline" justify="center">
  <div>Custom stack</div>
</Stack>
```

#### Grid System
Responsive grid with consistent gutters.

```tsx
// Responsive 3-column grid
<Grid cols="3" gap="lg">
  {items.map(item => (
    <Card key={item.id}>{item.content}</Card>
  ))}
</Grid>

// Non-responsive grid
<Grid cols="4" responsive={false} gap="sm">
  {/* Fixed 4 columns */}
</Grid>
```

#### Spacer
Flexible spacing component for fine-tuned layouts.

```tsx
// Vertical space
<VSpacer size="lg" />

// Horizontal space
<HSpacer size="md" />

// Custom spacing
<Spacer customSize="2rem" axis="y" />
```

### 2. Enhanced UI Components

#### Enhanced Button
Extended button component with comprehensive variants and features.

```tsx
import { Button, IconButton } from "@/src/components/ui/enhanced-button";

// Variants
<Button variant="primary">Primary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>

// Sizes
<Button size="xs">Extra Small</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>

// With icons
<Button startIcon={<Plus />}>Add Item</Button>
<Button endIcon={<ArrowRight />}>Continue</Button>

// Loading state
<Button loading={isSubmitting} loadingText="Saving...">
  Save Changes
</Button>

// Icon-only button
<IconButton 
  icon={<Search />} 
  aria-label="Search" 
  variant="outline" 
/>

// Full width
<Button fullWidth>Full Width Button</Button>
```

#### Enhanced Input
Advanced input component with states, icons, and variants.

```tsx
import { Input, PasswordInput, SearchInput } from "@/src/components/ui/enhanced-input";

// Basic input with label
<Input 
  label="Email Address"
  placeholder="Enter your email"
  helperText="We'll never share your email"
/>

// With icons
<Input 
  label="Search"
  startIcon={<Search />}
  placeholder="Search products..."
/>

// Error state
<Input 
  label="Username"
  errorText="Username is already taken"
  state="error"
/>

// Success state
<Input 
  label="Valid Field"
  state="success"
  helperText="This field is valid"
/>

// Variants
<Input variant="ghost" placeholder="Ghost input" />
<Input variant="underline" placeholder="Underline only" />

// Specialized inputs
<PasswordInput label="Password" />
<SearchInput placeholder="Search..." />
```

### 3. Card System

The card system provides flexible containers with multiple variants and composition options.

```tsx
// Basic card
<Card variant="default">
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>

// Card variants
<Card variant="elevated">Enhanced shadows</Card>
<Card variant="interactive">Hover effects</Card>
<Card variant="success">Success styling</Card>
<Card variant="warning">Warning styling</Card>
<Card variant="danger">Error styling</Card>

// Card sizes and customization
<Card size="lg" rounded="xl" overflow="hidden">
  <CardImage src="/image.jpg" alt="Card image" aspectRatio="video" />
  <CardContent>
    <p>Content with image</p>
  </CardContent>
</Card>
```

### 4. Form Components

#### Auth Forms
Pre-built authentication forms with validation.

```tsx
import { AuthForm, SignInForm, SignUpForm } from "@/src/components/auth/AuthForm";

// Sign-in form
<SignInForm 
  onSubmit={handleSignIn}
  loading={isLoading}
  error={error}
/>

// Sign-up form  
<SignUpForm
  onSubmit={handleSignUp}
  loading={isLoading}
  error={error}
/>

// Generic auth form
<AuthForm
  mode="signin"
  onSubmit={handleAuth}
  loading={isLoading}
/>
```

## Design Patterns

### 1. **Consistent Spacing**
Use design tokens for all spacing decisions:

```tsx
// ✅ Good: Using design system spacing
<VStack gap="lg">
  <div className="p-4">Content</div>
</VStack>

// ❌ Avoid: Arbitrary spacing
<div className="mb-[17px] mt-[23px]">Content</div>
```

### 2. **Component Composition**
Build complex layouts by composing simple components:

```tsx
// ✅ Good: Component composition
<Container size="lg">
  <VStack gap="xl">
    <Card variant="elevated">
      <CardHeader>
        <HStack justify="between" align="center">
          <CardTitle>Dashboard</CardTitle>
          <Button variant="outline" size="sm">Settings</Button>
        </HStack>
      </CardHeader>
      <CardContent>
        <Grid cols="3" gap="md">
          {metrics.map(metric => (
            <Card key={metric.id} variant="default">
              <CardContent padding="md">
                <VStack gap="sm" align="center">
                  <span className="text-display-sm">{metric.value}</span>
                  <span className="text-muted-foreground">{metric.label}</span>
                </VStack>
              </CardContent>
            </Card>
          ))}
        </Grid>
      </CardContent>
    </Card>
  </VStack>
</Container>

// ❌ Avoid: Custom div layouts with inline styles
<div className="max-w-4xl mx-auto px-4 py-8">
  <div className="bg-white shadow-lg rounded-lg p-6 mb-8">
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <button className="px-3 py-1 border rounded">Settings</button>
    </div>
    <div className="grid grid-cols-3 gap-4">
      {/* Custom grid implementation */}
    </div>
  </div>
</div>
```

### 3. **Semantic Variants**
Use semantic variants instead of visual descriptors:

```tsx
// ✅ Good: Semantic variants
<Button variant="destructive">Delete Account</Button>
<Card variant="warning">Important Notice</Card>
<Input state="error" errorText="Invalid input" />

// ❌ Avoid: Visual descriptors
<Button className="bg-red-500 text-white">Delete</Button>
<Card className="border-yellow-400 bg-yellow-50">Notice</Card>
```

### 4. **Theme Compatibility**
Ensure all custom styles work with both light and dark themes:

```tsx
// ✅ Good: Theme-aware styling
<div className="bg-background text-foreground border border-border">
  Theme-compatible content
</div>

// ❌ Avoid: Hard-coded colors
<div className="bg-white text-black border-gray-300">
  Only works in light mode
</div>
```

## Migration Strategy

### Step 1: Layout Migration
Replace custom div layouts with design system components:

```tsx
// Before
<div className="max-w-6xl mx-auto px-4">
  <div className="flex flex-col space-y-8">
    <div className="flex justify-between items-center">
      <h1>Title</h1>
      <button>Action</button>
    </div>
  </div>
</div>

// After
<Container size="6xl">
  <VStack gap="2xl">
    <HStack justify="between" align="center">
      <H1>Title</H1>
      <Button>Action</Button>
    </HStack>
  </VStack>
</Container>
```

### Step 2: Component Migration
Replace basic HTML elements with enhanced components:

```tsx
// Before
<button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
  Submit
</button>
<input 
  type="email" 
  className="border border-gray-300 rounded px-3 py-2 w-full"
  placeholder="Email"
/>

// After
<Button variant="primary">Submit</Button>
<Input 
  type="email" 
  label="Email"
  placeholder="Enter your email"
/>
```

### Step 3: Card Migration
Replace custom card implementations:

```tsx
// Before
<div className="bg-white shadow-md rounded-lg p-6 border">
  <h3 className="text-lg font-semibold mb-2">Card Title</h3>
  <p className="text-gray-600 mb-4">Description</p>
  <div className="flex justify-end space-x-2">
    <button className="px-4 py-2 border rounded">Cancel</button>
    <button className="px-4 py-2 bg-blue-500 text-white rounded">Save</button>
  </div>
</div>

// After
<Card variant="default">
  <CardHeader>
    <CardTitle size="lg">Card Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardFooter justify="end" gap="sm">
    <Button variant="outline">Cancel</Button>
    <Button variant="primary">Save</Button>
  </CardFooter>
</Card>
```

## Performance Benefits

### 1. **Reduced Bundle Size**
- Reusable components reduce code duplication
- Tree-shakeable exports
- Optimized CSS generation

### 2. **Better Caching**
- Consistent class names improve CSS caching
- Component-level code splitting
- Reduced runtime style calculations

### 3. **Improved Development Speed**
- Pre-built components accelerate development
- Consistent APIs reduce learning curve
- Built-in accessibility features

## Testing Strategy

### Component Testing
```tsx
import { render, screen } from '@testing-library/react';
import { Container, VStack, Button } from '@/src/components';

test('renders design system components correctly', () => {
  render(
    <Container size="lg">
      <VStack gap="md">
        <Button variant="primary">Test Button</Button>
      </VStack>
    </Container>
  );
  
  expect(screen.getByRole('button', { name: 'Test Button' })).toBeInTheDocument();
});
```

### Theme Testing
```tsx
test('components adapt to theme changes', () => {
  const { rerender } = render(
    <ThemeProvider theme="light">
      <Button variant="primary">Button</Button>
    </ThemeProvider>
  );
  
  // Test light theme styles
  expect(screen.getByRole('button')).toHaveClass('bg-primary');
  
  rerender(
    <ThemeProvider theme="dark">
      <Button variant="primary">Button</Button>
    </ThemeProvider>
  );
  
  // Verify dark theme adaptation
  expect(screen.getByRole('button')).toHaveClass('bg-primary');
});
```

## Troubleshooting

### Common Issues

1. **Import Errors**
   - Ensure imports are from `@/src/components`
   - Check barrel export configuration

2. **Styling Conflicts**
   - Avoid mixing design system components with custom CSS
   - Use component variants instead of className overrides

3. **Theme Issues**
   - Verify ThemeProvider is wrapping your app
   - Check CSS custom property definitions

4. **TypeScript Errors**
   - Update component prop types
   - Use VariantProps for extending components

### Best Practices Checklist

- [ ] Use layout components for structure
- [ ] Prefer component variants over custom styling
- [ ] Test with both light and dark themes
- [ ] Validate accessibility with screen readers
- [ ] Use semantic naming for variants
- [ ] Implement loading states for async actions
- [ ] Include error handling in forms
- [ ] Document custom component APIs

## Future Roadmap

1. **Enhanced Animation System**
   - Motion presets for common transitions
   - Reduced motion support
   - Performance-optimized animations

2. **Advanced Form Components**
   - Multi-step forms
   - File upload components
   - Form validation utilities

3. **Data Display Components**
   - Advanced table components
   - Chart integration
   - List and tree components

4. **Navigation Components**
   - Sidebar components
   - Breadcrumb navigation
   - Tab navigation

5. **Feedback Components**
   - Toast notifications
   - Modal dialogs
   - Loading skeletons