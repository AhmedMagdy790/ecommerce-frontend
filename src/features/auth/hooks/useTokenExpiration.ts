
import { useEffect, useRef } from "react";
import { useAuthStore } from "@/features/auth/model/store/useAuthStore";


export const getTokenExpiration = (expiresIn?: number | null) => {
    if (typeof expiresIn !== "number" || expiresIn <= 0) {
        return null;
    }

    return Date.now() + expiresIn * 1000;
};

const MAX_TIMEOUT = 2_147_000_000;

interface UseTokenExpirationOptions {
    onExpire?: () => void | Promise<void>;
    refreshBeforeMs?: number;
}

export function useTokenExpiration({
    onExpire,
    refreshBeforeMs = 60_000,
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

    console.log("accessToken", accessToken)
    console.log("expiresAt", expiresAt)

    useEffect(() => {
        if (!accessToken || expiresAt === null) return;

        let timer: number | undefined;
        let handled = false;

        const clearTimer = () => {
            if (timer !== undefined) {
                window.clearTimeout(timer);
                timer = undefined;
            }
        };

        const checkExpiration = () => {
            clearTimer();

            if (handled) return;

            const remaining = expiresAt - Date.now();
            const timeUntilRefresh = remaining - refreshBeforeMs;

            console.log("Token remaining:", Math.round(remaining / 1000), "seconds");
            console.log("Refresh scheduled in:", Math.round(timeUntilRefresh / 1000), "seconds");

            if (timeUntilRefresh <= 0) {
                handled = true;

                console.log("Refreshing access token early...");

                void onExpireRef.current?.();
                return;
            }

            timer = window.setTimeout(
                checkExpiration,
                Math.min(timeUntilRefresh, MAX_TIMEOUT)
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
    }, [accessToken, expiresAt, refreshBeforeMs]);
}

