// src/shared/components/DataTable/components/TableCellImage.tsx
import React from "react";

interface TableCellImageProps {
  src?: string | null;
  alt?: string;
  size?: "sm" | "md" | "lg";
  rounded?: "sm" | "md" | "lg" | "full";
  fallbackText?: string;
}

const sizeClasses = {
  sm: "w-8 h-8 text-[10px]",
  md: "w-10 h-10 text-xs",
  lg: "w-12 h-12 text-sm",
};

const roundedClasses = {
  sm: "rounded",
  md: "rounded-lg",
  lg: "rounded-xl",
  full: "rounded-full",
};

export const TableCellImage: React.FC<TableCellImageProps> = ({
  src,
  alt = "Image",
  size = "md",
  rounded = "md",
  fallbackText = "N/A",
}) => {
  if (!src) {
    return (
      <div
        className={`${sizeClasses[size]} ${roundedClasses[rounded]} bg-[var(--color-background-secondary)] flex items-center justify-center text-[var(--color-text-muted)] border border-[var(--color-border)] font-medium shrink-0`}
      >
        {fallbackText}
      </div>
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} ${roundedClasses[rounded]} relative overflow-hidden border border-[var(--color-border)] bg-[var(--color-background-secondary)] shrink-0`}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform hover:scale-105 duration-200"
        loading="lazy"
        onError={(e) => {
          (e.target as HTMLElement).style.display = "none";
        }}
      />
    </div>
  );
};