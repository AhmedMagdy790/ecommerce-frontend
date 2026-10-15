import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi, profileApi } from "@/api/client";
import type { UserProfile } from "@/shared/types/userType";

const PROFILE_QUERY_KEY = ["profile"];

interface UpdateProfilePayload {
  name: string;
  email: string;
  phone?: string;
}

export function useProfile() {
  const queryClient = useQueryClient();

  const { 
    data: profile, 
    isLoading, 
    isError, 
    error 
  } = useQuery<UserProfile, Error>({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: async () => {
      const response = await authApi.me();
      // استخراج الـ user مباشرة من الاستجابة بناءً على شكل الـ API لديك
      return response.data?.user;
    },
    staleTime: 1000 * 60 * 5, 
    retry: 2, 
  });

  const { 
    mutateAsync: updateProfile, 
    isPending: isSaving 
  } = useMutation<UserProfile, Error, UpdateProfilePayload>({
    mutationFn: async (updatedData) => {
      return await profileApi.updateProfile<UserProfile, UpdateProfilePayload>(updatedData);
    },
    onSuccess: (response) => { // افترضنا أن الاستجابة تحتوي على الـ message القادمة من السيرفر
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      
      void response;
    },
    onError: (err: unknown) => {
      // ✅ 2. مكان وضع رسالة الخطأ (تظهر للمستخدم عند الفشل)

      throw err;
      // const errorMessage = handleServerErrors(err);
    },
  });

  return {
    profile,
    isLoading,
    isError,
    error,
    isSaving,
    updateProfile,
  };
}