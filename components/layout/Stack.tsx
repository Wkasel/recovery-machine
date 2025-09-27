import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const stackVariants = cva(
  "flex",
  {
    variants: {
      direction: {
        row: "flex-row",
        column: "flex-col",
        "row-reverse": "flex-row-reverse",
        "column-reverse": "flex-col-reverse",
      },
      spacing: {
        0: "gap-0",
        1: "gap-1", // 4px
        2: "gap-2", // 8px
        3: "gap-3", // 12px
        4: "gap-4", // 16px
        5: "gap-5", // 20px
        6: "gap-6", // 24px
        7: "gap-7", // 28px
        8: "gap-8", // 32px
        10: "gap-10", // 40px
        12: "gap-12", // 48px
        16: "gap-16", // 64px
        20: "gap-20", // 80px
        24: "gap-24", // 96px
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
        true: "flex-wrap",
        false: "flex-nowrap",
        reverse: "flex-wrap-reverse",
      },
      responsive: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      // Responsive variants
      {
        responsive: true,
        direction: "column",
        class: "flex-col sm:flex-row",
      },
      {
        responsive: true,
        direction: "row",
        class: "flex-col sm:flex-row",
      },
    ],
    defaultVariants: {
      direction: "column",
      spacing: 4,
      align: "stretch",
      justify: "start",
      wrap: false,
      responsive: false,
    },
  }
);

export interface StackProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof stackVariants> {
  as?: React.ElementType;
}

const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  ({ 
    className, 
    direction, 
    spacing, 
    align, 
    justify, 
    wrap, 
    responsive,
    as: Component = "div", 
    ...props 
  }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(stackVariants({ 
          direction, 
          spacing, 
          align, 
          justify, 
          wrap, 
          responsive,
          className 
        }))}
        {...props}
      />
    );
  }
);
Stack.displayName = "Stack";

// Specialized stack components
const HStack = React.forwardRef<HTMLDivElement, Omit<StackProps, "direction">>(
  (props, ref) => {
    return <Stack ref={ref} direction="row" {...props} />;
  }
);
HStack.displayName = "HStack";

const VStack = React.forwardRef<HTMLDivElement, Omit<StackProps, "direction">>(
  (props, ref) => {
    return <Stack ref={ref} direction="column" {...props} />;
  }
);
VStack.displayName = "VStack";

// Center component for centering content
const Center = React.forwardRef<HTMLDivElement, Omit<StackProps, "align" | "justify">>(
  ({ className, ...props }, ref) => {
    return (
      <Stack
        ref={ref}
        align="center"
        justify="center"
        className={cn("min-h-full", className)}
        {...props}
      />
    );
  }
);
Center.displayName = "Center";

export { Stack, HStack, VStack, Center, stackVariants };