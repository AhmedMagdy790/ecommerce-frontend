import type { ReactNode } from "react";

import { useAuthStore } from "@/features/auth/model/store/useAuthStore";
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

  if (!isInitialized) {
    return (
      <FullScreenLoader message="جاري تهيئة التطبيق..." />
    );
  }

  return <>{children}</>;
}