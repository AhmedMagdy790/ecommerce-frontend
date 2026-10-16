import { LoaderCircle } from "lucide-react";

interface FullScreenLoaderProps {
  message?: string;
}

export default function FullScreenLoader({
  message = "جاري تحميل التطبيق...",
}: FullScreenLoaderProps) {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center gap-4"
      role="status"
      aria-live="polite"
    >
      <LoaderCircle
        className="size-10 animate-spin text-primary"
        aria-hidden="true"
      />

      <p className="text-sm text-muted-foreground">
        {message}
      </p>
    </div>
  );
}