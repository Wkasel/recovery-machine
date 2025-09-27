# Component Migration Guide

## Overview
This guide provides specific instructions for migrating existing components to the new theming architecture, ensuring consistency and proper theme support across the application.

## Core Component Updates

### 1. Button Component Migration

**Current Issues:**
- Uses hardcoded rounded-md class
- Missing theme-aware variants
- No semantic color usage

**Updated Implementation:**
```typescript
// /components/ui/button.tsx
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        // New theme-aware variants
        brand: "bg-brand-primary text-primary-foreground shadow hover:bg-brand-primary/90",
        success: "bg-semantic-success text-primary-foreground shadow hover:bg-semantic-success/90",
        warning: "bg-semantic-warning text-primary-foreground shadow hover:bg-semantic-warning/90",
        error: "bg-semantic-error text-primary-foreground shadow hover:bg-semantic-error/90",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
```

### 2. Card Component Migration

**Enhanced Card Component:**
```typescript
// /components/ui/card.tsx
import * as React from "react";

import { cn } from "@/lib/utils";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: "default" | "bordered" | "elevated" | "ghost";
  }
>(({ className, variant = "default", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg text-card-foreground",
      {
        "bg-card border border-border shadow-sm": variant === "default",
        "bg-card border-2 border-border": variant === "bordered",
        "bg-card shadow-lg border border-border": variant === "elevated",
        "bg-transparent": variant === "ghost",
      },
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
```

### 3. Input Component Migration

**Updated Input Component:**
```typescript
// /components/ui/input.tsx
import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "destructive" | "success";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = "default", ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-lg border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50",
          {
            "border-input focus-visible:ring-ring": variant === "default",
            "border-destructive focus-visible:ring-destructive": variant === "destructive",
            "border-semantic-success focus-visible:ring-semantic-success": variant === "success",
          },
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
```

## Layout Component Updates

### 1. Header Component

**Migration Considerations:**
```typescript
// /components/nav/Header.tsx
import { ThemeSwitcher } from "@/components/theme/theme-switcher";
import { Button } from "@/components/ui/button";
import { useThemeDetection } from "@/lib/hooks/use-theme-detection";

export function Header() {
  const { isDark } = useThemeDetection();
  
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        {/* Logo with theme awareness */}
        <div className="mr-4 flex">
          <a className="mr-6 flex items-center space-x-2" href="/">
            <span className="font-bold text-foreground">Recovery Machine</span>
          </a>
        </div>
        
        {/* Navigation */}
        <nav className="flex items-center gap-4 text-sm lg:gap-6">
          <a className="text-foreground/60 transition-colors hover:text-foreground/80" href="/about">
            About
          </a>
          <a className="text-foreground/60 transition-colors hover:text-foreground/80" href="/services">
            Services
          </a>
        </nav>
        
        {/* Theme switcher */}
        <div className="ml-auto flex items-center space-x-4">
          <ThemeSwitcher />
          <Button variant="default" size="sm">
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
}
```

### 2. Footer Component

**Theme-Aware Footer:**
```typescript
// /components/nav/Footer.tsx
export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold text-foreground">Recovery Machine</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Professional recovery services for your business needs.
            </p>
          </div>
          
          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-foreground">Services</h4>
            <ul className="mt-2 space-y-1">
              <li>
                <a href="/recovery" className="text-sm text-muted-foreground hover:text-foreground">
                  Data Recovery
                </a>
              </li>
              <li>
                <a href="/consulting" className="text-sm text-muted-foreground hover:text-foreground">
                  Consulting
                </a>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-foreground">Contact</h4>
            <ul className="mt-2 space-y-1">
              <li className="text-sm text-muted-foreground">
                support@recoverymachine.com
              </li>
              <li className="text-sm text-muted-foreground">
                1-800-RECOVERY
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t border-border pt-4">
          <p className="text-center text-sm text-muted-foreground">
            © 2024 Recovery Machine. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
```

## Page-Level Updates

### 1. Landing Page Components

**Hero Section Migration:**
```typescript
// /components/sections/Hero.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function Hero() {
  return (
    <section className="relative py-20 lg:py-32">
      {/* Background with theme awareness */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-muted/20" />
      
      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-6xl lg:text-7xl">
            Professional Recovery Services
          </h1>
          
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Get your business back on track with our comprehensive recovery solutions.
            Fast, reliable, and professional service you can trust.
          </p>
          
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button variant="default" size="lg" className="min-w-[200px]">
              Get Started Today
            </Button>
            <Button variant="outline" size="lg" className="min-w-[200px]">
              Learn More
            </Button>
          </div>
        </div>
        
        {/* Feature cards */}
        <div className="mt-20 grid gap-6 lg:grid-cols-3">
          <Card variant="elevated">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-foreground">Fast Recovery</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Quick turnaround times to get you back in business.
              </p>
            </CardContent>
          </Card>
          
          <Card variant="elevated">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-foreground">Expert Support</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Professional team with years of recovery experience.
              </p>
            </CardContent>
          </Card>
          
          <Card variant="elevated">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-foreground">Secure Process</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Your data security is our top priority.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
```

## Form Components Migration

### 1. Contact Form

**Theme-Aware Form:**
```typescript
// /components/forms/ContactForm.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle className="text-center">Contact Us</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="Your name" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="your@email.com" />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <Textarea id="message" placeholder="Tell us about your needs..." />
        </div>
        
        <Button variant="default" className="w-full">
          Send Message
        </Button>
      </CardContent>
    </Card>
  );
}
```

## Testing Migration

### 1. Component Tests

**Theme-Aware Testing:**
```typescript
// /tests/components/Button.test.tsx
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/button';
import { renderWithAllThemes, checkColorContrast } from '@/lib/testing/theme-utils';

describe('Button Component', () => {
  it('renders with proper theme variants', () => {
    const themes = renderWithAllThemes(
      <Button variant="default">Test Button</Button>
    );
    
    // Test that button renders in all themes
    expect(themes.light.getByRole('button')).toBeInTheDocument();
    expect(themes.dark.getByRole('button')).toBeInTheDocument();
  });
  
  it('maintains proper color contrast', () => {
    render(<Button variant="default">Test Button</Button>);
    const button = screen.getByRole('button');
    
    // Check WCAG AA compliance
    checkColorContrast(button, 4.5);
  });
  
  it('handles semantic variants correctly', () => {
    render(<Button variant="destructive">Delete</Button>);
    const button = screen.getByRole('button');
    
    expect(button).toHaveClass('bg-destructive');
  });
});
```

## Migration Checklist by Component

### Core UI Components
- [ ] Button - Add semantic variants, proper border radius
- [ ] Input - Add validation states, theme-aware borders
- [ ] Card - Add elevation variants, proper background colors
- [ ] Badge - Add semantic color variants
- [ ] Alert - Update color schemes for both themes
- [ ] Dialog - Ensure backdrop and content theme consistency
- [ ] Dropdown Menu - Update hover states and borders
- [ ] Tooltip - Ensure proper contrast in both themes
- [ ] Select - Update option styling for both themes
- [ ] Checkbox/Radio - Theme-aware focus states
- [ ] Switch - Update track and thumb colors
- [ ] Slider - Theme-aware track and handle
- [ ] Progress - Update progress bar colors
- [ ] Separator - Use semantic border colors
- [ ] Skeleton - Theme-aware loading states
- [ ] Tabs - Update active state styling
- [ ] Navigation Menu - Consistent hover states
- [ ] Breadcrumb - Theme-aware separators
- [ ] Pagination - Update active/disabled states

### Layout Components
- [ ] Header - Logo visibility, navigation colors
- [ ] Footer - Border and text color updates
- [ ] Sidebar - Background and border consistency
- [ ] Navigation - Active state indicators

### Page Components
- [ ] Landing page sections
- [ ] Dashboard components
- [ ] Form components
- [ ] Authentication pages
- [ ] Admin panels
- [ ] Profile pages

### Feature Components
- [ ] Charts and graphs color schemes
- [ ] Data tables theme support
- [ ] Calendar components
- [ ] Image galleries
- [ ] Media players
- [ ] Map components

## Common Pitfalls and Solutions

### 1. Hard-coded Colors
**Problem:** Components using absolute color values
**Solution:** Replace with semantic color tokens

```typescript
// ❌ Bad
className="bg-gray-900 text-white"

// ✅ Good
className="bg-background text-foreground"
```

### 2. Missing Theme Transitions
**Problem:** Jarring theme switches
**Solution:** Add transition classes

```typescript
// ✅ Good
className="bg-background text-foreground transition-colors duration-200"
```

### 3. Inconsistent Border Radius
**Problem:** Mixed rounded classes
**Solution:** Use consistent border radius tokens

```typescript
// ❌ Bad
className="rounded-md"

// ✅ Good
className="rounded-lg"
```

### 4. Poor Contrast in Custom Components
**Problem:** Custom components not following theme standards
**Solution:** Use semantic color tokens consistently

```typescript
// ✅ Good
const customStyles = {
  primary: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  accent: "bg-accent text-accent-foreground",
}
```

This migration guide ensures systematic and consistent updates across all components while maintaining the design system integrity and accessibility standards.