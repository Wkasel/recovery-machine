/**
 * Design Tokens System for Recovery Machine
 * Centralized TypeScript definitions for design tokens
 */

// Base tokens (primitive values)
export const baseTokens = {
  // Color palette
  colors: {
    // Brand colors
    teal: {
      50: '#f0fdfa',
      100: '#ccfbf1', 
      200: '#99f6e4',
      300: '#5eead4',
      400: '#2dd4bf',
      500: '#14b8a6', // Primary brand color
      600: '#0d9488',
      700: '#0f766e',
      800: '#115e59',
      900: '#134e4a',
      950: '#042f2e',
    },
    
    // Grayscale
    slate: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
      950: '#020617',
    },
    
    // Semantic colors
    red: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
      950: '#450a0a',
    },
    
    green: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
      950: '#052e16',
    },
    
    yellow: {
      50: '#fefce8',
      100: '#fef9c3',
      200: '#fef08a',
      300: '#fde047',
      400: '#facc15',
      500: '#eab308',
      600: '#ca8a04',
      700: '#a16207',
      800: '#854d0e',
      900: '#713f12',
      950: '#422006',
    },
    
    blue: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
      950: '#172554',
    },
  },
  
  // Typography scale
  typography: {
    fontSize: {
      xs: '0.75rem',     // 12px
      sm: '0.875rem',    // 14px
      base: '1rem',      // 16px
      lg: '1.125rem',    // 18px
      xl: '1.25rem',     // 20px
      '2xl': '1.5rem',   // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
      '5xl': '3rem',     // 48px
      '6xl': '3.75rem',  // 60px
      '7xl': '4.5rem',   // 72px
      '8xl': '6rem',     // 96px
      '9xl': '8rem',     // 128px
    },
    
    lineHeight: {
      none: '1',
      tight: '1.25',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2',
    },
    
    fontWeight: {
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
    
    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0em',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em',
    },
  },
  
  // Spacing scale (based on 4px grid)
  spacing: {
    0: '0',
    px: '1px',
    0.5: '0.125rem', // 2px
    1: '0.25rem',    // 4px
    1.5: '0.375rem', // 6px
    2: '0.5rem',     // 8px
    2.5: '0.625rem', // 10px
    3: '0.75rem',    // 12px
    3.5: '0.875rem', // 14px
    4: '1rem',       // 16px
    5: '1.25rem',    // 20px
    6: '1.5rem',     // 24px
    7: '1.75rem',    // 28px
    8: '2rem',       // 32px
    9: '2.25rem',    // 36px
    10: '2.5rem',    // 40px
    11: '2.75rem',   // 44px
    12: '3rem',      // 48px
    14: '3.5rem',    // 56px
    16: '4rem',      // 64px
    20: '5rem',      // 80px
    24: '6rem',      // 96px
    28: '7rem',      // 112px
    32: '8rem',      // 128px
    36: '9rem',      // 144px
    40: '10rem',     // 160px
    44: '11rem',     // 176px
    48: '12rem',     // 192px
    52: '13rem',     // 208px
    56: '14rem',     // 224px
    60: '15rem',     // 240px
    64: '16rem',     // 256px
    72: '18rem',     // 288px
    80: '20rem',     // 320px
    96: '24rem',     // 384px
  },
  
  // Border radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    default: '0.25rem', // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    '3xl': '1.5rem',  // 24px
    full: '9999px',
  },
  
  // Shadows
  boxShadow: {
    none: 'none',
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    default: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  },
  
  // Animation durations
  duration: {
    75: '75ms',
    100: '100ms',
    150: '150ms',
    200: '200ms',
    300: '300ms',
    500: '500ms',
    700: '700ms',
    1000: '1000ms',
  },
  
  // Animation easing
  ease: {
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  
  // Z-index layers
  zIndex: {
    auto: 'auto',
    0: '0',
    10: '10',
    20: '20',
    30: '30',
    40: '40',
    50: '50',
    dropdown: '1000',
    sticky: '1020',
    fixed: '1030',
    'modal-backdrop': '1040',
    modal: '1050',
    popover: '1060',
    tooltip: '1070',
    toast: '1080',
  },
} as const;

// Semantic tokens (contextual values)
export const semanticTokens = {
  colors: {
    // Light theme semantic colors
    light: {
      background: 'hsl(0 0% 100%)',
      foreground: 'hsl(222.2 84% 4.9%)',
      card: 'hsl(0 0% 100%)',
      'card-foreground': 'hsl(222.2 84% 4.9%)',
      popover: 'hsl(0 0% 100%)',
      'popover-foreground': 'hsl(222.2 84% 4.9%)',
      primary: 'hsl(160 84% 39%)',
      'primary-foreground': 'hsl(0 0% 98%)',
      secondary: 'hsl(210 40% 98%)',
      'secondary-foreground': 'hsl(222.2 84% 4.9%)',
      muted: 'hsl(210 40% 96%)',
      'muted-foreground': 'hsl(215.4 16.3% 46.9%)',
      accent: 'hsl(210 40% 96%)',
      'accent-foreground': 'hsl(222.2 84% 4.9%)',
      destructive: 'hsl(0 84.2% 60.2%)',
      'destructive-foreground': 'hsl(210 40% 98%)',
      border: 'hsl(214.3 31.8% 91.4%)',
      input: 'hsl(214.3 31.8% 91.4%)',
      ring: 'hsl(160 84% 39%)',
      success: 'hsl(142 76% 36%)',
      'success-foreground': 'hsl(355.7 100% 97.3%)',
      warning: 'hsl(38 92% 50%)',
      'warning-foreground': 'hsl(48 96% 89%)',
      info: 'hsl(217.2 91.2% 59.8%)',
      'info-foreground': 'hsl(210 40% 98%)',
    },
    
    // Dark theme semantic colors
    dark: {
      background: 'hsl(222.2 84% 4.9%)',
      foreground: 'hsl(210 40% 98%)',
      card: 'hsl(222.2 84% 4.9%)',
      'card-foreground': 'hsl(210 40% 98%)',
      popover: 'hsl(222.2 84% 4.9%)',
      'popover-foreground': 'hsl(210 40% 98%)',
      primary: 'hsl(160 84% 39%)',
      'primary-foreground': 'hsl(222.2 84% 4.9%)',
      secondary: 'hsl(217.2 32.6% 17.5%)',
      'secondary-foreground': 'hsl(210 40% 98%)',
      muted: 'hsl(217.2 32.6% 17.5%)',
      'muted-foreground': 'hsl(215 20.2% 65.1%)',
      accent: 'hsl(217.2 32.6% 17.5%)',
      'accent-foreground': 'hsl(210 40% 98%)',
      destructive: 'hsl(0 62.8% 30.6%)',
      'destructive-foreground': 'hsl(210 40% 98%)',
      border: 'hsl(217.2 32.6% 17.5%)',
      input: 'hsl(217.2 32.6% 17.5%)',
      ring: 'hsl(160 84% 39%)',
      success: 'hsl(142 71% 45%)',
      'success-foreground': 'hsl(144 61% 20%)',
      warning: 'hsl(38 92% 50%)',
      'warning-foreground': 'hsl(20.5 90.2% 48.2%)',
      info: 'hsl(217.2 91.2% 59.8%)',
      'info-foreground': 'hsl(210 40% 98%)',
    },
  },
  
  // Component sizes
  sizes: {
    button: {
      xs: { height: '1.75rem', padding: '0 0.5rem', fontSize: '0.75rem' },
      sm: { height: '2rem', padding: '0 0.75rem', fontSize: '0.875rem' },
      md: { height: '2.5rem', padding: '0 1rem', fontSize: '0.875rem' },
      lg: { height: '2.75rem', padding: '0 2rem', fontSize: '1rem' },
      xl: { height: '3rem', padding: '0 2.5rem', fontSize: '1.125rem' },
    },
    
    input: {
      sm: { height: '2rem', padding: '0 0.75rem', fontSize: '0.875rem' },
      md: { height: '2.5rem', padding: '0 0.75rem', fontSize: '0.875rem' },
      lg: { height: '3rem', padding: '0 1rem', fontSize: '1rem' },
    },
    
    card: {
      sm: { padding: '0.75rem' },
      md: { padding: '1rem' },
      lg: { padding: '1.5rem' },
      xl: { padding: '2rem' },
    },
  },
  
  // Layout tokens
  layout: {
    container: {
      padding: '1rem',
      maxWidth: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
    },
    
    breakpoints: {
      xs: '0px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
  },
} as const;

// Type definitions
export type BaseColors = typeof baseTokens.colors;
export type SemanticColors = typeof semanticTokens.colors;
export type Typography = typeof baseTokens.typography;
export type Spacing = typeof baseTokens.spacing;
export type BorderRadius = typeof baseTokens.borderRadius;
export type BoxShadow = typeof baseTokens.boxShadow;
export type Duration = typeof baseTokens.duration;
export type Ease = typeof baseTokens.ease;
export type ZIndex = typeof baseTokens.zIndex;
export type ComponentSizes = typeof semanticTokens.sizes;
export type Layout = typeof semanticTokens.layout;

// Utility function to get CSS custom property value
export function getCSSVariable(variable: string): string {
  return `var(--${variable})`;
}

// Utility function to create HSL color with opacity
export function hslWithOpacity(hslValue: string, opacity: number): string {
  return `hsl(${hslValue} / ${opacity})`;
}

// Color utility functions
export const colorUtils = {
  // Get semantic color value
  getSemanticColor: (colorName: keyof SemanticColors['light'], theme: 'light' | 'dark' = 'light') => {
    return semanticTokens.colors[theme][colorName];
  },
  
  // Get base color value
  getBaseColor: (colorName: keyof BaseColors, shade: keyof BaseColors[keyof BaseColors]) => {
    return baseTokens.colors[colorName][shade];
  },
  
  // Create CSS custom property
  createCSSCustomProperty: (name: string, value: string) => {
    return { [`--${name}`]: value };
  },
};

// Typography utility functions
export const typographyUtils = {
  // Get font size
  getFontSize: (size: keyof Typography['fontSize']) => {
    return baseTokens.typography.fontSize[size];
  },
  
  // Get line height
  getLineHeight: (height: keyof Typography['lineHeight']) => {
    return baseTokens.typography.lineHeight[height];
  },
  
  // Get font weight
  getFontWeight: (weight: keyof Typography['fontWeight']) => {
    return baseTokens.typography.fontWeight[weight];
  },
  
  // Create typography style object
  createTypographyStyle: (config: {
    fontSize?: keyof Typography['fontSize'];
    lineHeight?: keyof Typography['lineHeight'];
    fontWeight?: keyof Typography['fontWeight'];
    letterSpacing?: keyof Typography['letterSpacing'];
  }) => {
    return {
      ...(config.fontSize && { fontSize: baseTokens.typography.fontSize[config.fontSize] }),
      ...(config.lineHeight && { lineHeight: baseTokens.typography.lineHeight[config.lineHeight] }),
      ...(config.fontWeight && { fontWeight: baseTokens.typography.fontWeight[config.fontWeight] }),
      ...(config.letterSpacing && { letterSpacing: baseTokens.typography.letterSpacing[config.letterSpacing] }),
    };
  },
};

// Spacing utility functions
export const spacingUtils = {
  // Get spacing value
  getSpacing: (size: keyof Spacing) => {
    return baseTokens.spacing[size];
  },
  
  // Create spacing style object
  createSpacingStyle: (config: {
    margin?: keyof Spacing;
    marginTop?: keyof Spacing;
    marginRight?: keyof Spacing;
    marginBottom?: keyof Spacing;
    marginLeft?: keyof Spacing;
    padding?: keyof Spacing;
    paddingTop?: keyof Spacing;
    paddingRight?: keyof Spacing;
    paddingBottom?: keyof Spacing;
    paddingLeft?: keyof Spacing;
  }) => {
    return {
      ...(config.margin && { margin: baseTokens.spacing[config.margin] }),
      ...(config.marginTop && { marginTop: baseTokens.spacing[config.marginTop] }),
      ...(config.marginRight && { marginRight: baseTokens.spacing[config.marginRight] }),
      ...(config.marginBottom && { marginBottom: baseTokens.spacing[config.marginBottom] }),
      ...(config.marginLeft && { marginLeft: baseTokens.spacing[config.marginLeft] }),
      ...(config.padding && { padding: baseTokens.spacing[config.padding] }),
      ...(config.paddingTop && { paddingTop: baseTokens.spacing[config.paddingTop] }),
      ...(config.paddingRight && { paddingRight: baseTokens.spacing[config.paddingRight] }),
      ...(config.paddingBottom && { paddingBottom: baseTokens.spacing[config.paddingBottom] }),
      ...(config.paddingLeft && { paddingLeft: baseTokens.spacing[config.paddingLeft] }),
    };
  },
};

// Export all tokens
export const tokens = {
  base: baseTokens,
  semantic: semanticTokens,
  utils: {
    color: colorUtils,
    typography: typographyUtils,
    spacing: spacingUtils,
  },
} as const;

export default tokens;