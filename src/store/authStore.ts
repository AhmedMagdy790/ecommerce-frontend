import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authService } from "@/features/dashboard/auth/services/authService";
import type { IAuthState, IUser, ILoginPayload, IRegisterPayload, IUserUpdatePayload } from "@/features/dashboard/auth/types/authType";


export const useAuthStore = create<IAuthState>()(
    (set, get) => ({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false,
        isLoggingOut: false,
        isInitialized: false,
        isRefreshing: false,

        setUser: (user: IUser) => set({ user, isAuthenticated: !!user }),
        
        setAccessToken: (accessToken: string | null) => set({ accessToken }),
        
        setInitialized: (val: boolean) => set({ isInitialized: val }),

        clearAuth: () => set({ user: null, accessToken: null, isAuthenticated: false, isInitialized: true, isLoggingOut: false }),

        initializeAuth: async () => {
            const state = get();

            if (state.isInitialized || state.isRefreshing) return;

            set({ isRefreshing: true });
            
            try {
                const tokenData = await authService.updateAccessToken();
                const newToken = tokenData?.data.accessToken; 

                if (!newToken) {
                    throw new Error("No access token returned");
                }

                set({ accessToken: newToken });

                const meResponse = await authService.me();
                const { user } = meResponse.data;

                set({
                    user,
                    isAuthenticated: true,
                });

            } catch (error) {
                console.log("Session refresh failed on app init", error);
                set({
                    user: null,
                    accessToken: null,
                    isAuthenticated: false,
                });
            } finally {
                set({ 
                    isInitialized: true, 
                    isRefreshing: false 
                });
            }
        },

        login: async (data: ILoginPayload) => {
            set({ isLoading: true });

            try {
                const response = await authService.login(data);

                const {
                    user,
                    accessToken
                } = response.data;

                if (!accessToken || !user) {
                    throw new Error("بيانات الدخول غير مكتملة");
                }

                set({
                    accessToken,
                    user,
                    isAuthenticated: true,
                    isInitialized: true,
                });

            } catch (error) {
                set({
                    user: null,
                    accessToken: null,
                    isAuthenticated: false,
                });

                throw error;

            } finally {
                set({
                    isLoading: false,
                });
            }
        },

        createAcount: async (data: IRegisterPayload) => {
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

        logout: async () => {
            set({ isLoggingOut: true });
            try {
                await authService.logout();
            } finally {
                set({ user: null, accessToken: null, isAuthenticated: false, isLoggingOut: false });
            }
        },

        fetchUser: async () => {
            try {
                const response = await authService.me();

                const { user } = response.data;

                set({
                    user,
                    isAuthenticated: true,
                });

            } catch (error) {
                console.log("fetchUser error", error);

                set({
                    user: null,
                    accessToken: null,
                    isAuthenticated: false,
                });

            } finally {
                set({
                    isInitialized: true,
                });
            }
        },

        updateAccessToken: async () => {
            try {
                const response = await authService.updateAccessToken();
                
                const {
                    accessToken
                } = response.data;

                set({ accessToken });

                return accessToken;

            } catch (error) {
                set({
                    user: null,
                    accessToken: null,
                    isAuthenticated: false,
                });

                throw error;
            }
        },

        rotateAccessToken: async () => {
            try {
                const response = await authService.rotateAccessToken();

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

        updateProfile: async (data: IUserUpdatePayload) => {
            const response = await authService.updateProfile(data);

            const { user } = response.data;
            set({ user });

            return user;
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