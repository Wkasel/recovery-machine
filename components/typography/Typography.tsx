import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";
import { ElementType } from "react";

// Text size variants
const textVariants = cva("text-foreground", {
  variants: {
    variant: {
      h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
      h2: "scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0",
      h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
      h4: "scroll-m-20 text-xl font-semibold tracking-tight",
      h5: "scroll-m-20 text-lg font-semibold tracking-tight",
      h6: "scroll-m-20 text-base font-semibold tracking-tight",
      p: "leading-7 [&:not(:first-child)]:mt-6",
      blockquote: "mt-6 border-l-2 border-border pl-6 italic",
      list: "my-6 ml-6 list-disc [&>li]:mt-2",
      lead: "text-xl text-muted-foreground",
      large: "text-lg font-semibold",
      small: "text-sm font-medium leading-none",
      muted: "text-sm text-muted-foreground",
      subtle: "text-sm text-muted-foreground italic",
    },
    weight: {
      light: "font-light",
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
      extrabold: "font-extrabold",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    },
  },
  defaultVariants: {
    variant: "p",
    weight: "normal",
    align: "left",
  },
});

interface TextProps extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof textVariants> {
  asChild?: boolean;
  as?: ElementType;
}

// Typography components
export function Text({
  className,
  variant,
  weight,
  align,
  as: Component = "p",
  children,
  ...props
}: TextProps) {
  return (
    <Component className={cn(textVariants({ variant, weight, align, className }))} {...props}>
      {children}
    </Component>
  );
}

// Convenience components
export function H1(props: Omit<TextProps, "variant">) {
  return <Text {...props} variant="h1" as="h1" />;
}

export function H2(props: Omit<TextProps, "variant">) {
  return <Text {...props} variant="h2" as="h2" />;
}

export function H3(props: Omit<TextProps, "variant">) {
  return <Text {...props} variant="h3" as="h3" />;
}

export function H4(props: Omit<TextProps, "variant">) {
  return <Text {...props} variant="h4" as="h4" />;
}

export function Paragraph(props: Omit<TextProps, "variant">) {
  return <Text {...props} variant="p" as="p" />;
}

export function Blockquote(props: Omit<TextProps, "variant">) {
  return <Text {...props} variant="blockquote" as="blockquote" />;
}

export function List(props: Omit<TextProps, "variant">) {
  return <Text {...props} variant="list" as="ul" />;
}

export function Lead(props: Omit<TextProps, "variant">) {
  return <Text {...props} variant="lead" as="p" />;
}

export function Large(props: Omit<TextProps, "variant">) {
  return <Text {...props} variant="large" as="div" />;
}

export function Small(props: Omit<TextProps, "variant">) {
  return <Text {...props} variant="small" as="small" />;
}

export function Muted(props: Omit<TextProps, "variant">) {
  return <Text {...props} variant="muted" as="p" />;
}

export function Subtle(props: Omit<TextProps, "variant">) {
  return <Text {...props} variant="subtle" as="p" />;
}
