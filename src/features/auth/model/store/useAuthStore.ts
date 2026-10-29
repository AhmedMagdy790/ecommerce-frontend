import { create } from "zustand";
import { authServices as authService } from "@/features/auth/api/auth.service";
import type { AuthState as IAuthState } from "@/features/auth/types/auth.types";
import type {
    ForgotPasswordDto,
    RegisterDto,
} from "@/features/auth/model/types/auth.dto";
import { getTokenExpiration } from "../../hooks/useTokenExpiration";
import { clearLastTokenActivity, saveLastTokenActivity } from "../../utils/auth.utils";
import { broadcastAuthEvent } from "../../utils/authChannel";
import { handleGlobalError } from "@/shared/errors/handleGlobalError";
import type { User } from "@/features/users/model/types/user.types";
import type { LoginCredentials } from "../types/auth.types";

let refreshPromise: Promise<string> | null = null;

export const useAuthStore = create<IAuthState>()(
    (set, get) => ({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false,
        isLoggingOut: false,
        isInitialized: false,
        isRefreshing: false,
        accessTokenExpiresAt: null,
        lastTokenActivityAt: null,
        

        setUser: (user: User) => set({ user, isAuthenticated: !!user }),
        
        setAccessToken: (accessToken: string | null) => set({ accessToken }),
        
        setInitialized: (val: boolean) => set({ isInitialized: val }),

        clearAuth: () => {
            clearLastTokenActivity();

            set({
                user: null,
                accessToken: null,
                isAuthenticated: false,
                accessTokenExpiresAt: null,
                lastTokenActivityAt: null,
                isInitialized: true,
                isLoggingOut: false,
            });
        },

        
        initializeAuth: async () => {
            console.log("get().isInitialized", get().isInitialized)
            console.log("get().isRefreshing", get().isRefreshing)
            if (get().isInitialized || get().isRefreshing) {
                return;
            }

            set({ isRefreshing: true });

            try {
                const response = await authService.getAccessToken();

                const { accessToken, expires_in } = response.data;

                const expiresInSeconds = Number(expires_in);

                if (
                    !accessToken ||
                    !Number.isFinite(expiresInSeconds) ||
                    expiresInSeconds <= 0
                ) {
                    throw new Error("Invalid access token response");
                }

                set({
                    accessToken,
                    accessTokenExpiresAt: getTokenExpiration(expiresInSeconds),
                    lastTokenActivityAt: saveLastTokenActivity(),
                });

                const meResponse = await authService.me();
                const { user } = meResponse.data;

                if (!user) {
                    throw new Error("User data missing from /auth/me");
                }

                set({
                    user,
                    isAuthenticated: true,
                });
            } catch (error: unknown) {
                handleGlobalError(error, {
                  context: "auth-init"
                });

                set({
                    user: null,
                    accessToken: null,
                    accessTokenExpiresAt: null,
                    lastTokenActivityAt: null,
                    isAuthenticated: false,
                });

                clearLastTokenActivity();
            } finally {
                set({
                    isInitialized: true,
                    isRefreshing: false,
                });
            }
        },
       
        login: async (data: LoginCredentials) => {
            set({ isLoading: true });

            try {
                const response = await authService.login(data);

                const { user, accessToken, expires_in } = response.data;

                if (!accessToken || !user) {
                    throw new Error("بيانات الدخول غير مكتملة");
                }


                set({
                    accessToken,
                    user,
                    lastTokenActivityAt: saveLastTokenActivity(),
                    accessTokenExpiresAt: getTokenExpiration(Number(expires_in)),
                    isAuthenticated: true,
                    isInitialized: true,
                });

                broadcastAuthEvent("LOGIN");

            } catch (error) {
                set({
                    user: null,
                    accessToken: null,
                    isAuthenticated: false,
                });

                throw error;

            } finally {
                set({ isLoading: false });
            }
        },


        logout: async () => {
            set({ isLoggingOut: true });

            try {
                await authService.logout();
            } finally {
                localStorage.removeItem("has_logged_in");
                clearLastTokenActivity();

                set({
                    user: null,
                    accessToken: null,
                    accessTokenExpiresAt: null,
                    lastTokenActivityAt: null,
                    isAuthenticated: false,
                    isInitialized: true,
                    isRefreshing: false,
                    isLoggingOut: false,
                });

                broadcastAuthEvent("LOGOUT");
            }
        },

        createAcount: async (data: RegisterDto) => {
            set({ isLoading: true });
            try {
                const response = await authService.register(data);

                const {
                    user,
                    accessToken
                } = response.data;
                
                if (accessToken) {
                    set({ accessToken });
                }
                
                if (user) {
                    set({ user, isAuthenticated: true, isInitialized: true });
                } else {
                    const meResponse = await authService.me();

                    const {
                        user: fetchedUser
                    } = meResponse.data;
                    
                    set({ user: fetchedUser, isAuthenticated: true, isInitialized: true });
                }
                return;
            } finally {
                set({ isLoading: false });
            }
        },

        forgotPassword: async (data: ForgotPasswordDto) => {
            set({ isLoading: true });
            try {
                const response = await authService.forgotPassword(data);

                const {
                    user
                } = response.data;
     
                if (user) {
                    set({ user });
                } 
                return;
            } finally {
                set({ isLoading: false });
            }
        },


        fetchUser: async () => {
            const response = await authService.me();
            const { user } = response.data;

            set({
                user,
                isAuthenticated: true,
            });
        },
        
        updateAccessToken: async () => {
            if (refreshPromise) {
                return refreshPromise;
            }

            const request = (async () => {
                const response = await authService.getAccessToken();
                const { accessToken, expires_in } = response.data;

                const expiresInSeconds = Number(expires_in);

                if (
                    !accessToken ||
                    !Number.isFinite(expiresInSeconds) ||
                    expiresInSeconds <= 0
                ) {
                    throw new Error("Invalid access token response");
                }

                set({
                    accessToken,
                    accessTokenExpiresAt: getTokenExpiration(expiresInSeconds),
                    lastTokenActivityAt: saveLastTokenActivity(),
                    isAuthenticated: true,
                });

                return accessToken;
            })();

            refreshPromise = request;

            try {
                return await request;
            } finally {
                if (refreshPromise === request) {
                    refreshPromise = null;
                }
            }
        },

        rotateAccessToken: async () => {
            try {
                const response = await authService.rotateRefresh();

                if(response.data.refresh_updated) return true;
                return false;
            } catch (error) {
                set({
                    user: null,
                    accessToken: null,
                    isAuthenticated: false,
                });

                throw error;
            }
        },
    })
    // persist(
    //     // {
    //     //     name: "auth-storage",
    //     //     partialize: (state) => ({ 
    //     //         accessToken: state.accessToken,
    //     //         user: state.user,
    //     //         isAuthenticated: state.isAuthenticated,
    //     //         isInitialized: state.isInitialized
    //     //     }),
    //     // }
    // )
);