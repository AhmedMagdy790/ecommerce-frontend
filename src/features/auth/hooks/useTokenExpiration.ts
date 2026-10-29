import { useEffect, useRef } from "react";
import { useAuthStore } from "@/features/auth/model/store/useAuthStore";

const LOG_PREFIX = "[TOKEN EXPIRATION]";
const MAX_TIMEOUT = 2_147_000_000;

export const getTokenExpiration = (expiresIn?: number | null) => {
  if (
    typeof expiresIn !== "number" ||
    !Number.isFinite(expiresIn) ||
    expiresIn <= 0
  ) {
    console.warn(`${LOG_PREFIX} Invalid expiresIn`, { expiresIn });
    return null;
  }

  return Date.now() + expiresIn * 1000;
};

interface UseTokenExpirationOptions {
  onExpire?: () => void | Promise<void>;
  refreshBeforeMs?: number;
  idleTimeoutMs?: number;
}

export function useTokenExpiration({
  onExpire,
  refreshBeforeMs = 60_000,
  idleTimeoutMs = 5 * 60_000,
}: UseTokenExpirationOptions = {}) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const expiresAt = useAuthStore((state) => state.accessTokenExpiresAt);

  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    if (!accessToken || expiresAt === null) {
      return;
    }

    let timer: number | undefined;
    let disposed = false;
    let refreshing = false;
    let lastActivityAt = Date.now();

    const clearTimer = () => {
      if (timer !== undefined) {
        window.clearTimeout(timer);
        timer = undefined;
      }
    };

    const isActive = () =>
      document.visibilityState === "visible" &&
      Date.now() - lastActivityAt < idleTimeoutMs;

    const scheduleCheck = (delay: number) => {
      clearTimer();

      timer = window.setTimeout(() => {
        void checkExpiration();
      }, Math.max(0, Math.min(delay, MAX_TIMEOUT)));
    };

    const checkExpiration = async () => {
      clearTimer();

      if (disposed) return;

      if (!isActive()) {
        if (document.visibilityState === "visible") {
          const idleRemaining =
            idleTimeoutMs - (Date.now() - lastActivityAt);

          scheduleCheck(Math.max(1, idleRemaining));
        }

        return;
      }

      const timeUntilRefresh = expiresAt - Date.now() - refreshBeforeMs;

      if (timeUntilRefresh > 0) {
        const idleRemaining =
          idleTimeoutMs - (Date.now() - lastActivityAt);

        scheduleCheck(Math.min(timeUntilRefresh, idleRemaining));
        return;
      }

      if (refreshing) return;

      refreshing = true;

      try {
        await onExpireRef.current?.();
      } catch (error: unknown) {
        console.error(`${LOG_PREFIX} Refresh failed`, error);
      } finally {
        refreshing = false;
      }
    };

    const handleActivity = () => {
      const wasInactive = !isActive();

      lastActivityAt = Date.now();
      
      if (wasInactive) {
        void checkExpiration();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        void checkExpiration();
      } else {
        clearTimer();
      }
    };

    const activityEvents: (keyof DocumentEventMap)[] = [
      "mousemove",
      "mousedown",
      "keydown",
      "touchstart",
      "scroll",
      "pointerdown",
    ];

    activityEvents.forEach((event) => {
      document.addEventListener(event, handleActivity, {
        passive: true,
      });
    });

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange,
    );

    void checkExpiration();

    return () => {
      disposed = true;
      clearTimer();

      activityEvents.forEach((event) => {
        document.removeEventListener(event, handleActivity);
      });

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange,
      );
    };
  }, [accessToken, expiresAt, refreshBeforeMs, idleTimeoutMs]);
}