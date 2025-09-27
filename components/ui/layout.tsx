import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

// Container variants for consistent max-widths and padding
const containerVariants = cva(
  "mx-auto w-full",
  {
    variants: {
      size: {
        sm: "max-w-screen-sm",
        md: "max-w-screen-md", 
        lg: "max-w-screen-lg",
        xl: "max-w-screen-xl",
        "2xl": "max-w-screen-2xl",
        full: "max-w-full",
        prose: "max-w-prose",
      },
      padding: {
        none: "px-0",
        sm: "px-4",
        md: "px-6",
        lg: "px-8",
        xl: "px-12",
      },
      centerContent: {
        true: "flex flex-col items-center",
        false: "",
      },
    },
    defaultVariants: {
      size: "xl",
      padding: "md",
      centerContent: false,
    },
  }
);

// Stack variants for consistent vertical spacing
const stackVariants = cva(
  "flex flex-col",
  {
    variants: {
      spacing: {
        none: "space-y-0",
        xs: "space-y-1",
        sm: "space-y-2", 
        md: "space-y-4",
        lg: "space-y-6",
        xl: "space-y-8",
        "2xl": "space-y-12",
        "3xl": "space-y-16",
      },
      align: {
        start: "items-start",
        center: "items-center", 
        end: "items-end",
        stretch: "items-stretch",
      },
      justify: {
        start: "justify-start",
        center: "justify-center",
        end: "justify-end", 
        between: "justify-between",
        around: "justify-around",
        evenly: "justify-evenly",
      },
      direction: {
        vertical: "flex-col",
        horizontal: "flex-row",
      },
    },
    defaultVariants: {
      spacing: "md",
      align: "stretch",
      justify: "start",
      direction: "vertical",
    },
  }
);

// Grid variants for consistent layouts
const gridVariants = cva(
  "grid",
  {
    variants: {
      cols: {
        1: "grid-cols-1",
        2: "grid-cols-2",
        3: "grid-cols-3",
        4: "grid-cols-4",
        5: "grid-cols-5",
        6: "grid-cols-6",
        12: "grid-cols-12",
      },
      gap: {
        none: "gap-0",
        xs: "gap-1",
        sm: "gap-2",
        md: "gap-4",
        lg: "gap-6",
        xl: "gap-8",
        "2xl": "gap-12",
      },
      responsive: {
        true: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        cards: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        admin: "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3",
        dashboard: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
        false: "",
      },
    },
    defaultVariants: {
      cols: 1,
      gap: "md",
      responsive: false,
    },
  }
);

// Flex variants for flexible layouts
const flexVariants = cva(
  "flex",
  {
    variants: {
      direction: {
        row: "flex-row",
        column: "flex-col",
        "row-reverse": "flex-row-reverse",
        "column-reverse": "flex-col-reverse",
      },
      wrap: {
        nowrap: "flex-nowrap",
        wrap: "flex-wrap",
        "wrap-reverse": "flex-wrap-reverse",
      },
      align: {
        start: "items-start",
        center: "items-center",
        end: "items-end",
        baseline: "items-baseline",
        stretch: "items-stretch",
      },
      justify: {
        start: "justify-start",
        center: "justify-center",
        end: "justify-end",
        between: "justify-between",
        around: "justify-around",
        evenly: "justify-evenly",
      },
      gap: {
        none: "gap-0",
        xs: "gap-1",
        sm: "gap-2",
        md: "gap-4",
        lg: "gap-6",
        xl: "gap-8",
      },
    },
    defaultVariants: {
      direction: "row",
      wrap: "nowrap",
      align: "center",
      justify: "start",
      gap: "md",
    },
  }
);

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {}

export interface StackProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof stackVariants> {}

export interface GridProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gridVariants> {}

export interface FlexProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof flexVariants> {}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size, padding, centerContent, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(containerVariants({ size, padding, centerContent, className }))}
      {...props}
    />
  )
);
Container.displayName = "Container";

const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  ({ className, spacing, align, justify, direction, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(stackVariants({ spacing, align, justify, direction, className }))}
      {...props}
    />
  )
);
Stack.displayName = "Stack";

const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, cols, gap, responsive, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(gridVariants({ cols, gap, responsive, className }))}
      {...props}
    />
  )
);
Grid.displayName = "Grid";

const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
  ({ className, direction, wrap, align, justify, gap, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(flexVariants({ direction, wrap, align, justify, gap, className }))}
      {...props}
    />
  )
);
Flex.displayName = "Flex";

// Spacer component for creating consistent spacing
const Spacer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & {
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
}>(
  ({ className, size = "md", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "w-full",
        size === "xs" && "h-1",
        size === "sm" && "h-2",
        size === "md" && "h-4",
        size === "lg" && "h-6",
        size === "xl" && "h-8",
        size === "2xl" && "h-12",
        size === "3xl" && "h-16",
        className
      )}
      {...props}
    />
  )
);
Spacer.displayName = "Spacer";

// Section component for consistent page sections
const Section = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement> & {
  variant?: "default" | "accent" | "muted";
  spacing?: "none" | "sm" | "md" | "lg" | "xl";
}>(
  ({ className, variant = "default", spacing = "lg", children, ...props }, ref) => (
    <section
      ref={ref}
      className={cn(
        "w-full",
        variant === "default" && "bg-background",
        variant === "accent" && "bg-accent/5",
        variant === "muted" && "bg-muted/20",
        spacing === "none" && "py-0",
        spacing === "sm" && "py-8",
        spacing === "md" && "py-12",
        spacing === "lg" && "py-16",
        spacing === "xl" && "py-24",
        className
      )}
      {...props}
    >
      {children}
    </section>
  )
);
Section.displayName = "Section";

export { 
  Container, 
  Stack, 
  Grid, 
  Flex, 
  Spacer, 
  Section,
  containerVariants,
  stackVariants,
  gridVariants,
  flexVariants
};