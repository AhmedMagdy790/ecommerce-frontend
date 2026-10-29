import { useEffect } from "react";

import { useAuthStore } from "@/features/auth/model/store/useAuthStore";
import { subscribeAuthEvents } from "@/features/auth/utils/authChannel";

export function useAuthTabSync() {
    useEffect(() => {
        return subscribeAuthEvents((type) => {
            const authStore = useAuthStore.getState();

            if (type === "LOGOUT") {
                authStore.clearAuth();
                return;
            }

            if (type === "LOGIN") {
                const current = useAuthStore.getState();

                if (current.isAuthenticated && current.accessToken) {
                    return;
                }

                useAuthStore.setState({
                    isInitialized: false,
                });

                void useAuthStore.getState().initializeAuth();
            }
        });
    }, []);
}