import { useMutation } from "@tanstack/react-query";
import { profileApi } from "@/api/client";
import type { UserSingleResponse } from "@/features/users/model/types/user.api";
import { useAuthStore } from "@/features/auth/model/store/useAuthStore";

export function useUpdateAvatar() {
  const setUser = useAuthStore((state) => state.setUser);

  const {
    mutateAsync,
    isPending,
    isError,
    error,
  } = useMutation<UserSingleResponse, Error, File>({
    mutationFn: (file) => {
      const formData = new FormData();
      formData.append("avatar", file);

      return profileApi.updateAvatar(formData);
    },

    onSuccess: (response) => {
      const updatedUser = response.data.user;
      console.log("updatedUser", updatedUser)
      setUser(updatedUser);
    },
  });

  const updateAvatar = (file: File) => mutateAsync(file);

  return {
    updateAvatar,
    isUpdatingAvatar: isPending,
    isError,
    error,
  };
}