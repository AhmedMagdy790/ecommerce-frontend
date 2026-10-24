
import { useTokenExpiration } from "@/features/auth/hooks/useTokenExpiration";
import { useAuthStore } from "@/features/auth/model/store/useAuthStore";


export function TokenExpirationMonitor() {
    const updateAccessToken = useAuthStore(
        (state) => state.updateAccessToken
    );


    useTokenExpiration({
        refreshBeforeMs: 60_000,
        onExpire: async () => {
            try {
                await updateAccessToken();
            } catch (error) {
                console.error(
                    "Access token refresh failed:",
                    error
                );
            }
        },
    });

    return null;
}

