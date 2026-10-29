
import {
  createContext,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";

import { useAuthStore } from "@/features/auth/model/store/useAuthStore";
import type { User } from "@/features/users/model/types/user.types";
import type { LoginFormData } from "@/features/auth/model/schema/loginSchema";


export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (data: LoginFormData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface Props {
  children: ReactNode;
}

export function AuthProvider({ children }: Props) {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const fetchUser = useAuthStore((state) => state.fetchUser);
  const storeLogin = useAuthStore((state) => state.login);
  const storeLogout = useAuthStore((state) => state.logout);

  const login = useCallback(
    async (data: LoginFormData) => {
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
