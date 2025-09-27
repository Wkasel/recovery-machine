import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const textVariants = cva(
  "",
  {
    variants: {
      variant: {
        // Display variants
        "display-2xl": "text-display-2xl",
        "display-xl": "text-display-xl", 
        "display-lg": "text-display-lg",
        "display-md": "text-display-md",
        "display-sm": "text-display-sm",
        "display-xs": "text-display-xs",
        
        // Heading variants
        "heading-xl": "text-heading-xl",
        "heading-lg": "text-heading-lg",
        "heading-md": "text-heading-md",
        "heading-sm": "text-heading-sm",
        "heading-xs": "text-heading-xs",
        
        // Body variants
        "body-xl": "text-xl",
        "body-lg": "text-lg",
        "body-md": "text-base",
        "body-sm": "text-sm",
        "body-xs": "text-xs",
        
        // Utility variants
        caption: "text-xs text-muted-foreground",
        label: "text-sm font-medium",
        code: "text-sm font-mono bg-muted px-1.5 py-0.5 rounded",
        kbd: "text-xs font-mono bg-muted border border-border px-2 py-1 rounded shadow-sm",
        link: "text-primary underline-offset-4 hover:underline cursor-pointer",
        muted: "text-muted-foreground",
        subtle: "text-muted-foreground/80",
      },
      weight: {
        thin: "font-thin",
        extralight: "font-extralight", 
        light: "font-light",
        normal: "font-normal",
        medium: "font-medium",
        semibold: "font-semibold",
        bold: "font-bold",
        extrabold: "font-extrabold",
        black: "font-black",
      },
      align: {
        left: "text-left",
        center: "text-center",
        right: "text-right",
        justify: "text-justify",
      },
      decoration: {
        none: "no-underline",
        underline: "underline",
        overline: "overline",
        "line-through": "line-through",
      },
      transform: {
        none: "normal-case",
        uppercase: "uppercase",
        lowercase: "lowercase",
        capitalize: "capitalize",
      },
      leading: {
        none: "leading-none",
        tight: "leading-tight",
        snug: "leading-snug",
        normal: "leading-normal",
        relaxed: "leading-relaxed",
        loose: "leading-loose",
      },
      tracking: {
        tighter: "tracking-tighter",
        tight: "tracking-tight",
        normal: "tracking-normal",
        wide: "tracking-wide",
        wider: "tracking-wider",
        widest: "tracking-widest",
      },
      color: {
        inherit: "text-inherit",
        current: "text-current",
        foreground: "text-foreground",
        muted: "text-muted-foreground",
        primary: "text-primary",
        secondary: "text-secondary-foreground",
        accent: "text-accent-foreground",
        destructive: "text-destructive",
        success: "text-green-600 dark:text-green-400",
        warning: "text-yellow-600 dark:text-yellow-400",
        info: "text-blue-600 dark:text-blue-400",
      },
      truncate: {
        true: "truncate",
        false: "",
      },
      balance: {
        true: "text-balance",
        false: "",
      },
      pretty: {
        true: "text-pretty", 
        false: "",
      },
    },
    defaultVariants: {
      variant: "body-md",
      weight: "normal",
      align: "left",
      color: "foreground",
      truncate: false,
      balance: false,
      pretty: false,
    },
  }
);

type TextElement = "p" | "span" | "div" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "label" | "code" | "kbd" | "small" | "strong" | "em";

export interface TextProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof textVariants> {
  as?: TextElement;
}

const Text = React.forwardRef<HTMLElement, TextProps>(
  ({ 
    className, 
    variant, 
    weight, 
    align, 
    decoration, 
    transform, 
    leading, 
    tracking, 
    color, 
    truncate, 
    balance, 
    pretty,
    as: Component = "p", 
    ...props 
  }, ref) => {
    return (
      <Component
        className={cn(
          textVariants({ 
            variant, 
            weight, 
            align, 
            decoration, 
            transform, 
            leading, 
            tracking, 
            color, 
            truncate, 
            balance, 
            pretty, 
            className 
          })
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Text.displayName = "Text";

// Convenience components for semantic HTML
const Display = React.forwardRef<HTMLHeadingElement, Omit<TextProps, "as" | "variant"> & { variant?: Extract<TextProps["variant"], `display-${string}`> }>(
  ({ variant = "display-lg", ...props }, ref) => (
    <Text ref={ref} as="h1" variant={variant} {...props} />
  )
);
Display.displayName = "Display";

const Heading = React.forwardRef<HTMLHeadingElement, Omit<TextProps, "as" | "variant"> & { 
  variant?: Extract<TextProps["variant"], `heading-${string}`>;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}>(
  ({ variant = "heading-lg", level = 2, ...props }, ref) => {
    const Component = `h${level}` as TextElement;
    return <Text ref={ref} as={Component} variant={variant} {...props} />;
  }
);
Heading.displayName = "Heading";

const Body = React.forwardRef<HTMLParagraphElement, Omit<TextProps, "as" | "variant"> & { variant?: Extract<TextProps["variant"], `body-${string}`> }>(
  ({ variant = "body-md", ...props }, ref) => (
    <Text ref={ref} as="p" variant={variant} {...props} />
  )
);
Body.displayName = "Body";

const Caption = React.forwardRef<HTMLParagraphElement, Omit<TextProps, "as" | "variant">>(
  ({ ...props }, ref) => (
    <Text ref={ref} as="p" variant="caption" {...props} />
  )
);
Caption.displayName = "Caption";

const Label = React.forwardRef<HTMLLabelElement, Omit<TextProps, "as" | "variant">>(
  ({ ...props }, ref) => (
    <Text ref={ref} as="label" variant="label" {...props} />
  )
);
Label.displayName = "Label";

const Code = React.forwardRef<HTMLElement, Omit<TextProps, "as" | "variant">>(
  ({ ...props }, ref) => (
    <Text ref={ref} as="code" variant="code" {...props} />
  )
);
Code.displayName = "Code";

const Kbd = React.forwardRef<HTMLElement, Omit<TextProps, "as" | "variant">>(
  ({ ...props }, ref) => (
    <Text ref={ref} as="kbd" variant="kbd" {...props} />
  )
);
Kbd.displayName = "Kbd";

const Link = React.forwardRef<HTMLElement, Omit<TextProps, "as" | "variant">>(
  ({ ...props }, ref) => (
    <Text ref={ref} as="span" variant="link" {...props} />
  )
);
Link.displayName = "Link";

const Muted = React.forwardRef<HTMLElement, Omit<TextProps, "as" | "variant">>(
  ({ ...props }, ref) => (
    <Text ref={ref} as="span" variant="muted" {...props} />
  )
);
Muted.displayName = "Muted";

export { 
  Text, 
  Display, 
  Heading, 
  Body, 
  Caption, 
  Label, 
  Code, 
  Kbd, 
  Link, 
  Muted, 
  textVariants 
};