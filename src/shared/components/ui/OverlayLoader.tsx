// src/components/ui/OverlayLoader.tsx
import { Loader2 } from "lucide-react";

export function OverlayLoader({ message = "جاري معالجة الطلب..." }: { message?: string }) {
  return (
    <div className="absolute inset-0 bg-background/60 backdrop-blur-xs flex flex-col items-center justify-center rounded-xl z-50 gap-2">
      <Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary)]" />
      <p className="text-xs font-medium text-[var(--color-text)]">{message}</p>
    </div>
  );
}