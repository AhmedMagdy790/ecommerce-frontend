// src/features/profile/dashboard/pages/AddressPage.tsx

import { HeaderDashboard } from "@/shared/components/HeaderDashboard";
import { useAddressPage } from "../hooks/useAddressPage";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/shared/components/ui/form";

export default function AddressPage() {
  const { t, methods, onSubmit, isSubmitting } = useAddressPage();

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-3xl mx-auto">
      {/* Header Dashboard */}
      <HeaderDashboard
        t={t}
        title={t("profile.address.page_title", "Shipping & Billing Address")}
      />

      <Form {...methods}>
        <form 
          onSubmit={onSubmit}
          className="bg-white dark:bg-gray-800 p-6 lg:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-6"
        >
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {t("profile.address.heading", "Edit Address")}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {t("profile.address.subheading", "Update your default delivery location and address information.")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Country Field */}
            <FormField
              control={methods.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("profile.fields.country", "Country")}</FormLabel>
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

            {/* City Field */}
            <FormField
              control={methods.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("profile.fields.city", "City")}</FormLabel>
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Street Field */}
            <FormField
              control={methods.control}
              name="street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("profile.fields.street", "Street Address")}</FormLabel>
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

            {/* Postal Code Field */}
            <FormField
              control={methods.control}
              name="postal_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("profile.fields.postal_code", "Postal Code")}</FormLabel>
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
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-gray-700">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50 font-medium text-sm shadow-sm"
            >
              {isSubmitting ? t("common.saving", "Saving...") : t("profile.address.update_address", "Save Address")}
            </button>
          </div>
        </form>
      </Form>
    </div>
  );
}