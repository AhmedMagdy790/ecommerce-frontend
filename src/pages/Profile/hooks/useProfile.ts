import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { handleServerErrors } from "@/shared/utils/handleServerError";
import { authApi } from "@/api/client";
import type { UserProfile } from "@/shared/types/userType";
import toast from "react-hot-toast";

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
      const response: any = await authApi.me();
      // استخراج الـ user مباشرة من الاستجابة بناءً على شكل الـ API لديك
      return response.data?.user || response.data || response;
    },
    staleTime: 1000 * 60 * 5, 
    retry: 2, 
  });

  const { 
    mutateAsync: updateProfile, 
    isPending: isSaving 
  } = useMutation<UserProfile, Error, UpdateProfilePayload>({
    mutationFn: async (updatedData) => {
      return await authApi.updateProfile<UserProfile, UpdateProfilePayload>(updatedData);
    },
    onSuccess: (response: any) => { // افترضنا أن الاستجابة تحتوي على الـ message القادمة من السيرفر
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      
      // ✅ 1. مكان وضع رسالة النجاح (تظهر للمستخدم عند النجاح)
      const successMessage = response?.message || "Profile info updated successfully";
      toast.success(successMessage);
    },
    onError: (err) => {
      // ✅ 2. مكان وضع رسالة الخطأ (تظهر للمستخدم عند الفشل)
      const errorMessage = handleServerErrors(err);
      toast.error(errorMessage);
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