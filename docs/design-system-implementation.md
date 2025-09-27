# Design System Implementation Guide

## Overview

This guide documents the comprehensive design tokens system and component architecture implemented for the Recovery Machine application. The system provides a scalable, type-safe foundation for consistent design across the application.

## Architecture

### 1. Design Tokens System (`/src/lib/design-tokens.ts`)

**Base Tokens (Primitive Values):**
- Color palettes with semantic naming
- Typography scale with proper line heights
- Spacing system based on 4px grid
- Border radius scale
- Shadow system
- Animation durations and easing
- Z-index hierarchy

**Semantic Tokens (Contextual Values):**
- Light/dark theme color mappings
- Component size variants
- Layout breakpoints and containers

**Type Safety:**
- Full TypeScript definitions for all tokens
- Utility functions for token access
- Type-safe color, typography, and spacing utilities

### 2. Enhanced Theme Provider (`/src/components/theme/ThemeProvider.tsx`)

**Features:**
- Smooth theme transitions with CSS custom properties
- System preference detection
- Enhanced hooks for token access
- Responsive breakpoint detection
- Theme-aware color utilities

**Hooks Available:**
- `useTheme()` - Enhanced theme management
- `useTokens()` - Direct token access
- `useBreakpoint()` - Responsive utilities
- `useThemeColors()` - Theme-aware colors

### 3. Layout Component System

#### Container Component (`/src/components/layout/Container.tsx`)
- Responsive container with max-width variants
- Configurable padding and content centering
- Semantic HTML element support (`section`, `main`, `article`)

```tsx
<Container size="xl" padding="responsive">
  <Section as="main" size="lg">
    Content here
  </Section>
</Container>
```

#### Stack Component (`/src/components/layout/Stack.tsx`)
- Flexible layout with direction, spacing, and alignment
- Responsive variants for mobile-first design
- Specialized components: `HStack`, `VStack`, `Center`

```tsx
<VStack spacing={6} align="center">
  <HStack spacing={4} justify="between" responsive>
    <div>Item 1</div>
    <div>Item 2</div>
  </HStack>
</VStack>
```

#### Grid Component (`/src/components/layout/Grid.tsx`)
- Full CSS Grid implementation with variants
- Responsive grid patterns
- Grid item positioning and spanning
- Preset layouts: `AutoGrid`, `MasonryGrid`

```tsx
<Grid cols={3} gap={6} responsive>
  <GridItem colSpan={2}>
    Main content
  </GridItem>
  <GridItem>
    Sidebar
  </GridItem>
</Grid>
```

#### Spacer Component (`/src/components/layout/Spacer.tsx`)
- Declarative spacing with axis control
- Flex spacer for dynamic layouts
- Size variants matching design system

```tsx
<VStack>
  <div>Content 1</div>
  <VerticalSpacer size={8} />
  <div>Content 2</div>
  <FlexSpacer />
  <div>Footer</div>
</VStack>
```

### 4. Enhanced UI Components

#### Button Component (Enhanced)
- Extended variant system with semantic variants
- Loading states with built-in spinner
- Icon support (left and right)
- Full width option
- Enhanced accessibility

**New Variants:**
- `gradient` - Gradient background
- `success`, `warning`, `info` - Semantic colors
- `ghost-primary`, `ghost-destructive` - Ghost variants
- `destructive-outline` - Outlined destructive variant

#### Card Component (Enhanced)
- Comprehensive variant system
- Multiple padding and spacing options
- Semantic card types (danger, warning, success, info)
- Interactive and elevated variants
- Additional components: `CardImage`, `CardActions`

**Enhanced Features:**
- Better spacing control
- Responsive variants
- Accessibility improvements
- Type-safe props

## Design System Features

### Color System
- **Base Colors:** Comprehensive color palette with 11 shades each
- **Semantic Colors:** Context-aware color tokens for both themes
- **Theme Support:** Automatic light/dark mode with smooth transitions
- **Accessibility:** WCAG AA compliant contrast ratios

### Typography
- **Scale:** Consistent typography scale from xs to 9xl
- **Hierarchy:** Display, heading, and body text variants
- **Line Heights:** Optimized for readability
- **Font Weights:** Full weight scale from thin to black

### Spacing
- **Grid System:** 4px base grid for consistent spacing
- **Geometric Scale:** Powers-of-two progression for harmonious layouts
- **Utilities:** Helper functions for spacing calculations

### Component Variants
- **Size System:** Consistent sizing across components (xs, sm, md, lg, xl)
- **State Variants:** Default, hover, active, disabled states
- **Semantic Variants:** Primary, secondary, destructive, success, warning, info
- **Interactive Variants:** Loading, pressed, focused states

## Usage Examples

### Basic Layout
```tsx
import { Container, VStack, Grid, GridItem } from '@/components/layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function PageLayout() {
  return (
    <Container size="xl" padding="responsive">
      <VStack spacing={8}>
        <Card variant="elevated" size="lg">
          <CardHeader>
            <CardTitle size="2xl">Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <Grid cols={3} gap={6} responsive>
              <GridItem>
                <Button variant="primary" size="lg" fullWidth>
                  Action 1
                </Button>
              </GridItem>
              <GridItem>
                <Button variant="outline" size="lg" fullWidth>
                  Action 2
                </Button>
              </GridItem>
              <GridItem>
                <Button variant="ghost" size="lg" fullWidth>
                  Action 3
                </Button>
              </GridItem>
            </Grid>
          </CardContent>
        </Card>
      </VStack>
    </Container>
  );
}
```

### Theme-Aware Components
```tsx
import { useThemeColors, useBreakpoint } from '@/components/theme/ThemeProvider';
import { tokens } from '@/lib/design-tokens';

export function ThemedComponent() {
  const { colors, getColor } = useThemeColors();
  const breakpoint = useBreakpoint();
  
  const primaryColor = getColor('primary');
  const spacing = tokens.base.spacing[4];
  
  return (
    <div 
      style={{ 
        backgroundColor: colors.background,
        color: colors.foreground,
        padding: spacing
      }}
    >
      <p>Current breakpoint: {breakpoint}</p>
      <p>Primary color: {primaryColor}</p>
    </div>
  );
}
```

### Responsive Design
```tsx
import { useBreakpoint } from '@/components/theme/ThemeProvider';
import { Grid, VStack } from '@/components/layout';

export function ResponsiveLayout() {
  const breakpoint = useBreakpoint();
  
  const isDesktop = ['lg', 'xl', '2xl'].includes(breakpoint);
  
  return isDesktop ? (
    <Grid cols={3} gap={6}>
      <div>Column 1</div>
      <div>Column 2</div>
      <div>Column 3</div>
    </Grid>
  ) : (
    <VStack spacing={4}>
      <div>Column 1</div>
      <div>Column 2</div>
      <div>Column 3</div>
    </VStack>
  );
}
```

## CSS Custom Properties Integration

The system maintains compatibility with the existing CSS custom properties in `/src/styles/design-system.css`:

- All semantic tokens map to CSS custom properties
- Theme switching updates properties dynamically
- Smooth transitions are applied automatically
- Accessibility preferences are respected

## Migration Guide

### From Tailwind Classes
```tsx
// Before
<div className="flex flex-col space-y-4 p-6 max-w-4xl mx-auto">

// After
<Container size="content">
  <VStack spacing={4} className="p-6">
```

### From Inline Styles
```tsx
// Before
<div style={{ marginTop: '2rem', padding: '1.5rem' }}>

// After
<VStack spacing={8}>
  <div className="p-6">
```

## Accessibility Features

- **Focus Management:** Proper focus indicators and keyboard navigation
- **Screen Reader Support:** ARIA labels and semantic HTML
- **Reduced Motion:** Respects `prefers-reduced-motion`
- **Color Contrast:** WCAG AA compliant color combinations
- **Touch Targets:** Minimum 44px touch targets on mobile

## Performance Considerations

- **CSS Custom Properties:** Efficient theme switching
- **Tree Shaking:** Only used components are included
- **TypeScript:** Compile-time optimization
- **Minimal Bundle Impact:** Lightweight component variants

## Browser Support

- **Modern Browsers:** Chrome 88+, Firefox 85+, Safari 14+
- **CSS Features:** CSS Grid, Custom Properties, Flexbox
- **JavaScript Features:** ES2020, React 18+

## Next Steps

1. **Animation System:** Enhanced micro-interactions
2. **Dark Mode Improvements:** Better contrast ratios
3. **Component Library Expansion:** More specialized components
4. **Design System Documentation:** Interactive component explorer
5. **Performance Monitoring:** Bundle size and runtime metrics

This design system provides a solid foundation for scalable, maintainable, and accessible user interfaces while maintaining excellent developer experience through TypeScript integration and intuitive APIs.