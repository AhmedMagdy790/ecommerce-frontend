import { useMutation } from "@tanstack/react-query";

import { loginService } from "../services/auth.service";

import { setAccessToken } from "@/api/token";

// import { useAuthStore } from "../store/auth.store";

import type { LoginPayload } from "../types/auth.types";

export function useLogin() {
  // const setUser = useAuthStore((state) => state.setUser);

  const mutation = useMutation({
    mutationFn: (payload: LoginPayload) => loginService(payload),

    onSuccess(data) {
      setAccessToken(data.accessToken);

      // setUser(data.user);
    },
  });

  return {
    login: mutation.mutateAsync,

    isLoading: mutation.isPending,

    error: mutation.error,
  };
}
