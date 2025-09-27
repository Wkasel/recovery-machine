"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import * as React from "react";

import { tokens } from "@/lib/design-tokens";

// Enhanced theme context with design tokens
export interface ExtendedThemeContext {
  theme: string | undefined;
  setTheme: (theme: string) => void;
  themes: string[];
  tokens: typeof tokens;
  resolvedTheme: string | undefined;
  systemTheme: string | undefined;
}

const ExtendedThemeContext = React.createContext<ExtendedThemeContext | undefined>(undefined);

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider 
      attribute="class" 
      defaultTheme="system" 
      enableSystem
      disableTransitionOnChange={false}
      {...props}
    >
      <ThemeEnhancer>{children}</ThemeEnhancer>
    </NextThemesProvider>
  );
}

function ThemeEnhancer({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  
  React.useEffect(() => {
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (!mounted) return;

    // Apply smooth theme transitions
    const style = document.createElement('style');
    style.textContent = `
      *, *::before, *::after {
        transition: 
          background-color 200ms ease-out,
          border-color 200ms ease-out,
          color 200ms ease-out,
          box-shadow 200ms ease-out,
          transform 200ms ease-out,
          opacity 150ms ease-out !important;
      }
      
      /* Respect user preferences */
      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
          scroll-behavior: auto !important;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, [mounted]);

  React.useEffect(() => {
    if (!mounted) return;

    // System preference detection
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      document.documentElement.setAttribute('data-system-theme', e.matches ? 'dark' : 'light');
    };
    
    // Set initial value
    document.documentElement.setAttribute('data-system-theme', mediaQuery.matches ? 'dark' : 'light');
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mounted]);

  if (!mounted) {
    return children;
  }

  return children;
}

// Hook to use the enhanced theme context
export function useTheme() {
  const context = React.useContext(ExtendedThemeContext);
  
  if (context === undefined) {
    // Fallback to next-themes if enhanced context not available
    const { theme, setTheme, themes, resolvedTheme, systemTheme } = require('next-themes').useTheme();
    
    return {
      theme,
      setTheme,
      themes,
      tokens,
      resolvedTheme,
      systemTheme,
    };
  }
  
  return context;
}

// Hook for accessing design tokens
export function useTokens() {
  return tokens;
}

// Hook for responsive design
export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = React.useState<keyof typeof tokens.semantic.layout.breakpoints>('xs');
  
  React.useEffect(() => {
    const breakpoints = tokens.semantic.layout.breakpoints;
    
    const checkBreakpoint = () => {
      const width = window.innerWidth;
      
      if (width >= parseInt(breakpoints['2xl'])) {
        setBreakpoint('2xl');
      } else if (width >= parseInt(breakpoints.xl)) {
        setBreakpoint('xl');
      } else if (width >= parseInt(breakpoints.lg)) {
        setBreakpoint('lg');
      } else if (width >= parseInt(breakpoints.md)) {
        setBreakpoint('md');
      } else if (width >= parseInt(breakpoints.sm)) {
        setBreakpoint('sm');
      } else {
        setBreakpoint('xs');
      }
    };
    
    checkBreakpoint();
    window.addEventListener('resize', checkBreakpoint);
    
    return () => window.removeEventListener('resize', checkBreakpoint);
  }, []);
  
  return breakpoint;
}

// Hook for theme-aware colors
export function useThemeColors() {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as 'light' | 'dark') || 'light';
  
  return {
    theme,
    colors: tokens.semantic.colors[theme],
    getColor: (colorName: keyof typeof tokens.semantic.colors.light) => {
      return tokens.semantic.colors[theme][colorName];
    },
  };
}

// Utility function to create theme-aware CSS custom properties
export function createThemeProperties(theme: 'light' | 'dark') {
  const colors = tokens.semantic.colors[theme];
  const properties: Record<string, string> = {};
  
  Object.entries(colors).forEach(([key, value]) => {
    properties[`--${key}`] = value;
  });
  
  return properties;
}

// Component for injecting theme CSS custom properties
export function ThemeStyleProvider({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const theme = (resolvedTheme as 'light' | 'dark') || 'light';
  
  React.useEffect(() => {
    const properties = createThemeProperties(theme);
    const root = document.documentElement;
    
    Object.entries(properties).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
  }, [theme]);
  
  return <>{children}</>;
}