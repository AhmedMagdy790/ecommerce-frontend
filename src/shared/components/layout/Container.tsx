// src/shared/components/layout/Container.tsx

import type { HTMLAttributes, ReactNode } from "react";

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
}

const sizeClasses: Record<NonNullable<ContainerProps["size"]>, string> = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
  "2xl": "max-w-[var(--container-max,1536px)]",
  full: "max-w-full",
};

export function Container({
  children,
  size = "2xl",
  className = "",
  ...props
}: ContainerProps) {
  return (
    <div
      className={[
        "mx-auto w-full",
        sizeClasses[size],
        "px-[var(--container-padding-x-sm,1rem)]",
        "md:px-[var(--container-padding-x-md,1.5rem)]",
        "lg:px-[var(--container-padding-x-lg,2rem)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}