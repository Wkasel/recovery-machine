import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

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
        7: "grid-cols-7",
        8: "grid-cols-8",
        9: "grid-cols-9",
        10: "grid-cols-10",
        11: "grid-cols-11",
        12: "grid-cols-12",
        none: "grid-cols-none",
        subgrid: "grid-cols-subgrid",
      },
      rows: {
        1: "grid-rows-1",
        2: "grid-rows-2",
        3: "grid-rows-3",
        4: "grid-rows-4",
        5: "grid-rows-5",
        6: "grid-rows-6",
        none: "grid-rows-none",
        subgrid: "grid-rows-subgrid",
      },
      gap: {
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
      gapX: {
        0: "gap-x-0",
        1: "gap-x-1",
        2: "gap-x-2",
        3: "gap-x-3",
        4: "gap-x-4",
        5: "gap-x-5",
        6: "gap-x-6",
        8: "gap-x-8",
        10: "gap-x-10",
        12: "gap-x-12",
        16: "gap-x-16",
        20: "gap-x-20",
        24: "gap-x-24",
      },
      gapY: {
        0: "gap-y-0",
        1: "gap-y-1",
        2: "gap-y-2",
        3: "gap-y-3",
        4: "gap-y-4",
        5: "gap-y-5",
        6: "gap-y-6",
        8: "gap-y-8",
        10: "gap-y-10",
        12: "gap-y-12",
        16: "gap-y-16",
        20: "gap-y-20",
        24: "gap-y-24",
      },
      placeItems: {
        start: "place-items-start",
        end: "place-items-end",
        center: "place-items-center",
        stretch: "place-items-stretch",
      },
      placeContent: {
        start: "place-content-start",
        end: "place-content-end",
        center: "place-content-center",
        between: "place-content-between",
        around: "place-content-around",
        evenly: "place-content-evenly",
        stretch: "place-content-stretch",
      },
      autoFlow: {
        row: "grid-flow-row",
        col: "grid-flow-col",
        dense: "grid-flow-dense",
        "row-dense": "grid-flow-row-dense",
        "col-dense": "grid-flow-col-dense",
      },
      responsive: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      // Responsive grid patterns
      {
        responsive: true,
        cols: 2,
        class: "grid-cols-1 sm:grid-cols-2",
      },
      {
        responsive: true,
        cols: 3,
        class: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
      },
      {
        responsive: true,
        cols: 4,
        class: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
      },
      {
        responsive: true,
        cols: 6,
        class: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
      },
    ],
    defaultVariants: {
      cols: 1,
      gap: 4,
      placeItems: "stretch",
      responsive: false,
    },
  }
);

export interface GridProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gridVariants> {
  as?: React.ElementType;
}

const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ 
    className, 
    cols, 
    rows, 
    gap, 
    gapX, 
    gapY, 
    placeItems, 
    placeContent, 
    autoFlow,
    responsive,
    as: Component = "div", 
    ...props 
  }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(gridVariants({ 
          cols, 
          rows, 
          gap, 
          gapX, 
          gapY, 
          placeItems, 
          placeContent, 
          autoFlow,
          responsive,
          className 
        }))}
        {...props}
      />
    );
  }
);
Grid.displayName = "Grid";

// Grid item component
const gridItemVariants = cva(
  "",
  {
    variants: {
      colSpan: {
        1: "col-span-1",
        2: "col-span-2",
        3: "col-span-3",
        4: "col-span-4",
        5: "col-span-5",
        6: "col-span-6",
        7: "col-span-7",
        8: "col-span-8",
        9: "col-span-9",
        10: "col-span-10",
        11: "col-span-11",
        12: "col-span-12",
        auto: "col-auto",
        full: "col-span-full",
      },
      rowSpan: {
        1: "row-span-1",
        2: "row-span-2",
        3: "row-span-3",
        4: "row-span-4",
        5: "row-span-5",
        6: "row-span-6",
        auto: "row-auto",
        full: "row-span-full",
      },
      colStart: {
        1: "col-start-1",
        2: "col-start-2",
        3: "col-start-3",
        4: "col-start-4",
        5: "col-start-5",
        6: "col-start-6",
        7: "col-start-7",
        8: "col-start-8",
        9: "col-start-9",
        10: "col-start-10",
        11: "col-start-11",
        12: "col-start-12",
        13: "col-start-13",
        auto: "col-start-auto",
      },
      colEnd: {
        1: "col-end-1",
        2: "col-end-2",
        3: "col-end-3",
        4: "col-end-4",
        5: "col-end-5",
        6: "col-end-6",
        7: "col-end-7",
        8: "col-end-8",
        9: "col-end-9",
        10: "col-end-10",
        11: "col-end-11",
        12: "col-end-12",
        13: "col-end-13",
        auto: "col-end-auto",
      },
      rowStart: {
        1: "row-start-1",
        2: "row-start-2",
        3: "row-start-3",
        4: "row-start-4",
        5: "row-start-5",
        6: "row-start-6",
        7: "row-start-7",
        auto: "row-start-auto",
      },
      rowEnd: {
        1: "row-end-1",
        2: "row-end-2",
        3: "row-end-3",
        4: "row-end-4",
        5: "row-end-5",
        6: "row-end-6",
        7: "row-end-7",
        auto: "row-end-auto",
      },
      justifySelf: {
        auto: "justify-self-auto",
        start: "justify-self-start",
        end: "justify-self-end",
        center: "justify-self-center",
        stretch: "justify-self-stretch",
      },
      alignSelf: {
        auto: "self-auto",
        start: "self-start",
        end: "self-end",
        center: "self-center",
        stretch: "self-stretch",
      },
    },
    defaultVariants: {
      justifySelf: "auto",
      alignSelf: "auto",
    },
  }
);

export interface GridItemProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gridItemVariants> {
  as?: React.ElementType;
}

const GridItem = React.forwardRef<HTMLDivElement, GridItemProps>(
  ({ 
    className, 
    colSpan, 
    rowSpan, 
    colStart, 
    colEnd, 
    rowStart, 
    rowEnd, 
    justifySelf, 
    alignSelf,
    as: Component = "div", 
    ...props 
  }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(gridItemVariants({ 
          colSpan, 
          rowSpan, 
          colStart, 
          colEnd, 
          rowStart, 
          rowEnd, 
          justifySelf, 
          alignSelf,
          className 
        }))}
        {...props}
      />
    );
  }
);
GridItem.displayName = "GridItem";

// Preset grid layouts
const AutoGrid = React.forwardRef<HTMLDivElement, Omit<GridProps, "cols"> & {
  minItemWidth?: number; // in rem
}>(
  ({ minItemWidth = 15, className, ...props }, ref) => {
    const gridStyle = {
      gridTemplateColumns: `repeat(auto-fill, minmax(${minItemWidth}rem, 1fr))`,
    };
    
    return (
      <Grid
        ref={ref}
        cols="none"
        className={className}
        style={gridStyle}
        {...props}
      />
    );
  }
);
AutoGrid.displayName = "AutoGrid";

const MasonryGrid = React.forwardRef<HTMLDivElement, Omit<GridProps, "cols"> & {
  columns?: 2 | 3 | 4 | 5;
}>(
  ({ columns = 3, className, ...props }, ref) => {
    const masonryClass = `columns-${columns}`;
    
    return (
      <div
        ref={ref}
        className={cn(masonryClass, "space-y-4", className)}
        {...props}
      />
    );
  }
);
MasonryGrid.displayName = "MasonryGrid";

export { 
  Grid, 
  GridItem, 
  AutoGrid, 
  MasonryGrid, 
  gridVariants, 
  gridItemVariants 
};