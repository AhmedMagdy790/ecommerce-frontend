
import { useTokenExpiration } from "@/features/auth/hooks/useTokenExpiration";
import { useAuthStore } from "@/features/auth/model/store/useAuthStore";


export function TokenExpirationMonitor() {
    const updateAccessToken = useAuthStore(
        (state) => state.updateAccessToken
    );

    console.log("start TokenExpirationMonitor")

    useTokenExpiration({
        refreshBeforeMs: 840_000, // اختبار فقط: 14 دقيقة
        onExpire: async () => {
            try {
                console.log("Refreshing access token early...");
                await updateAccessToken();
                console.log("Access token refreshed successfully");
            } catch (error) {
                console.error("Access token refresh failed:", error);
            }
        },
    });

    return null;
}

