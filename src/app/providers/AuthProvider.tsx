
import {
  createContext,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";

import { useAuthStore } from "@/features/auth/model/store/useAuthStore";
import type { User } from "@/features/auth/model/types/user.types";
import type { LoginDto } from "@/features/auth/model/types/user.dto";
import { useTokenExpiration } from "@/features/auth/hooks/useTokenExpiration";

export type { User };

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (data: LoginDto) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface Props {
  children: ReactNode;
}

export function AuthProvider({ children }: Props) {
  const {
    user,
    isAuthenticated,
    isLoading,
    isInitialized,
    fetchUser,
    login: storeLogin,
    logout: storeLogout,
    updateAccessToken,
  } = useAuthStore();

  useTokenExpiration({
    onExpire: async () => {
      try {
        await updateAccessToken();
      } catch (error) {
        console.error("Failed to refresh access token:", error);
        await storeLogout();
      }
    },
  });

  const login = useCallback(
    async (data: LoginDto) => {
      await storeLogin(data);
    },
    [storeLogin],
  );

  const logout = useCallback(async () => {
    await storeLogout();
  }, [storeLogout]);

  const refreshUser = useCallback(async () => {
    await fetchUser();
  }, [fetchUser]);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      isAuthenticated,
      loading: !isInitialized || isLoading,
      login,
      logout,
      refreshUser,
    }),
    [
      user,
      isAuthenticated,
      isInitialized,
      isLoading,
      login,
      logout,
      refreshUser,
    ],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
