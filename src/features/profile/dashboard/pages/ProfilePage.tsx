// src/features/profile/dashboard/pages/ProfilePage.tsx
import { useAuthStore } from "@/features/auth/model/store/useAuthStore";
import { HeaderDashboard } from "@/shared/components/HeaderDashboard";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/shared/components/ui/form";
import { useTranslation } from "react-i18next";
import { useProfileForm } from "../hooks/useProfileForm";

export default function ProfilePage() {
  const { t } = useTranslation();
  const currentUser = useAuthStore((state) => state.user);

  const {
    methods,
    onSubmit,
    isSubmitting,
  } = useProfileForm(currentUser);

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-3xl mx-auto">
      <HeaderDashboard
        t={t}
        title={t("profile.title", "Profile Settings")}
      />

      <Form {...methods}>
        <form
          onSubmit={onSubmit}
          className="bg-white dark:bg-gray-800 p-6 lg:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-6"
        >
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t("profile.general.heading", "Personal Information")}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {t("profile.general.subheading", "Update your personal details and email address.")}
            </p>
          </div>

          {/* Name Field */}
          <FormField
            control={methods.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("profile.fields.name", "Full Name")}</FormLabel>
                <FormControl>
                  <input
                    type="text"
                    {...field}
                    className="w-full px-4 py-2 border rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email Field */}
          <FormField
            control={methods.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("profile.fields.email", "Email Address")}</FormLabel>
                <FormControl>
                  <input
                    type="email"
                    {...field}
                    className="w-full px-4 py-2 border rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone Field */}
          <FormField
            control={methods.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("profile.fields.phone", "Phone Number")}</FormLabel>
                <FormControl>
                  <input
                    type="text"
                    {...field}
                    value={field.value ?? ""}
                    className="w-full px-4 py-2 border rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-700">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50 font-medium text-sm shadow-sm"
            >
              {isSubmitting ? t("common.saving", "Saving...") : t("common.save", "Save Changes")}
            </button>
          </div>
        </form>
      </Form>
    </div>
  );
}