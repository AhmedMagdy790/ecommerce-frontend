import { useContext } from "react";
import { AuthContext } from "@/app/providers/AuthProvider";
import type { IAuthState } from "@/features/dashboard/auth/types/authType";

export function useAuth(): IAuthState {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within an AuthProvider"
    );
  }

  return context;
}