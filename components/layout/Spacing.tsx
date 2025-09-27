import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";
import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";

// Spacing scale based on 4px geometric progression
const spacingScale = {
  "0": "0",
  "px": "1px",
  "0.5": "2px",
  "1": "4px", 
  "1.5": "6px",
  "2": "8px",
  "2.5": "10px",
  "3": "12px",
  "3.5": "14px",
  "4": "16px",
  "5": "20px",
  "6": "24px",
  "7": "28px",
  "8": "32px",
  "9": "36px",
  "10": "40px",
  "11": "44px",
  "12": "48px",
  "14": "56px",
  "16": "64px",
  "20": "80px",
  "24": "96px",
  "28": "112px",
  "32": "128px",
} as const;

type SpacingValue = keyof typeof spacingScale;

// Stack component for vertical spacing
const stackVariants = cva("", {
  variants: {
    space: {
      "0": "space-y-0",
      "px": "space-y-px",
      "0.5": "space-y-0.5",
      "1": "space-y-1",
      "1.5": "space-y-1.5",
      "2": "space-y-2",
      "2.5": "space-y-2.5",
      "3": "space-y-3",
      "3.5": "space-y-3.5",
      "4": "space-y-4",
      "5": "space-y-5",
      "6": "space-y-6",
      "7": "space-y-7",
      "8": "space-y-8",
      "9": "space-y-9",
      "10": "space-y-10",
      "11": "space-y-11",
      "12": "space-y-12",
      "14": "space-y-14",
      "16": "space-y-16",
      "20": "space-y-20",
      "24": "space-y-24",
      "28": "space-y-28",
      "32": "space-y-32",
    },
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
    },
  },
  defaultVariants: {
    space: "4",
    align: "stretch",
  },
});

// Inline component for horizontal spacing
const inlineVariants = cva("flex", {
  variants: {
    space: {
      "0": "space-x-0",
      "px": "space-x-px",
      "0.5": "space-x-0.5",
      "1": "space-x-1",
      "1.5": "space-x-1.5",
      "2": "space-x-2",
      "2.5": "space-x-2.5",
      "3": "space-x-3",
      "3.5": "space-x-3.5",
      "4": "space-x-4",
      "5": "space-x-5",
      "6": "space-x-6",
      "7": "space-x-7",
      "8": "space-x-8",
      "9": "space-x-9",
      "10": "space-x-10",
      "11": "space-x-11",
      "12": "space-x-12",
      "14": "space-x-14",
      "16": "space-x-16",
      "20": "space-x-20",
      "24": "space-x-24",
      "28": "space-x-28",
      "32": "space-x-32",
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
    wrap: {
      wrap: "flex-wrap",
      nowrap: "flex-nowrap",
      reverse: "flex-wrap-reverse",
    },
  },
  defaultVariants: {
    space: "4",
    align: "center",
    justify: "start",
    wrap: "nowrap",
  },
});

// Container component with consistent padding
const containerVariants = cva("w-full mx-auto", {
  variants: {
    size: {
      sm: "max-w-screen-sm", // 640px
      md: "max-w-screen-md", // 768px
      lg: "max-w-screen-lg", // 1024px
      xl: "max-w-screen-xl", // 1280px
      "2xl": "max-w-screen-2xl", // 1536px
      full: "max-w-full",
    },
    padding: {
      "0": "px-0",
      "1": "px-1",
      "2": "px-2",
      "3": "px-3",
      "4": "px-4",
      "5": "px-5",
      "6": "px-6",
      "8": "px-8",
      "12": "px-12",
      "16": "px-16",
      "20": "px-20",
    },
  },
  defaultVariants: {
    size: "xl",
    padding: "4",
  },
});

// Spacer component for manual spacing
const spacerVariants = cva("", {
  variants: {
    size: {
      "0": "h-0 w-0",
      "px": "h-px w-px",
      "0.5": "h-0.5 w-0.5",
      "1": "h-1 w-1",
      "1.5": "h-1.5 w-1.5",
      "2": "h-2 w-2",
      "2.5": "h-2.5 w-2.5",
      "3": "h-3 w-3",
      "3.5": "h-3.5 w-3.5",
      "4": "h-4 w-4",
      "5": "h-5 w-5",
      "6": "h-6 w-6",
      "7": "h-7 w-7",
      "8": "h-8 w-8",
      "9": "h-9 w-9",
      "10": "h-10 w-10",
      "11": "h-11 w-11",
      "12": "h-12 w-12",
      "14": "h-14 w-14",
      "16": "h-16 w-16",
      "20": "h-20 w-20",
      "24": "h-24 w-24",
      "28": "h-28 w-28",
      "32": "h-32 w-32",
    },
    axis: {
      both: "",
      horizontal: "h-auto",
      vertical: "w-auto",
    },
  },
  defaultVariants: {
    size: "4",
    axis: "both",
  },
});

interface StackProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof stackVariants> {
  asChild?: boolean;
}

interface InlineProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof inlineVariants> {
  asChild?: boolean;
}

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof containerVariants> {
  asChild?: boolean;
}

interface SpacerProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof spacerVariants> {
  asChild?: boolean;
}

// Stack Component - Vertical spacing
export const Stack = forwardRef<HTMLDivElement, StackProps>(
  ({ className, space, align, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (
      <Comp
        className={cn(stackVariants({ space, align, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Stack.displayName = "Stack";

// Inline Component - Horizontal spacing
export const Inline = forwardRef<HTMLDivElement, InlineProps>(
  ({ className, space, align, justify, wrap, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (
      <Comp
        className={cn(inlineVariants({ space, align, justify, wrap, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Inline.displayName = "Inline";

// Container Component - Consistent max-width and padding
export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size, padding, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (
      <Comp
        className={cn(containerVariants({ size, padding, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Container.displayName = "Container";

// Spacer Component - Manual spacing
export const Spacer = forwardRef<HTMLDivElement, SpacerProps>(
  ({ className, size, axis, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "div";
    return (
      <Comp
        className={cn(spacerVariants({ size, axis, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Spacer.displayName = "Spacer";

// Utility function to get spacing value
export function getSpacingValue(space: SpacingValue): string {
  return spacingScale[space];
}

// Export spacing scale for external use
export { spacingScale, stackVariants, inlineVariants, containerVariants, spacerVariants };
export type { SpacingValue };