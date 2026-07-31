import {
  createContext,
  useMemo,
  type ReactNode,
} from "react";
import { useAuthStore } from "@/store/authStore";
import type { IUser as User } from "@/features/dashboard/auth/types/authType";

export type { User };

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (data?: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

interface Props {
  children: ReactNode;
}

export function AuthProvider({ children }: Props) {
  const { 
    user, 
    isAuthenticated, 
    isLoading: storeLoading, 
    isInitialized, 
    fetchUser, 
    login: storeLogin, 
    logout: storeLogout, 
  } = useAuthStore();

  const loading = storeLoading && !isInitialized;

  async function login(data?: any) {
    if (data) {
      await storeLogin(data);
    }
  }

  async function logout() {
    await storeLogout();
  }

  async function refreshUser() {
    await fetchUser();
  }

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated,
      login,
      logout,
      refreshUser,
    }),
    [user, loading, isAuthenticated]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}