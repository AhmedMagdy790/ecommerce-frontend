import axiosInstance from "@/api/axios-instance";
import { API_ENDPOINTS } from "@/api/endpoints";
import type { IUpdatePasswordPayload, IUpdateProfilePayload } from "../types/profileTypes";

const { profile } = API_ENDPOINTS;

const unwrap = (response: any) => response.data?.data ?? response.data ?? response;

export const profileService = {
  /** تحديث بيانات الملف الشخصي (يدعم النص والملفات) */
  async updateProfileInfo(payload: IUpdateProfilePayload) {
    const formData = new FormData();
    
    // إضافة البيانات الأساسية
    formData.append("name", payload.name);
    formData.append("email", payload.email);
    if (payload.phone) formData.append("phone", payload.phone);
    if (payload.address) formData.append("address", payload.address);
    
    // إضافة الصورة إذا وجدت
    if (payload.avatar instanceof File) {
      formData.append("avatar", payload.avatar);
    }

    return unwrap(
      await axiosInstance.post(profile.update, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
    );
  },

  /** تحديث كلمة المرور */
  async updatePassword(payload: IUpdatePasswordPayload) {
    return unwrap(await axiosInstance.post(profile.updatePassword, payload));
  }
};