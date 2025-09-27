# Typography & Spacing System Documentation

## Overview

This document outlines the comprehensive typography and spacing system implemented for the Recovery Machine application. The system provides consistent, accessible, and responsive design patterns across the entire application.

## Typography System

### Core Components

#### Heading Component
The `Heading` component provides semantic heading elements with consistent styling.

```tsx
import { Heading } from "@/components/typography/Typography";

// Usage Examples
<Heading as="h1" size="display-lg" weight="semibold">
  Main Page Title
</Heading>

<Heading as="h2" size="xl" color="muted">
  Section Header
</Heading>
```

**Available Props:**
- `size`: `display-2xl` | `display-xl` | `display-lg` | `display-md` | `display-sm` | `display-xs` | `xl` | `lg` | `md` | `sm` | `xs`
- `weight`: `light` | `normal` | `medium` | `semibold` | `bold` | `extrabold`
- `color`: `default` | `muted` | `accent` | `primary` | `destructive`
- `as`: `h1` | `h2` | `h3` | `h4` | `h5` | `h6`

#### Text Component
The `Text` component handles body text and content with various styling options.

```tsx
import { Text } from "@/components/typography/Typography";

// Usage Examples
<Text size="lg" variant="lead">
  Introduction paragraph text
</Text>

<Text size="base" color="muted">
  Regular body text
</Text>
```

**Available Props:**
- `size`: `xl` | `lg` | `base` | `sm` | `xs`
- `variant`: `default` | `lead` | `large` | `small` | `muted` | `subtle` | `caption`
- `weight`: `thin` | `extralight` | `light` | `normal` | `medium` | `semibold` | `bold` | `extrabold` | `black`
- `align`: `left` | `center` | `right` | `justify`
- `color`: `default` | `muted` | `accent` | `primary` | `secondary` | `destructive` | `success` | `warning` | `info`

#### Semantic Components
Convenience components for common use cases:

```tsx
import { H1, H2, H3, Paragraph, Lead, Small, Caption } from "@/components/typography/Typography";

<H1 size="display-md">Page Title</H1>
<H2 size="lg">Section Title</H2>
<Lead>Introduction text with emphasis</Lead>
<Paragraph>Regular body text</Paragraph>
<Small>Fine print or metadata</Small>
<Caption>Form labels or image captions</Caption>
```

#### Code and Links

```tsx
import { Code, InlineCode, CodeBlock, Link } from "@/components/typography/Typography";

<Paragraph>
  Use <InlineCode>npm install</InlineCode> to install dependencies.
</Paragraph>

<CodeBlock>
  const example = "Hello World";
  console.log(example);
</CodeBlock>

<Link variant="default" href="/docs">
  Read the documentation
</Link>
```

### Typography Scale

The system uses a responsive typography scale based on design tokens:

| Size | Mobile | Desktop | Usage |
|------|--------|---------|--------|
| `display-2xl` | 4rem | 6rem | Hero headlines |
| `display-xl` | 3rem | 4.5rem | Large headings |
| `display-lg` | 2.5rem | 3.75rem | Page titles |
| `display-md` | 2rem | 3rem | Section headers |
| `display-sm` | 1.75rem | 2.25rem | Subsections |
| `display-xs` | 1.5rem | 1.875rem | Small headings |
| `xl` | 1.25rem | 1.5rem | Large text |
| `lg` | 1.125rem | 1.25rem | Emphasized text |
| `base` | 1rem | 1.125rem | Body text |
| `sm` | 0.875rem | 1rem | Small text |
| `xs` | 0.75rem | 0.875rem | Captions |

### Responsive Typography

The system includes responsive typography utilities using CSS `clamp()`:

```css
.text-responsive-base {
  font-size: clamp(1rem, 2.5vw, 1.125rem);
  line-height: 1.5;
}

.heading-primary {
  font-size: clamp(2rem, 6vw, 4rem);
  font-weight: 600;
  line-height: 1.1;
  letter-spacing: -0.02em;
}
```

## Spacing System

### Core Components

#### Stack Component
Provides consistent vertical spacing between elements.

```tsx
import { Stack } from "@/components/layout/Spacing";

<Stack space="8" align="center">
  <Heading>Title</Heading>
  <Text>Description</Text>
  <Button>Action</Button>
</Stack>
```

#### Inline Component
Provides consistent horizontal spacing and flexbox layout.

```tsx
import { Inline } from "@/components/layout/Spacing";

<Inline space="4" justify="between" align="center">
  <Text>Left content</Text>
  <Button>Right action</Button>
</Inline>
```

#### Container Component
Provides consistent max-width and padding for content areas.

```tsx
import { Container } from "@/components/layout/Spacing";

<Container size="lg" padding="6">
  <content />
</Container>
```

#### Spacer Component
Creates empty space for manual layout control.

```tsx
import { Spacer } from "@/components/layout/Spacing";

<div>
  <Text>First section</Text>
  <Spacer size="8" axis="vertical" />
  <Text>Second section</Text>
</div>
```

### Spacing Scale

Based on a 4px geometric progression:

| Token | Value | Usage |
|-------|-------|--------|
| `0` | 0px | No spacing |
| `px` | 1px | Borders |
| `0.5` | 2px | Micro spacing |
| `1` | 4px | Tight spacing |
| `2` | 8px | Small spacing |
| `3` | 12px | Regular spacing |
| `4` | 16px | Medium spacing |
| `6` | 24px | Large spacing |
| `8` | 32px | XL spacing |
| `12` | 48px | XXL spacing |
| `16` | 64px | Section spacing |
| `20` | 80px | Large sections |
| `24` | 96px | Hero spacing |
| `32` | 128px | Page spacing |

### Layout Utilities

#### Section Padding
Responsive padding for page sections:

```css
.section-padding {
  padding-top: clamp(3rem, 8vw, 6rem);
  padding-bottom: clamp(3rem, 8vw, 6rem);
}
```

#### Content Widths
Predefined content width containers:

```css
.content-narrow { max-width: 42rem; } /* 672px */
.content-wide { max-width: 65rem; }   /* 1040px */
.content-full { max-width: 90rem; }   /* 1440px */
```

#### Geometric Spacing
CSS utilities for consistent element spacing:

```css
.space-geometric > * + * {
  margin-top: 1.5rem;
}
```

## Accessibility Features

### Focus Management
- Proper focus rings on interactive elements
- Keyboard navigation support
- Screen reader compatibility

### Color Contrast
- WCAG AA compliant color combinations
- Semantic color tokens for consistency
- Support for light and dark themes

### Typography Accessibility
- Minimum 16px font size on mobile to prevent zoom
- Proper heading hierarchy
- Readable line heights and spacing

## Usage Examples

### Hero Section
```tsx
<Container size="xl" className="text-center">
  <Stack space="12" align="center">
    <Caption>Professional mobile recovery</Caption>
    <Heading as="h1" size="display-lg" weight="medium">
      Recovery When You Need It
    </Heading>
    <Text size="xl" color="muted" align="center">
      Cold plunge + infrared sauna. We come to you.
    </Text>
    <Inline space="4" justify="center">
      <Button>Book Now</Button>
      <Button variant="outline">Learn More</Button>
    </Inline>
  </Stack>
</Container>
```

### Card Component
```tsx
<div className="card-base">
  <Stack space="6">
    <Stack space="3">
      <H3 size="lg">Card Title</H3>
      <Text color="muted">Card description text</Text>
    </Stack>
    <Inline space="3" justify="between" align="center">
      <Small color="muted">Metadata</Small>
      <Button size="sm">Action</Button>
    </Inline>
  </Stack>
</div>
```

### Navigation Header
```tsx
<header className="sticky top-0 z-50 border-b">
  <Container size="2xl">
    <Inline space="8" justify="between" align="center" className="h-16">
      <Link href="/">
        <Inline space="3" align="center">
          <Logo />
          <Text size="lg" weight="medium">Brand Name</Text>
        </Inline>
      </Link>
      <nav>
        <Inline space="6" align="center">
          <Link href="/about">About</Link>
          <Link href="/pricing">Pricing</Link>
          <Button>Get Started</Button>
        </Inline>
      </nav>
    </Inline>
  </Container>
</header>
```

## Performance Considerations

- Uses CSS custom properties for theming
- Leverages design tokens for consistency
- Responsive typography reduces layout shift
- Semantic HTML for better SEO and accessibility

## Migration Guide

### From Old System
1. Replace hardcoded font sizes with typography components
2. Use spacing components instead of margin/padding utilities
3. Update color references to use semantic tokens
4. Implement proper heading hierarchy

### Breaking Changes
- `text-4xl` → `<Heading size="display-sm" />`
- `text-lg font-semibold` → `<Text variant="large" />`
- `space-y-6` → `<Stack space="6" />`
- `gap-4` → `<Inline space="4" />`

## Browser Support

- Modern browsers (Chrome 88+, Firefox 85+, Safari 14+)
- CSS Grid and Flexbox support required
- CSS custom properties support required
- CSS clamp() support for responsive typography

## Design Tokens Reference

All typography and spacing values are defined in `/src/styles/design-system.css` using CSS custom properties. This allows for consistent theming and easy maintenance across the application.