
import { useEffect, useRef, type ReactNode } from "react";

import { useAuthStore } from "@/features/auth/model/store/useAuthStore";
import { TokenExpirationMonitor } from "@/features/auth/hooks/TokenExpirationMonitor";
import { useAuthTabSync } from "@/features/auth/hooks/useAuthTabSync";

interface Props {
  children: ReactNode;
}

export const AuthBootstrap = ({ children }: Props) => {
  useAuthTabSync();

  const isInitialized = useAuthStore(
    (state) => state.isInitialized,
  );

  const isRefreshing = useAuthStore(
    (state) => state.isRefreshing,
  );

  const initializeAuth = useAuthStore(
    (state) => state.initializeAuth,
  );

  const initializationStarted = useRef(false);

  useEffect(() => {
    if (
      isInitialized ||
      isRefreshing ||
      initializationStarted.current
    ) {
      return;
    }

    initializationStarted.current = true;

    void initializeAuth()
      .catch((error: unknown) => {
        console.error(
          "[AUTH BOOTSTRAP] Initialization failed:",
          error,
        );

        useAuthStore.setState({
          isInitialized: true,
          isRefreshing: false,
        });
      })
      .finally(() => {
        initializationStarted.current = false;
      });
  }, [isInitialized, isRefreshing, initializeAuth]);

  return (
    <>
      {isInitialized && <TokenExpirationMonitor />}
      {children}
    </>
  );
};
