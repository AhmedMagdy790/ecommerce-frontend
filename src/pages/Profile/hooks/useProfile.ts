import { useMutation } from "@tanstack/react-query";
import { profileApi } from "@/api/client";
import type { UserSingleResponse } from "@/features/users/model/types/user.api";
import type { UpdateProfilePayload } from "@/features/users/model/types/user.dto";
import type { User } from "@/features/users/model/types/user.types";
import { useAuthStore } from "@/features/auth/model/store/useAuthStore";

export function useProfile() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const {
    mutateAsync: updateProfileMutation,
    isPending: isSaving,
  } = useMutation<UserSingleResponse, Error, UpdateProfilePayload>({
    mutationFn: (updatedData) =>
      profileApi.updateProfile(updatedData),

    onSuccess: (response) => {
      const updatedUser = response.data.user;

      setUser(updatedUser);
    },
  });

  const updateProfile = async (
    data: UpdateProfilePayload,
  ): Promise<User> => {
    const response = await updateProfileMutation(data);
    return response.data.user;
  };

  return {
    profile: user ?? undefined,
    isLoading: false,
    isError: false,
    error: null,
    isSaving,
    updateProfile,
  };
}