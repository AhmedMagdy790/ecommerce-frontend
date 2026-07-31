import { useEffect, useRef } from "react";
import { useAuthStore } from "@/store/authStore";

export const AuthBootstrap = ({ children }: { children: React.ReactNode }) => {
  const started = useRef(false);
  const { initializeAuth, isInitialized, setInitialized } = useAuthStore();

  useEffect(() => {
    if (started.current || isInitialized) return;
    started.current = true;

    const checkAuth = async () => {
      try {
        await initializeAuth();
      } catch (error: any) {

        if (error.message === "Network Error" || error.code === "ERR_NETWORK") {
          console.warn("⚠️ السيرفر غير متصل (Backend is offline)");
        } else {
          console.log("AUTH FAILED:", error);
        }
      } finally {

        setInitialized(true);
      }
    };

    requestAnimationFrame(() => {
      checkAuth();
    });
  }, [initializeAuth, isInitialized, setInitialized]);

  if (!isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-background)]">
        <div className="flex flex-col items-center gap-[var(--spacing-4)]">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-primary)] border-t-transparent"></div>
          <span className="text-[var(--text-sm)] text-[var(--color-text-secondary)]">جاري الاتصال بالسيرفر...</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};