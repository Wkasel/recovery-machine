# Theming Architecture Implementation Plan

## Overview
This document provides the detailed implementation roadmap for the comprehensive theming architecture, including step-by-step instructions and code templates.

## Phase 1: Foundation Setup (Critical Priority)

### 1.1 New Tailwind Configuration

**File: `/tailwind.config.js`**
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Brand colors
        brand: {
          primary: "hsl(var(--brand-primary))",
          secondary: "hsl(var(--brand-secondary))",
          accent: "hsl(var(--brand-accent))",
        },
        // Semantic colors
        semantic: {
          success: "hsl(var(--success))",
          warning: "hsl(var(--warning))",
          error: "hsl(var(--error))",
          info: "hsl(var(--info))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ['Geist', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['GeistMono', 'ui-monospace', 'SFMono-Regular', 'SF Mono', 'Consolas', 'Liberation Mono', 'Menlo', 'monospace'],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-out": {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
        "slide-in-from-top": {
          from: { transform: "translateY(-100%)" },
          to: { transform: "translateY(0)" },
        },
        "slide-in-from-bottom": {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
        "slide-in-from-left": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
        "slide-in-from-right": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.2s ease-out",
        "fade-out": "fade-out 0.2s ease-out",
        "slide-in-from-top": "slide-in-from-top 0.2s ease-out",
        "slide-in-from-bottom": "slide-in-from-bottom 0.2s ease-out",
        "slide-in-from-left": "slide-in-from-left 0.2s ease-out",
        "slide-in-from-right": "slide-in-from-right 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

### 1.2 New Global CSS with Theme Variables

**File: `/app/globals.css`**
```css
@import "tailwindcss";

@layer base {
  :root {
    /* Light theme (default) */
    --background: 0 0% 100%;
    --foreground: 0 0% 4%;
    --card: 0 0% 100%;
    --card-foreground: 0 0% 4%;
    --popover: 0 0% 100%;
    --popover-foreground: 0 0% 4%;
    --primary: 0 0% 4%;
    --primary-foreground: 0 0% 98%;
    --secondary: 0 0% 96%;
    --secondary-foreground: 0 0% 4%;
    --muted: 0 0% 96%;
    --muted-foreground: 0 0% 45%;
    --accent: 0 0% 96%;
    --accent-foreground: 0 0% 4%;
    --destructive: 0 84% 60%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 90%;
    --input: 0 0% 90%;
    --ring: 0 0% 4%;
    
    /* Brand colors */
    --brand-primary: 174 56% 53%;     /* #4CC1B3 */
    --brand-secondary: 142 69% 58%;   /* #22c55e */
    --brand-accent: 217 91% 60%;      /* #3b82f6 */
    
    /* Semantic colors */
    --success: 142 69% 58%;           /* #22c55e */
    --warning: 43 96% 56%;            /* #f59e0b */
    --error: 0 84% 60%;               /* #ef4444 */
    --info: 217 91% 60%;              /* #3b82f6 */
    
    /* Layout tokens */
    --radius: 0.5rem;
    
    /* Typography */
    --font-sans: 'Geist', ui-sans-serif, system-ui;
    --font-mono: 'GeistMono', ui-monospace, SFMono-Regular;
  }

  .dark {
    /* Dark theme overrides */
    --background: 0 0% 0%;
    --foreground: 0 0% 98%;
    --card: 0 0% 7%;
    --card-foreground: 0 0% 98%;
    --popover: 0 0% 7%;
    --popover-foreground: 0 0% 98%;
    --primary: 0 0% 98%;
    --primary-foreground: 0 0% 4%;
    --secondary: 0 0% 15%;
    --secondary-foreground: 0 0% 98%;
    --muted: 0 0% 15%;
    --muted-foreground: 0 0% 64%;
    --accent: 0 0% 15%;
    --accent-foreground: 0 0% 98%;
    --border: 0 0% 15%;
    --input: 0 0% 7%;
    --ring: 0 0% 98%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  
  body {
    @apply bg-background text-foreground;
    font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11';
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}

/* Accessibility: Respect user motion preferences */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  :root {
    --border: 0 0% 0%;
    --ring: 0 0% 0%;
  }
  
  .dark {
    --border: 0 0% 100%;
    --ring: 0 0% 100%;
  }
}

/* Mobile input zoom prevention */
@supports (-webkit-touch-callout: none) {
  input[type="text"],
  input[type="email"],
  input[type="password"],
  input[type="tel"],
  textarea,
  select {
    font-size: 16px !important;
  }
}
```

### 1.3 Updated Layout.tsx

**File: `/app/layout.tsx`**
```typescript
import { Geist } from "next/font/google";
import AppProvider from "./providers";

import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { SearchEngineVerifications } from "@/components/analytics/SearchConsoleVerification";
import { OrganizationJsonLd, WebsiteJsonLd } from "@/components/JsonLd";
import { Footer } from "@/components/nav/Footer";
import { Header } from "@/components/nav/Header";
import { WebVitalsTracker } from "@/components/performance/WebVitalsTracker";
import { Analytics } from "@vercel/analytics/react";

import { globalmetadata } from "./metadata";

import "./globals.css";
export const metadata = globalmetadata;

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.variable} suppressHydrationWarning>
      <head>
        <SearchEngineVerifications />
        <OrganizationJsonLd />
        <WebsiteJsonLd />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <AppProvider>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </AppProvider>
        <Analytics />
        <GoogleAnalytics />
        <WebVitalsTracker />
      </body>
    </html>
  );
}
```

### 1.4 Enhanced Theme Provider

**File: `/app/providers.tsx`**
```typescript
"use client";

import { AuthContextProvider } from "@/components/auth";
import { RootErrorBoundary } from "@/components/error-boundary";
import { queryClient } from "@/lib/query/config";
import { LoadingProvider } from "@/lib/ui/loading/context";
import { ModalProvider } from "@/lib/ui/modals/context";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";
import { Toaster } from "sonner";

export default function AppProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider 
        attribute="class" 
        defaultTheme="system" 
        enableSystem 
        disableTransitionOnChange={false}
        storageKey="recovery-machine-theme"
      >
        <RootErrorBoundary>
          <AuthContextProvider>
            <LoadingProvider>
              <ModalProvider>
                <Toaster 
                  position="top-right"
                  theme="system"
                  richColors
                  closeButton
                />
                {children}
                <ReactQueryDevtools initialIsOpen={false} />
              </ModalProvider>
            </LoadingProvider>
          </AuthContextProvider>
        </RootErrorBoundary>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
```

## Phase 2: Component Architecture (High Priority)

### 2.1 Enhanced Theme Switcher

**File: `/components/theme/theme-switcher.tsx`**
```typescript
"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface ThemeSwitcherProps {
  variant?: "icon" | "button" | "dropdown";
  size?: "sm" | "md" | "lg";
  align?: "start" | "center" | "end";
}

export function ThemeSwitcher({ 
  variant = "icon", 
  size = "md",
  align = "start" 
}: ThemeSwitcherProps) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size={size === "sm" ? "sm" : "default"} disabled>
        <Sun className="h-4 w-4" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  const iconSize = size === "sm" ? 14 : size === "lg" ? 18 : 16;

  const ThemeIcon = () => {
    if (resolvedTheme === "dark") {
      return <Moon size={iconSize} className="text-muted-foreground" />;
    }
    if (resolvedTheme === "light") {
      return <Sun size={iconSize} className="text-muted-foreground" />;
    }
    return <Laptop size={iconSize} className="text-muted-foreground" />;
  };

  if (variant === "button") {
    return (
      <Button
        variant="outline"
        size={size === "sm" ? "sm" : "default"}
        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        className="gap-2"
      >
        <ThemeIcon />
        <span className="capitalize">
          {resolvedTheme === "dark" ? "Light" : "Dark"} mode
        </span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size={size === "sm" ? "sm" : "default"}
          className="h-9 w-9 px-0"
        >
          <ThemeIcon />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} className="min-w-[140px]">
        <DropdownMenuItem 
          onClick={() => setTheme("light")}
          className="gap-2 cursor-pointer"
        >
          <Sun size={iconSize} />
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("dark")}
          className="gap-2 cursor-pointer"
        >
          <Moon size={iconSize} />
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("system")}
          className="gap-2 cursor-pointer"
        >
          <Laptop size={iconSize} />
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

### 2.2 Theme Detection Hook

**File: `/lib/hooks/use-theme-detection.ts`**
```typescript
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface ThemeDetection {
  isDark: boolean;
  isLight: boolean;
  isSystem: boolean;
  resolvedTheme: 'light' | 'dark' | undefined;
  mounted: boolean;
  systemPreference: 'light' | 'dark' | undefined;
}

export function useThemeDetection(): ThemeDetection {
  const { theme, resolvedTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return {
    isDark: mounted && resolvedTheme === 'dark',
    isLight: mounted && resolvedTheme === 'light',
    isSystem: theme === 'system',
    resolvedTheme: mounted ? (resolvedTheme as 'light' | 'dark') : undefined,
    mounted,
    systemPreference: mounted ? (systemTheme as 'light' | 'dark') : undefined,
  };
}
```

### 2.3 Design Tokens

**File: `/lib/design-tokens.ts`**
```typescript
export const designTokens = {
  // Color tokens
  colors: {
    // Base semantic colors
    background: 'hsl(var(--background))',
    foreground: 'hsl(var(--foreground))',
    card: 'hsl(var(--card))',
    cardForeground: 'hsl(var(--card-foreground))',
    popover: 'hsl(var(--popover))',
    popoverForeground: 'hsl(var(--popover-foreground))',
    primary: 'hsl(var(--primary))',
    primaryForeground: 'hsl(var(--primary-foreground))',
    secondary: 'hsl(var(--secondary))',
    secondaryForeground: 'hsl(var(--secondary-foreground))',
    muted: 'hsl(var(--muted))',
    mutedForeground: 'hsl(var(--muted-foreground))',
    accent: 'hsl(var(--accent))',
    accentForeground: 'hsl(var(--accent-foreground))',
    destructive: 'hsl(var(--destructive))',
    destructiveForeground: 'hsl(var(--destructive-foreground))',
    border: 'hsl(var(--border))',
    input: 'hsl(var(--input))',
    ring: 'hsl(var(--ring))',
    
    // Brand colors
    brand: {
      primary: 'hsl(var(--brand-primary))',
      secondary: 'hsl(var(--brand-secondary))',
      accent: 'hsl(var(--brand-accent))',
    },
    
    // Semantic colors
    semantic: {
      success: 'hsl(var(--success))',
      warning: 'hsl(var(--warning))',
      error: 'hsl(var(--error))',
      info: 'hsl(var(--info))',
    },
  },
  
  // Spacing tokens
  spacing: {
    px: '1px',
    0: '0px',
    0.5: '0.125rem',
    1: '0.25rem',
    1.5: '0.375rem',
    2: '0.5rem',
    2.5: '0.625rem',
    3: '0.75rem',
    3.5: '0.875rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    7: '1.75rem',
    8: '2rem',
    9: '2.25rem',
    10: '2.5rem',
    11: '2.75rem',
    12: '3rem',
    14: '3.5rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
    28: '7rem',
    32: '8rem',
    36: '9rem',
    40: '10rem',
    44: '11rem',
    48: '12rem',
    52: '13rem',
    56: '14rem',
    60: '15rem',
    64: '16rem',
    72: '18rem',
    80: '20rem',
    96: '24rem',
  },
  
  // Typography tokens
  typography: {
    fontSizes: {
      xs: '0.75rem',      // 12px
      sm: '0.875rem',     // 14px
      base: '1rem',       // 16px
      lg: '1.125rem',     // 18px
      xl: '1.25rem',      // 20px
      '2xl': '1.5rem',    // 24px
      '3xl': '1.875rem',  // 30px
      '4xl': '2.25rem',   // 36px
      '5xl': '3rem',      // 48px
      '6xl': '3.75rem',   // 60px
      '7xl': '4.5rem',    // 72px
      '8xl': '6rem',      // 96px
      '9xl': '8rem',      // 128px
    },
    fontWeights: {
      thin: '100',
      extralight: '200',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900',
    },
    lineHeights: {
      none: '1',
      tight: '1.25',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2',
    },
    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0em',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em',
    },
  },
  
  // Border radius tokens
  borderRadius: {
    none: '0px',
    sm: 'calc(var(--radius) - 4px)',
    md: 'calc(var(--radius) - 2px)',
    lg: 'var(--radius)',
    xl: 'calc(var(--radius) + 4px)',
    '2xl': 'calc(var(--radius) + 8px)',
    '3xl': 'calc(var(--radius) + 12px)',
    full: '9999px',
  },
  
  // Shadow tokens
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  },
  
  // Z-index tokens
  zIndex: {
    auto: 'auto',
    0: '0',
    10: '10',
    20: '20',
    30: '30',
    40: '40',
    50: '50',
    modal: '1000',
    popover: '1010',
    overlay: '1020',
    max: '2147483647',
  },
} as const;

export type DesignTokens = typeof designTokens;
```

## Phase 3: Quality Assurance & Testing

### 3.1 Theme Testing Utilities

**File: `/lib/testing/theme-utils.ts`**
```typescript
import { render, RenderOptions } from '@testing-library/react';
import { ThemeProvider } from 'next-themes';
import { ReactElement } from 'react';

interface ThemeRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  theme?: 'light' | 'dark' | 'system';
}

const createThemeWrapper = (theme: 'light' | 'dark' | 'system' = 'light') => {
  return function ThemeWrapper({ children }: { children: React.ReactNode }) {
    return (
      <ThemeProvider
        attribute="class"
        defaultTheme={theme}
        enableSystem={theme === 'system'}
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    );
  };
};

export function renderWithTheme(
  ui: ReactElement,
  { theme = 'light', ...options }: ThemeRenderOptions = {}
) {
  return render(ui, {
    wrapper: createThemeWrapper(theme),
    ...options,
  });
}

export function renderWithAllThemes(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return {
    light: renderWithTheme(ui, { theme: 'light', ...options }),
    dark: renderWithTheme(ui, { theme: 'dark', ...options }),
    system: renderWithTheme(ui, { theme: 'system', ...options }),
  };
}
```

### 3.2 Accessibility Testing

**File: `/lib/testing/accessibility-utils.ts`**
```typescript
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

export async function checkAccessibility(container: Element | Document) {
  const results = await axe(container);
  expect(results).toHaveNoViolations();
  return results;
}

export function checkColorContrast(element: Element, expectedRatio: number = 4.5) {
  const styles = window.getComputedStyle(element);
  const backgroundColor = styles.backgroundColor;
  const color = styles.color;
  
  // This is a simplified contrast check
  // In a real implementation, you'd want to use a proper color contrast library
  const bgLuminance = getLuminance(backgroundColor);
  const fgLuminance = getLuminance(color);
  
  const contrast = (Math.max(bgLuminance, fgLuminance) + 0.05) / 
                   (Math.min(bgLuminance, fgLuminance) + 0.05);
  
  expect(contrast).toBeGreaterThanOrEqual(expectedRatio);
  return contrast;
}

function getLuminance(color: string): number {
  // Simplified luminance calculation
  // Real implementation would need proper color parsing
  const rgb = color.match(/\d+/g);
  if (!rgb) return 0;
  
  const [r, g, b] = rgb.map(x => {
    const val = parseInt(x) / 255;
    return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
```

## Phase 4: Migration Checklist

### 4.1 Pre-Migration Checklist

- [ ] Backup current Tailwind config
- [ ] Backup current globals.css
- [ ] Document current component inventory
- [ ] Set up testing environment
- [ ] Create rollback plan

### 4.2 Migration Steps

1. **Foundation Setup**
   - [ ] Update `tailwind.config.js`
   - [ ] Update `globals.css`
   - [ ] Update `layout.tsx`
   - [ ] Update `providers.tsx`
   - [ ] Test basic theme switching

2. **Component Updates**
   - [ ] Update theme switcher component
   - [ ] Update core UI components (button, input, card)
   - [ ] Add theme detection hooks
   - [ ] Update navigation components
   - [ ] Test component theme switching

3. **Page Updates**
   - [ ] Update landing page
   - [ ] Update dashboard pages
   - [ ] Update authentication pages
   - [ ] Update admin pages
   - [ ] Test page-level theme consistency

4. **Testing & QA**
   - [ ] Run accessibility tests
   - [ ] Test color contrast compliance
   - [ ] Test keyboard navigation
   - [ ] Test screen reader compatibility
   - [ ] Cross-browser testing
   - [ ] Mobile device testing

### 4.3 Post-Migration Verification

- [ ] All components render correctly in both themes
- [ ] Theme switching is smooth and performant
- [ ] No FOUC (Flash of Unstyled Content)
- [ ] WCAG 2.1 AA compliance achieved
- [ ] No console errors or warnings
- [ ] Performance benchmarks met

## Success Metrics

1. **Performance**
   - Theme switching < 100ms
   - No layout shifts during theme change
   - CSS bundle size increase < 5%

2. **Accessibility**
   - 100% WCAG 2.1 AA compliance
   - Contrast ratio ≥ 4.5:1 for normal text
   - Contrast ratio ≥ 3:1 for large text

3. **User Experience**
   - Smooth theme transitions
   - Persistent theme preference
   - System theme detection working

4. **Developer Experience**
   - Clear component API
   - Consistent token usage
   - Easy maintenance and extension

This implementation plan provides a comprehensive roadmap for transforming the current hardcoded dark theme into a flexible, accessible, and maintainable theming system.