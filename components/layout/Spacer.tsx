import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const spacerVariants = cva(
  "",
  {
    variants: {
      size: {
        0: "h-0 w-0",
        px: "h-px w-px",
        0.5: "h-0.5 w-0.5",
        1: "h-1 w-1",
        1.5: "h-1.5 w-1.5",
        2: "h-2 w-2",
        2.5: "h-2.5 w-2.5",
        3: "h-3 w-3",
        3.5: "h-3.5 w-3.5",
        4: "h-4 w-4",
        5: "h-5 w-5",
        6: "h-6 w-6",
        7: "h-7 w-7",
        8: "h-8 w-8",
        9: "h-9 w-9",
        10: "h-10 w-10",
        11: "h-11 w-11",
        12: "h-12 w-12",
        14: "h-14 w-14",
        16: "h-16 w-16",
        20: "h-20 w-20",
        24: "h-24 w-24",
        28: "h-28 w-28",
        32: "h-32 w-32",
        36: "h-36 w-36",
        40: "h-40 w-40",
        44: "h-44 w-44",
        48: "h-48 w-48",
        52: "h-52 w-52",
        56: "h-56 w-56",
        60: "h-60 w-60",
        64: "h-64 w-64",
        72: "h-72 w-72",
        80: "h-80 w-80",
        96: "h-96 w-96",
      },
      axis: {
        both: "",
        x: "h-0",
        y: "w-0",
      },
      flex: {
        true: "flex-1",
        false: "",
      },
    },
    compoundVariants: [
      // Horizontal spacing (x-axis)
      {
        axis: "x",
        size: 0,
        class: "w-0 h-0",
      },
      {
        axis: "x",
        size: "px",
        class: "w-px h-0",
      },
      {
        axis: "x",
        size: 0.5,
        class: "w-0.5 h-0",
      },
      {
        axis: "x",
        size: 1,
        class: "w-1 h-0",
      },
      {
        axis: "x",
        size: 1.5,
        class: "w-1.5 h-0",
      },
      {
        axis: "x",
        size: 2,
        class: "w-2 h-0",
      },
      {
        axis: "x",
        size: 2.5,
        class: "w-2.5 h-0",
      },
      {
        axis: "x",
        size: 3,
        class: "w-3 h-0",
      },
      {
        axis: "x",
        size: 3.5,
        class: "w-3.5 h-0",
      },
      {
        axis: "x",
        size: 4,
        class: "w-4 h-0",
      },
      {
        axis: "x",
        size: 5,
        class: "w-5 h-0",
      },
      {
        axis: "x",
        size: 6,
        class: "w-6 h-0",
      },
      {
        axis: "x",
        size: 8,
        class: "w-8 h-0",
      },
      {
        axis: "x",
        size: 10,
        class: "w-10 h-0",
      },
      {
        axis: "x",
        size: 12,
        class: "w-12 h-0",
      },
      {
        axis: "x",
        size: 16,
        class: "w-16 h-0",
      },
      {
        axis: "x",
        size: 20,
        class: "w-20 h-0",
      },
      {
        axis: "x",
        size: 24,
        class: "w-24 h-0",
      },
      {
        axis: "x",
        size: 32,
        class: "w-32 h-0",
      },
      
      // Vertical spacing (y-axis)
      {
        axis: "y",
        size: 0,
        class: "h-0 w-0",
      },
      {
        axis: "y",
        size: "px",
        class: "h-px w-0",
      },
      {
        axis: "y",
        size: 0.5,
        class: "h-0.5 w-0",
      },
      {
        axis: "y",
        size: 1,
        class: "h-1 w-0",
      },
      {
        axis: "y",
        size: 1.5,
        class: "h-1.5 w-0",
      },
      {
        axis: "y",
        size: 2,
        class: "h-2 w-0",
      },
      {
        axis: "y",
        size: 2.5,
        class: "h-2.5 w-0",
      },
      {
        axis: "y",
        size: 3,
        class: "h-3 w-0",
      },
      {
        axis: "y",
        size: 3.5,
        class: "h-3.5 w-0",
      },
      {
        axis: "y",
        size: 4,
        class: "h-4 w-0",
      },
      {
        axis: "y",
        size: 5,
        class: "h-5 w-0",
      },
      {
        axis: "y",
        size: 6,
        class: "h-6 w-0",
      },
      {
        axis: "y",
        size: 8,
        class: "h-8 w-0",
      },
      {
        axis: "y",
        size: 10,
        class: "h-10 w-0",
      },
      {
        axis: "y",
        size: 12,
        class: "h-12 w-0",
      },
      {
        axis: "y",
        size: 16,
        class: "h-16 w-0",
      },
      {
        axis: "y",
        size: 20,
        class: "h-20 w-0",
      },
      {
        axis: "y",
        size: 24,
        class: "h-24 w-0",
      },
      {
        axis: "y",
        size: 32,
        class: "h-32 w-0",
      },
    ],
    defaultVariants: {
      size: 4,
      axis: "both",
      flex: false,
    },
  }
);

export interface SpacerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spacerVariants> {
  as?: React.ElementType;
}

const Spacer = React.forwardRef<HTMLDivElement, SpacerProps>(
  ({ className, size, axis, flex, as: Component = "div", ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(spacerVariants({ size, axis, flex, className }))}
        aria-hidden="true"
        {...props}
      />
    );
  }
);
Spacer.displayName = "Spacer";

// Specialized spacer components
const VerticalSpacer = React.forwardRef<HTMLDivElement, Omit<SpacerProps, "axis">>(
  (props, ref) => {
    return <Spacer ref={ref} axis="y" {...props} />;
  }
);
VerticalSpacer.displayName = "VerticalSpacer";

const HorizontalSpacer = React.forwardRef<HTMLDivElement, Omit<SpacerProps, "axis">>(
  (props, ref) => {
    return <Spacer ref={ref} axis="x" {...props} />;
  }
);
HorizontalSpacer.displayName = "HorizontalSpacer";

const FlexSpacer = React.forwardRef<HTMLDivElement, Omit<SpacerProps, "flex" | "size">>(
  (props, ref) => {
    return <Spacer ref={ref} flex size={0} {...props} />;
  }
);
FlexSpacer.displayName = "FlexSpacer";

export { Spacer, VerticalSpacer, HorizontalSpacer, FlexSpacer, spacerVariants };