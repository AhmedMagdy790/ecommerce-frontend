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

    const expiresAt = Date.now() + expiresIn * 1000;

    console.log(`${LOG_PREFIX} Expiration calculated`, {
        now: new Date().toISOString(),
        expiresInSeconds: expiresIn,
        expiresAt: new Date(expiresAt).toISOString(),
    });

    return expiresAt;
};

interface UseTokenExpirationOptions {
    onExpire?: () => void | Promise<void>;
    refreshBeforeMs?: number;
}

export function useTokenExpiration({
    onExpire,
    refreshBeforeMs = 60_000,
}: UseTokenExpirationOptions = {}) {
    console.log("start useTokenExpiration")

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
        let handled = false;

        const clearTimer = () => {
            if (timer !== undefined) {

                window.clearTimeout(timer);
                timer = undefined;
            }
        };

        const checkExpiration = () => {
            clearTimer();

            if (handled) {
                console.log(`${LOG_PREFIX} Check skipped: already handled`);
                return;
            }

            const now = Date.now();
            const remaining = expiresAt - now;
            const timeUntilRefresh = remaining - refreshBeforeMs;

 

            if (timeUntilRefresh <= 0) {
                handled = true;

                Promise.resolve(onExpireRef.current?.())
                    .then(() => {
                        console.log(
                            `${LOG_PREFIX} onExpire completed successfully`
                        );
                    })
                    .catch((error: unknown) => {
                        console.error(
                            `${LOG_PREFIX} onExpire failed`,
                            error
                        );
                    });

                return;
            }

            const delay = Math.min(timeUntilRefresh, MAX_TIMEOUT);

            timer = window.setTimeout(checkExpiration, delay);
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