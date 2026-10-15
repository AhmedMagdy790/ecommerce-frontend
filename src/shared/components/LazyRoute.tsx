import { Suspense, type LazyExoticComponent, type ComponentType } from "react";

export const PageLoader = () => (
  <div className="flex items-center justify-center w-full h-[50vh]">
    <div className="w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
  </div>
);

interface LazyRouteProps {
  component: LazyExoticComponent<ComponentType<any>>;
}

export function LazyRoute({
  component: Component,
}: LazyRouteProps) {
  return (
    <Suspense fallback={<PageLoader />}>
      <Component />
    </Suspense>
  );
}