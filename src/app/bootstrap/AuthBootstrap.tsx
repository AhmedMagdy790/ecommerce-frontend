
import { useEffect, type ReactNode } from "react";

import { useAuthStore } from "@/features/auth/model/store/useAuthStore";
import { TokenExpirationMonitor } from "@/features/auth/hooks/TokenExpirationMonitor";

interface Props {
  children: ReactNode;
}

export const AuthBootstrap = ({ children }: Props) => {
  const isInitialized = useAuthStore(
    (state) => state.isInitialized,
  );

  const initializeAuth = useAuthStore(
    (state) => state.initializeAuth,
  );

  useEffect(() => {
    if (isInitialized) return;

    void initializeAuth().catch((error: unknown) => {
      console.error("AUTH BOOTSTRAP FAILED:", error);

      useAuthStore.setState({
        isInitialized: true,
        isRefreshing: false,
      });
    });
  }, [isInitialized, initializeAuth]);

  console.log("isInitialized", isInitialized)

  return (
    <>
      {isInitialized && <TokenExpirationMonitor />}
      {children}
    </>
  );
};
