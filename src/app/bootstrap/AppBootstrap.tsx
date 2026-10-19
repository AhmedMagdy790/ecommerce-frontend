import { useEffect, useRef, type ReactNode } from "react";
import { bootstrapApp } from "./bootstrapApp";

interface AppBootstrapProps {
  children: ReactNode;
}

export function AppBootstrap({ children }: AppBootstrapProps) {
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    requestAnimationFrame(() => {
      bootstrapApp().catch((error) => {
        console.error("AppBootstrap execution failed:", error);
      });
    });
  }, []);

  return <>{children}</>;
}