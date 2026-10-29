import { useMutation } from "@tanstack/react-query";
import { profileApi } from "@/api/client";
import type { UpdatePasswordDto } from "@/features/users/model/types/user.dto";

export function useUpdatePassword() {
  const {
    mutateAsync,
    isPending,
    isError,
    error,
    isSuccess,
    reset,
  } = useMutation<unknown, Error, UpdatePasswordDto>({
    mutationFn: (data) => profileApi.updatePassword(data),
  });

  const updatePassword = (data: UpdatePasswordDto) =>
    mutateAsync(data);

  return {
    updatePassword,
    isUpdatingPassword: isPending,
    isError,
    error,
    isSuccess,
    reset,
  };
}