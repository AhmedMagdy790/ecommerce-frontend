import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useProfileStore } from "../store/useProfileStore";
import { useLang } from "@/shared/context/LanguageContext";
import { Input } from "@/shared/components/Input";
import { updateProfileSchema, type UpdateProfileInput } from "../schema/profileSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { type IUpdateProfilePayload } from "../types/profileTypes";
import BaseModel from "@/shared/components/BaseModal";
import { useStatusStore } from "@/shared/components/StatusOverlay/statusStore";
import { type IModal } from "@/shared/types/types";
import { useAuthStore } from "@/store/authStore";



export default function EditProfileModal({ isOpen, closeModal }: IModal ) {
  const { t } = useLang();
  const { user } = useAuthStore();
  const { updateProfile, loading } = useProfileStore();
  const { show, hide } = useStatusStore.getState();


  const { register, handleSubmit, reset, formState: { errors } } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user?.name,
      email: user?.email,
      phone: user?.phone || "",
      address: user?.address || "",
    }
  });


  useEffect(() => {
    if (user && isOpen) {
      reset({
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user, isOpen, reset]);

  const onSubmit = async (data: IUpdateProfilePayload) => {
    try {
      show("loading", "جاري تحديث الملف الشخصي");
      await updateProfile(data);
      closeModal();
      show("success", "تم تحديث الملف الشخصي");
      setTimeout(() => hide(), 1200);
    } catch (error) {
      console.error("Failed to update profile", error);
    }
  };

  return (

    
    <BaseModel
      isOpen={isOpen}
      isLoading={loading}
      closeModal={closeModal}
      title={t("profile.edit_profile")}
      description="Update your details to keep your profile up-to-date."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">

        {/* Scroll Area */}
        <div className="custom-scrollbar max-h-[65vh] overflow-y-auto pr-2">

          {/* Section */}
          <div className="mb-6">
            <h5 className="text-lg font-semibold text-gray-800 dark:text-white">
              Personal Information
            </h5>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage your personal details and contact info.
            </p>
          </div>

          {/* Form Grid */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

            <div className="lg:col-span-2">
              <Input
                label="Name"
                placeholder="Enter your name"
                error={errors.name?.message}
                {...register("name")}
              />
            </div>

            <div>
              <Input
                label="Email Address"
                type="email"
                placeholder="example@email.com"
                error={errors.email?.message}
                {...register("email")}
              />
            </div>

            <div>
              <Input
                label="Phone"
                placeholder="+20 10 xxx xxxx"
                error={errors.phone?.message}
                {...register("phone")}
              />
            </div>

            <div className="lg:col-span-2">
              <Input
                label="Address"
                placeholder="Write something about you..."
                error={errors.address?.message}
                {...register("address")}
              />
            </div>

          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-200 dark:bg-gray-800 my-6" />

        {/* Footer */}
        <div className="flex items-center justify-between">

          {/* Hint */}
          <p className="text-xs text-gray-400 hidden sm:block">
            Changes will be saved instantly
          </p>

          <div className="flex gap-3">

            <button
              type="button"
              onClick={closeModal}
              className="px-5 py-2 text-sm font-medium 
              text-gray-700 bg-white border border-gray-300 
              rounded-xl hover:bg-gray-50 
              dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 
              transition-all"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-sm font-medium 
              text-white bg-brand-500 rounded-xl 
              hover:bg-brand-600 
              disabled:opacity-50 
              transition-all 
              shadow-lg shadow-brand-500/20
              flex items-center gap-2"
            >
              {loading && (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {loading ? "Saving..." : "Save Changes"}
            </button>

          </div>
        </div>

      </form>
    </BaseModel>
  );

}