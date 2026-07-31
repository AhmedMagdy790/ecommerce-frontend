import React, { useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import BaseModel from "@/shared/components/BaseModal";
import { Input } from "@/shared/components/Input";
import { Button } from "@/shared/components/Button";
import CustomSelect from "@/shared/components/CustomSelect";
import TextArea from "@/shared/components/dashboard/form/input/TextArea";

import { useStatusStore } from "@/shared/components/StatusOverlay/statusStore";
import { useShippingCourierStore } from "../store/useShippingCourierStore";
import { handleServerErrors } from "@/shared/utils/handleServerError";
import { type IShippingCourier } from "../types/types";

import {
  shippingCourierSchema,
  type ShippingCourierFormData,
} from "../schema/shippingCourierSchema";

interface IShippingCourierModal {
  isOpen: boolean;
  closeModal: () => void;
  courier?: IShippingCourier | null;
}

export default function ShippingCourierModal({
  isOpen,
  closeModal,
  courier,
}: IShippingCourierModal) {
  const { show, hide } = useStatusStore.getState();
  const { addShippingCourier, updateShippingCourier, isLoading } = useShippingCourierStore();
  const formRef = useRef<HTMLFormElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    setError,
    formState: { errors },
  } = useForm<ShippingCourierFormData>({
    resolver: zodResolver(shippingCourierSchema),
    defaultValues: {
      name: {
        ar: "",
        en: "",
      },
      logo: "",
      description: "",
      code: "",
      phone: "",
      email: "",
      driver: "",
      api_endpoint: null,
      api_key: "",
      tracking_url: "",
      is_active: true,
      supports_cod: false,
    },
  });

  useEffect(() => {
    if (!isOpen) return;

    if (courier) {
      reset({
        name: typeof courier.name === "object" && courier.name !== null 
          ? { ar: courier.name.ar || "", en: courier.name.en || "" } 
          : { ar: String(courier.name || ""), en: "" },
        logo: courier.logo || "",
        code: courier.code,
        description: courier.description || "",
        driver: courier.driver || "",
        phone: courier.phone || "",
        email: courier.email || "",
        api_endpoint: courier?.api_details?.api_endpoint || null,
        api_key: courier?.api_details?.api_key || "",
        tracking_url: courier.tracking_url || "",
        is_active: courier.is_active,
        supports_cod: courier.supports_cod || false,
      });
    } else {
      reset({
        name: {
          ar: "",
          en: "",
        },
        logo: "",
        code: "",
        description: "",
        phone: "",
        email: "",
        driver: "",
        api_endpoint: null,
        api_key: "",
        tracking_url: "",
        is_active: true,
        supports_cod: false,
      });
    }
  }, [isOpen, courier, reset]);

  const onSubmit = async (data: ShippingCourierFormData) => {
    try {
      let success;

      if (courier) {
        success = await updateShippingCourier(courier.id, data);
      } else {
        success = await addShippingCourier(data);
      }

      if (success) {
        show("success", courier ? "تم التعديل بنجاح" : "تمت الإضافة بنجاح");
        closeModal();
      }
    } catch (error) {
      handleServerErrors(error, setError, [
        "name.ar",
        "name.en",
        "logo",
        "code",
        "description",
        "phone",
        "email",
        "api_endpoint",
        "api_key",
        "tracking_url",
        "driver",
        "is_active",
        "supports_cod",
      ]);
    } finally {
      setTimeout(() => hide(), 1000);
    }
  };

  const ActionButtons = () => (
    <div className="flex items-center justify-end gap-3">
      <Button type="button" variant="secondary" onClick={closeModal}>
        Cancel
      </Button>

      <Button
        type="submit"
        variant={courier ? "update" : "primary"}
        disabled={isLoading}
        onClick={() => formRef.current?.requestSubmit()}
      >
        {isLoading ? "Saving..." : courier ? "Update Courier" : "Create Courier"}
      </Button>
    </div>
  );

  return (
    <BaseModel
      isOpen={isOpen}
      isLoading={isLoading}
      closeModal={closeModal}
      action={<ActionButtons />}
      title={courier ? "تعديل شركة الشحن" : "إضافة شركة شحن جديدة"}
      description="أدخل بيانات شركة الشحن وربط الـ API إن وجد"
    >
      <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
        <div className="custom-scrollbar max-h-[60vh] overflow-y-auto pr-2 py-6 space-y-5">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Input
              label="اسم الشركة (بالعربية)"
              placeholder="بوسطة / دي إتش إل"
              {...register("name.ar")}
              error={errors.name?.ar?.message}
            />

            <Input
              label="اسم الشركة (بالإنجليزية)"
              placeholder="Bosta / DHL"
              {...register("name.en")}
              error={errors.name?.en?.message}
            />
          </div>

          <div className="grid grid-cols-1">
            <Input
              label="الكود"
              placeholder="bosta"
              {...register("code")}
              error={errors.code?.message}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-[var(--color-text-secondary)] px-1 text-right">
              الشعار (Logo)
            </label>
            <input 
              type="file" 
              onChange={(e) => setValue("logo", e.target.files?.[0] as any)} 
              className="w-full text-sm text-[var(--color-text-primary)] file:mr-4 file:py-2 file:px-4 file:rounded-[var(--radius-lg)] file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-primary)]/10 file:text-[var(--color-primary)] hover:file:bg-[var(--color-primary)]/20 cursor-pointer border border-[var(--color-border)] rounded-[var(--radius-lg)] p-2 bg-[var(--color-background)]"
            />
            {errors.logo?.message && (
              <span className="text-[10px] text-[var(--color-error)] font-medium px-1 text-right">
                {String(errors.logo.message)}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1">
            <TextArea
              label="الوصف"
              placeholder="Enter Description"
              {...register("description")}
              error={errors.description?.message}
              className="h-24 resize-y"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Input
              label="الهاتف"
              {...register("phone")}
              error={errors.phone?.message}
            />

            <Input
              label="الإيميل"
              {...register("email")}
              error={errors.email?.message}
            />
          </div>

          <div className="grid grid-cols-1 gap-5">
            <Input
              label="API Endpoint"
              placeholder="https://api.example.com"
              {...register("api_endpoint")}
              error={errors.api_endpoint?.message}
            />

            <Input
              label="API Key"
              {...register("api_key")}
              error={errors.api_key?.message}
            />

            <Input
              label="Tracking URL"
              placeholder="https://track.example.com/{id}"
              {...register("tracking_url")}
              error={errors.tracking_url?.message}
            />
          </div>

          <div className="grid grid-cols-1">
            <Input
              label="Driver / Integration Driver"
              placeholder="e.g., AramexDriver, BostaCustom"
              {...register("driver")}
              error={errors.driver?.message}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Controller
              name="is_active"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  label="Status"
                  options={[
                    { label: "Active", value: true },
                    { label: "Inactive", value: false },
                  ]}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />

            <Controller
              name="supports_cod"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  label="Supports COD"
                  options={[
                    { label: "Yes", value: true },
                    { label: "No", value: false },
                  ]}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </div>
          
        </div>
      </form>
    </BaseModel>
  );
}