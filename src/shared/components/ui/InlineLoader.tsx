// src/components/ui/InlineLoader.tsx
import { Loader2 } from "lucide-react";

export function InlineLoader() {
    
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-[var(--color-primary)]">
      <Loader2 className="h-3.5 w-3.5 animate-spin" />
      <span>جاري الحساب...</span>
    </span>
  );
}