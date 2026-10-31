import { useEffect, type ReactNode } from "react";

import { useAuthStore } from "@/features/auth/model/store/useAuthStore";
import FullScreenLoader from "@/shared/components/ui/loding/FullScreenLoader";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";

interface AppContentGateProps {
  children: ReactNode;
}

export default function AppContentGate({
  children,
}: AppContentGateProps) {
  const isInitialized = useAuthStore(
    (state) => state.isInitialized,
  );

  const { isChangingTheme } = useTheme();
  const { isChangingLanguage } = useLanguage();

  const isLoading =
    !isInitialized ||
    isChangingLanguage ||
    isChangingTheme;

  useEffect(() => {
    if (!isLoading) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isLoading]);

  if (!isInitialized) {
    return <FullScreenLoader message="جاري تهيئة التطبيق..." />;
  }

  if (isChangingLanguage) {
    return <FullScreenLoader message="جاري تغيير اللغة..." />;
  }

  if (isChangingTheme) {
    return <FullScreenLoader message="جاري تغيير المظهر..." />;
  }

  return <>{children}</>;
}