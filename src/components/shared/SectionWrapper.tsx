import { cn } from "@/lib/utils";
import type { HTMLAttributes, ReactNode } from "react";

interface SectionWrapperProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  container?: boolean; // Whether to wrap content in a container
  className?: string;
  as?: keyof JSX.IntrinsicElements; // Allows specifying the HTML tag, defaults to 'section'
}

export default function SectionWrapper({
  children,
  container = true,
  className,
  as: Component = "section",
  ...props
}: SectionWrapperProps) {
  return (
    <Component
      className={cn("py-12 md:py-16 lg:py-20", className)}
      {...props}
    >
      {container ? (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
      ) : (
        children
      )}
    </Component>
  );
}
