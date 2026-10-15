import { useEffect, useRef, type ReactNode } from "react";
import { useAuthStore } from "@/features/auth/model/store/useAuthStore";
import AuthLoader from "@/features/auth/components/AuthLoader";

interface Props {
  children: ReactNode;
}

export const AuthBootstrap = ({ children }: Props) => {
  const started = useRef(false);

  const isInitialized = useAuthStore(
    (state) => state.isInitialized
  );

  const initializeAuth = useAuthStore(
    (state) => state.initializeAuth
  );

  useEffect(() => {
    if (started.current || isInitialized) {
      return;
    }

    started.current = true;

    requestAnimationFrame(() => {
      initializeAuth().catch((error: unknown) => {
        if (
          error instanceof Error &&
          error.message === "Network Error"
        ) {
          console.warn("⚠️ السيرفر غير متصل");
        } else {
          console.error("AUTH FAILED:", error);
        }
      });
    });
  }, [initializeAuth, isInitialized]);

  if (!isInitialized) return <AuthLoader />;

  return <>{children}</>;
};