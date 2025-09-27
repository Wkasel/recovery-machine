"use client";

import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const containerVariants = cva(
  "w-full mx-auto",
  {
    variants: {
      size: {
        sm: "max-w-screen-sm", // 640px
        md: "max-w-screen-md", // 768px
        lg: "max-w-screen-lg", // 1024px
        xl: "max-w-screen-xl", // 1280px
        "2xl": "max-w-screen-2xl", // 1536px
        full: "max-w-full",
        prose: "max-w-prose", // ~65ch
        content: "max-w-4xl", // Content-focused width
      },
      padding: {
        none: "px-0",
        sm: "px-4",
        md: "px-6",
        lg: "px-8",
        xl: "px-12",
        responsive: "px-4 sm:px-6 lg:px-8",
      },
      centerContent: {
        true: "text-center",
        false: "",
      },
    },
    defaultVariants: {
      size: "xl",
      padding: "responsive",
      centerContent: false,
    },
  }
);

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {
  as?: React.ElementType;
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size, padding, centerContent, as: Component = "div", ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(containerVariants({ size, padding, centerContent, className }))}
        {...props}
      />
    );
  }
);
Container.displayName = "Container";

// Specialized container components
const Section = React.forwardRef<HTMLElement, ContainerProps & {
  as?: "section" | "div" | "main" | "article" | "aside";
}>(
  ({ as = "section", ...props }, ref) => {
    return <Container ref={ref} as={as} {...props} />;
  }
);
Section.displayName = "Section";

const Main = React.forwardRef<HTMLElement, ContainerProps>(
  (props, ref) => {
    return <Container ref={ref} as="main" {...props} />;
  }
);
Main.displayName = "Main";

const Article = React.forwardRef<HTMLElement, ContainerProps>(
  (props, ref) => {
    return <Container ref={ref} as="article" {...props} />;
  }
);
Article.displayName = "Article";

export { Container, Section, Main, Article, containerVariants };