import { useCallback } from "react";

import { useTokenExpiration } from "@/features/auth/hooks/useTokenExpiration";
import { useAuthStore } from "@/features/auth/model/store/useAuthStore";

export function TokenExpirationMonitor() {
  const updateAccessToken = useAuthStore(
    (state) => state.updateAccessToken,
  );

  const handleExpire = useCallback(async () => {
    console.log("[TOKEN EXPIRATION] Refreshing active session");
    await updateAccessToken();
  }, [updateAccessToken]);

  useTokenExpiration({
    refreshBeforeMs: 60_000,
    idleTimeoutMs: 5 * 60_000,
    onExpire: handleExpire,
  });

  return null;
}