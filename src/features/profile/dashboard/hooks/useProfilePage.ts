import { useTranslation } from "react-i18next";
import { useProfileForm } from "./useProfileForm";
import { useAuthStore } from "@/features/auth/model/store/useAuthStore";

export function useProfilePage() {
  const { t } = useTranslation("profile");
  const { user } = useAuthStore();

  const profileForm = useProfileForm(user, () => {
    // TODO: Add success toast notification here
    console.log("Profile updated successfully");
  });

  return {
    t,
    user,
    profileForm,
  };
}