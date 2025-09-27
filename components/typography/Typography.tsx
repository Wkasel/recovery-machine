import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";
import { ElementType, forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";

// Typography scale variants using design tokens
const headingVariants = cva(
  "text-foreground font-medium tracking-tight scroll-m-20 text-balance",
  {
    variants: {
      size: {
        "display-2xl": "text-display-2xl", // 6rem (96px)
        "display-xl": "text-display-xl",   // 4.5rem (72px)
        "display-lg": "text-display-lg",   // 3.75rem (60px)
        "display-md": "text-display-md",   // 3rem (48px)
        "display-sm": "text-display-sm",   // 2.25rem (36px)
        "display-xs": "text-display-xs",   // 1.875rem (30px)
        "xl": "text-heading-xl",           // 1.875rem (30px)
        "lg": "text-heading-lg",           // 1.5rem (24px)
        "md": "text-heading-md",           // 1.25rem (20px)
        "sm": "text-heading-sm",           // 1.125rem (18px)
        "xs": "text-heading-xs",           // 1rem (16px)
      },
      weight: {
        light: "font-light",
        normal: "font-normal",
        medium: "font-medium",
        semibold: "font-semibold",
        bold: "font-bold",
        extrabold: "font-extrabold",
      },
      color: {
        default: "text-foreground",
        muted: "text-muted-foreground",
        accent: "text-accent-foreground",
        primary: "text-primary",
        destructive: "text-destructive",
      },
    },
    defaultVariants: {
      size: "lg",
      weight: "semibold",
      color: "default",
    },
  }
);

const textVariants = cva(
  "text-foreground text-pretty",
  {
    variants: {
      size: {
        "xl": "text-xl leading-7",      // 1.25rem (20px)
        "lg": "text-lg leading-7",      // 1.125rem (18px)
        "base": "text-base leading-6",  // 1rem (16px)
        "sm": "text-sm leading-5",      // 0.875rem (14px)
        "xs": "text-xs leading-4",      // 0.75rem (12px)
      },
      variant: {
        default: "",
        lead: "text-xl text-muted-foreground leading-7",
        large: "text-lg font-semibold",
        small: "text-sm font-medium leading-none",
        muted: "text-sm text-muted-foreground",
        subtle: "text-sm text-muted-foreground",
        caption: "text-xs text-muted-foreground uppercase tracking-wide font-medium",
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
      color: {
        default: "text-foreground",
        muted: "text-muted-foreground",
        accent: "text-accent-foreground",
        primary: "text-primary",
        secondary: "text-secondary-foreground",
        destructive: "text-destructive",
        success: "text-emerald-600 dark:text-emerald-400",
        warning: "text-amber-600 dark:text-amber-400",
        info: "text-blue-600 dark:text-blue-400",
      },
    },
    defaultVariants: {
      size: "base",
      variant: "default",
      weight: "normal",
      align: "left",
      color: "default",
    },
  }
);

const codeVariants = cva(
  "font-mono rounded px-1.5 py-0.5 text-sm bg-muted text-muted-foreground",
  {
    variants: {
      variant: {
        inline: "font-mono text-sm bg-muted px-1.5 py-0.5 rounded",
        block: "font-mono text-sm bg-muted p-4 rounded-lg border overflow-x-auto",
      },
    },
    defaultVariants: {
      variant: "inline",
    },
  }
);

const linkVariants = cva(
  "font-medium underline-offset-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "text-primary hover:underline",
        muted: "text-muted-foreground hover:text-foreground hover:underline",
        accent: "text-accent-foreground hover:underline",
        destructive: "text-destructive hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement>, VariantProps<typeof headingVariants> {
  asChild?: boolean;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

interface TextProps extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof textVariants> {
  asChild?: boolean;
  as?: ElementType;
}

interface CodeProps extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof codeVariants> {
  asChild?: boolean;
  children: React.ReactNode;
}

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement>, VariantProps<typeof linkVariants> {
  asChild?: boolean;
}

// Core Typography Components
export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, size, weight, color, as: Component = "h2", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : Component;
    return (
      <Comp
        className={cn(headingVariants({ size, weight, color, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Heading.displayName = "Heading";

export const Text = forwardRef<HTMLElement, TextProps>(
  ({ className, size, variant, weight, align, color, as: Component = "p", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : Component;
    return (
      <Comp
        className={cn(textVariants({ size, variant, weight, align, color, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Text.displayName = "Text";

export const Code = forwardRef<HTMLElement, CodeProps>(
  ({ className, variant, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "code";
    return (
      <Comp
        className={cn(codeVariants({ variant, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);
Code.displayName = "Code";

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, variant, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "a";
    return (
      <Comp
        className={cn(linkVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Link.displayName = "Link";

// Blockquote component
export const Blockquote = forwardRef<HTMLQuoteElement, React.HTMLAttributes<HTMLQuoteElement>>(
  ({ className, ...props }, ref) => (
    <blockquote
      ref={ref}
      className={cn(
        "mt-6 border-l-2 border-muted pl-6 italic text-muted-foreground",
        className
      )}
      {...props}
    />
  )
);
Blockquote.displayName = "Blockquote";

// List components
export const List = forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement> & { ordered?: boolean }>(
  ({ className, ordered = false, ...props }, ref) => {
    const Component = ordered ? "ol" : "ul";
    return (
      <Component
        ref={ref as any}
        className={cn(
          "my-6 ml-6 [&>li]:mt-2",
          ordered ? "list-decimal" : "list-disc",
          className
        )}
        {...props}
      />
    );
  }
);
List.displayName = "List";

export const ListItem = forwardRef<HTMLLIElement, React.HTMLAttributes<HTMLLIElement>>(
  ({ className, ...props }, ref) => (
    <li ref={ref} className={cn("leading-7", className)} {...props} />
  )
);
ListItem.displayName = "ListItem";

// Semantic Heading Components
export const H1 = forwardRef<HTMLHeadingElement, Omit<HeadingProps, "as">>(
  (props, ref) => <Heading ref={ref} {...props} as="h1" />
);
H1.displayName = "H1";

export const H2 = forwardRef<HTMLHeadingElement, Omit<HeadingProps, "as">>(
  (props, ref) => <Heading ref={ref} {...props} as="h2" />
);
H2.displayName = "H2";

export const H3 = forwardRef<HTMLHeadingElement, Omit<HeadingProps, "as">>(
  (props, ref) => <Heading ref={ref} {...props} as="h3" />
);
H3.displayName = "H3";

export const H4 = forwardRef<HTMLHeadingElement, Omit<HeadingProps, "as">>(
  (props, ref) => <Heading ref={ref} {...props} as="h4" />
);
H4.displayName = "H4";

export const H5 = forwardRef<HTMLHeadingElement, Omit<HeadingProps, "as">>(
  (props, ref) => <Heading ref={ref} {...props} as="h5" />
);
H5.displayName = "H5";

export const H6 = forwardRef<HTMLHeadingElement, Omit<HeadingProps, "as">>(
  (props, ref) => <Heading ref={ref} {...props} as="h6" />
);
H6.displayName = "H6";

// Semantic Text Components
export const Paragraph = forwardRef<HTMLParagraphElement, Omit<TextProps, "as">>(
  (props, ref) => <Text ref={ref} {...props} as="p" />
);
Paragraph.displayName = "Paragraph";

export const Lead = forwardRef<HTMLParagraphElement, Omit<TextProps, "as" | "variant">>(
  (props, ref) => <Text ref={ref} {...props} variant="lead" as="p" />
);
Lead.displayName = "Lead";

export const Large = forwardRef<HTMLDivElement, Omit<TextProps, "as" | "variant">>(
  (props, ref) => <Text ref={ref} {...props} variant="large" as="div" />
);
Large.displayName = "Large";

export const Small = forwardRef<HTMLElement, Omit<TextProps, "as" | "variant">>(
  (props, ref) => <Text ref={ref} {...props} variant="small" as="small" />
);
Small.displayName = "Small";

export const Muted = forwardRef<HTMLParagraphElement, Omit<TextProps, "as" | "variant">>(
  (props, ref) => <Text ref={ref} {...props} variant="muted" as="p" />
);
Muted.displayName = "Muted";

export const Subtle = forwardRef<HTMLParagraphElement, Omit<TextProps, "as" | "variant">>(
  (props, ref) => <Text ref={ref} {...props} variant="subtle" as="p" />
);
Subtle.displayName = "Subtle";

export const Caption = forwardRef<HTMLParagraphElement, Omit<TextProps, "as" | "variant">>(
  (props, ref) => <Text ref={ref} {...props} variant="caption" as="p" />
);
Caption.displayName = "Caption";

// Utility Components
export const InlineCode = forwardRef<HTMLElement, Omit<CodeProps, "variant">>(
  (props, ref) => <Code ref={ref} {...props} variant="inline" />
);
InlineCode.displayName = "InlineCode";

export const CodeBlock = forwardRef<HTMLElement, Omit<CodeProps, "variant">>(
  (props, ref) => <Code ref={ref} {...props} variant="block" as="pre" />
);
CodeBlock.displayName = "CodeBlock";

// Export variants for external use
export { headingVariants, textVariants, codeVariants, linkVariants };
