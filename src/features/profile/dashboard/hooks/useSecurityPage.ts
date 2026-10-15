import { useTranslation } from "react-i18next";
import { usePasswordForm } from "./usePasswordForm";

export function useSecurityPage() {
  const { t } = useTranslation("profile");

  const passwordForm = usePasswordForm(() => {
    // يمكنك إضافة إشعار نجاح (Toast) هنا لاحقاً
    console.log("Password updated successfully");
  });

  return {
    t,
    passwordForm,
  };
}