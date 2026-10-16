
import { useEffect, useRef } from "react";
import { useAuthStore } from "@/features/auth/model/store/useAuthStore";


export const getTokenExpiration = (expiresIn?: number | null) => {
    if (typeof expiresIn !== "number" || expiresIn <= 0) {
        return null;
    }

    return Date.now() + expiresIn * 1000;
};

interface UseTokenExpirationOptions {
    onExpire?: () => void;
}

const MAX_TIMEOUT = 2_147_000_000;

export function useTokenExpiration({
    onExpire,
}: UseTokenExpirationOptions = {}) {
    const accessToken = useAuthStore(
        (state) => state.accessToken
    );

    const expiresAt = useAuthStore(
        (state) => state.accessTokenExpiresAt
    );

    const onExpireRef = useRef(onExpire);

    useEffect(() => {
        onExpireRef.current = onExpire;
    }, [onExpire]);

    useEffect(() => {
        if (!accessToken || expiresAt === null) {
            return;
        }

        let timer: number | undefined;
        let expiredHandled = false;

        const clearTimer = () => {
            if (timer !== undefined) {
                window.clearTimeout(timer);
                timer = undefined;
            }
        };

        const checkExpiration = () => {
            clearTimer();

            if (expiredHandled) {
                return;
            }

            const remaining = expiresAt - Date.now();

            if (remaining <= 0) {
                expiredHandled = true;
                onExpireRef.current?.();
                return;
            }

            timer = window.setTimeout(
                checkExpiration,
                Math.min(remaining, MAX_TIMEOUT)
            );
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                checkExpiration();
            }
        };

        checkExpiration();

        document.addEventListener(
            "visibilitychange",
            handleVisibilityChange
        );

        return () => {
            clearTimer();

            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange
            );
        };
    }, [accessToken, expiresAt]);
}
