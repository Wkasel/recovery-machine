# V2 Design Components

TypeScript/TSX components converted from the design POC for the Recovery Machine Next.js application.

## Directory Structure

```
components/v2-design/
├── layout/           # Layout components (header, footer, announcement)
├── sections/         # Page sections (hero, pricing, etc.)
├── ui/              # Reusable UI components
└── index.ts         # Central export file
```

## Components

### Layout Components

#### `AnnouncementBar.tsx`
Fixed announcement bar at the top of the page with dismissible functionality.
- **Features**: LocalStorage persistence, smooth animations
- **Props**: None
- **Usage**: `<AnnouncementBar />`

#### `Header.tsx`
Responsive navigation header with mobile menu.
- **Features**: GSAP fade-in animation, responsive mobile menu, smooth scrolling
- **Props**: None
- **Usage**: `<Header />`
- **Dependencies**: `next/image`, `gsap`

#### `Footer.tsx`
Site footer with contact info, services, and legal links.
- **Features**: Multi-column layout, responsive design
- **Props**: None
- **Usage**: `<Footer />`

### Section Components

#### `Hero.tsx`
Main hero section with animated title and CTA buttons.
- **Features**: GSAP text animation, parallax effects, scroll triggers
- **Props**: None
- **Usage**: `<Hero />`
- **Dependencies**: `next/image`, `gsap`, `ScrollTrigger`, `DottedLine`

#### `HowItWorks.tsx`
Three-step process explanation section.
- **Features**: Animated steps, scroll-triggered animations
- **Props**: None
- **Usage**: `<HowItWorks />`
- **Dependencies**: `gsap`, `ScrollTrigger`, `DottedLine`

#### `MediaGallery.tsx`
Horizontal scrolling media gallery with modal.
- **Features**: Drag-to-scroll, modal lightbox, smooth animations
- **Props**: None
- **Usage**: `<MediaGallery />`
- **Dependencies**: `gsap`, `ScrollTrigger`
- **State**: `selectedMedia`, `isDragging`

#### `Pricing.tsx`
Pricing plans section with three tiers.
- **Features**: Scroll-triggered animations, responsive cards, hover effects
- **Props**: None
- **Usage**: `<Pricing />`
- **Dependencies**: `gsap`, `ScrollTrigger`

#### `BookNow.tsx`
Call-to-action section for booking.
- **Features**: Scale animation on scroll, centered CTA
- **Props**: None
- **Usage**: `<BookNow />`
- **Dependencies**: `gsap`, `ScrollTrigger`

### UI Components

#### `DottedLine.tsx`
Reusable SVG dotted line connector.
- **Props**:
  - `height?: number` - Line height in pixels (default: 200)
  - `className?: string` - Additional CSS classes
- **Usage**: `<DottedLine height={100} />`

## Installation & Setup

### Dependencies Required

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "gsap": "^3.12.0"
  }
}
```

### Import Components

```typescript
// Import all components
import {
  AnnouncementBar,
  Header,
  Footer,
  Hero,
  HowItWorks,
  MediaGallery,
  Pricing,
  BookNow,
  DottedLine
} from '@/components/v2-design';

// Or import individually
import Hero from '@/components/v2-design/sections/Hero';
import Header from '@/components/v2-design/layout/Header';
```

## TypeScript Types

All components are fully typed with TypeScript:

- **Props interfaces** defined for components with props
- **Event handlers** properly typed
- **Refs** typed with appropriate HTML element types
- **State** typed with explicit types

## Styling

Components use:
- **Tailwind CSS** for styling
- **Custom colors** from the design system:
  - `mint-accent`: Mint green accent color
  - `charcoal`: Dark gray/black
  - `mint`: Light mint background
- **Responsive breakpoints**: `sm:`, `md:`, `lg:`

## Animations

GSAP animations include:
- **Fade in/out** on component mount
- **Scroll-triggered** animations with ScrollTrigger
- **Parallax effects** on scroll
- **Stagger animations** for lists
- **Scale and translate** hover effects

### Animation Notes

- All animations use refs for performance
- ScrollTrigger configured with `.snap-y` scroller
- Cleanup handled in useEffect returns

## Next.js Specific Features

- **'use client'** directive on all interactive components
- **next/image** for optimized images
- **next/link** ready (currently using anchor tags)
- **Server-side compatible** (with client-side hydration)

## Best Practices Implemented

1. **Type Safety**: Full TypeScript coverage
2. **Performance**: Optimized with refs and cleanup
3. **Accessibility**: ARIA labels, semantic HTML
4. **Responsive**: Mobile-first design approach
5. **Reusability**: Modular component structure
6. **Code Quality**: Clean, maintainable code

## Migration from JSX

Key changes from original JSX:
- Added TypeScript types for all props and state
- Converted all event handlers to typed versions
- Added proper ref typing
- Updated imports for Next.js compatibility
- Added 'use client' directives
- Converted inline styles to TypeScript objects where needed

## Future Enhancements

Potential improvements:
1. Replace gradient placeholders in MediaGallery with real images
2. Add Framer Motion as alternative to GSAP
3. Implement lazy loading for images
4. Add unit tests with Jest/React Testing Library
5. Extract color constants to theme file
6. Add Storybook documentation

## Support

For issues or questions about these components, refer to:
- Next.js documentation: https://nextjs.org/docs
- GSAP documentation: https://greensock.com/docs/
- Tailwind CSS: https://tailwindcss.com/docs
