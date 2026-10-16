import type { ReactNode } from "react";

import { useAuthStore } from "@/features/auth/model/store/useAuthStore";
import { useLang } from "@/shared/context/LanguageContext";
import FullScreenLoader from "@/shared/components/ui/loding/FullScreenLoader";

interface AppContentGateProps {
  children: ReactNode;
}

export default function AppContentGate({
  children,
}: AppContentGateProps) {
  const isInitialized = useAuthStore(
    (state) => state.isInitialized,
  );

  const { isChangingLanguage } = useLang();

  if (!isInitialized) {
    return (
      <FullScreenLoader message="جاري تهيئة التطبيق..." />
    );
  }

  if (isChangingLanguage) {
    return (
      <FullScreenLoader message="جاري تغيير اللغة..." />
    );
  }

  return <>{children}</>;
}