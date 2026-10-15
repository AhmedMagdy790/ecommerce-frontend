import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// تعريف Schema بسيطة للعنوان (يمكنك تعديلها حسب حقول قاعدة البيانات لديك)
const addressSchema = z.object({
  country: z.string().min(1, "Country is required"),
  city: z.string().min(1, "City is required"),
  street: z.string().min(1, "Street address is required"),
  postal_code: z.string().optional(),
});

type AddressFormData = z.infer<typeof addressSchema>;

export function useAddressPage() {
  const { t } = useTranslation("profile");

  const methods = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      country: "",
      city: "",
      street: "",
      postal_code: "",
    },
  });

  const onSubmit = methods.handleSubmit(async (data) => {
    try {
      console.log("Submitting address data:", data);
      // TODO: استدعاء الـ API لحفظ العنوان
    } catch (error) {
      console.error("Failed to update address:", error);
    }
  });

  return {
    t,
    methods,
    onSubmit,
    isSubmitting: methods.formState.isSubmitting,
  };
}