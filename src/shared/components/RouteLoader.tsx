// src/shared/components/RouteLoader.tsx

import { Suspense, type ReactNode } from "react";
import { PageLoader } from "./LazyRoute";


interface RouteLoaderProps {
  enabled?: boolean;
  children: ReactNode;
}

export function RouteLoader({
  enabled = true,
  children,
}: RouteLoaderProps) {
  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <Suspense fallback={<PageLoader />}>
      {children}
    </Suspense>
  );
}