// src/features/profile/dashboard/pages/SecurityPage.tsx

import { HeaderDashboard } from "@/shared/components/HeaderDashboard";
import { useSecurityPage } from "../hooks/useSecurityPage";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/shared/components/ui/form";

export default function SecurityPage() {
  const { t, passwordForm } = useSecurityPage();
  const { methods, onSubmit, isSubmitting } = passwordForm;

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-3xl mx-auto">
      {/* Header Dashboard */}
      <HeaderDashboard
        t={t}
        title={t("profile.security.page_title", "Security & Password")}
      />

      <Form {...methods}>
        <form 
          onSubmit={onSubmit}
          className="bg-white dark:bg-gray-800 p-6 lg:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-6"
        >
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t("profile.security.heading", "Change Password")}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {t("profile.security.subheading", "Ensure your account is using a long, random password to stay secure.")}
            </p>
          </div>

          {/* Current Password Field */}
          <FormField
            control={methods.control}
            name="current_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("profile.fields.current_password", "Current Password")}</FormLabel>
                <FormControl>
                  <input
                    type="password"
                    {...field}
                    className="w-full px-4 py-2 border rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* New Password Field */}
            <FormField
              control={methods.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("profile.fields.new_password", "New Password")}</FormLabel>
                  <FormControl>
                    <input
                      type="password"
                      {...field}
                      className="w-full px-4 py-2 border rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Password Field */}
            <FormField
              control={methods.control}
              name="password_confirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("profile.fields.confirm_password", "Confirm Password")}</FormLabel>
                  <FormControl>
                    <input
                      type="password"
                      {...field}
                      className="w-full px-4 py-2 border rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-700">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50 font-medium text-sm shadow-sm"
            >
              {isSubmitting ? t("common.saving", "Saving...") : t("profile.security.update_password", "Update Password")}
            </button>
          </div>
        </form>
      </Form>
    </div>
  );
}