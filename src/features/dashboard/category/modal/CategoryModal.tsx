import React, { useEffect, useRef, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLang } from "@/shared/context/LanguageContext";
import { Input } from "@/shared/components/Input";
import BaseModel from "@/shared/components/BaseModal";
import { useStatusStore } from "@/shared/components/StatusOverlay/statusStore";
import { type IModal } from "@/shared/types/types";

import { useCategoryStore } from "../store/useCategoryStore";
import { categorySchema, type CategoryFormData } from "../schema/categorySchema";
import { type ICategory } from "../types/types";
import { Button } from "@/shared/components/Button";
import CustomSelect from "@/shared/components/CustomSelect";
import { Textarea } from "@/shared/components/Textarea";
import { handleServerErrors } from "@/shared/utils/handleServerError";
import { Trash2, UploadCloud } from "lucide-react";

interface ICategoryModal extends IModal {
  category?: ICategory | null;
}

const statusOptions = [
  { label: "🟢 Active", value: "active" },
  { label: "🔴 Inactive", value: "inactive" },
];

export default function CategoryModal({ isOpen, closeModal, category }: ICategoryModal) {
  const { lang, t } = useLang();
  const { adminCategories, addCategory, updateCategory, isLoading } = useCategoryStore();
  const { show, hide } = useStatusStore.getState();
  const [featuredPreview, setFeaturedPreview] = useState<string | null>(null);
  
  const formRef = useRef<HTMLFormElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    watch,
    setError,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      description: "",
      image: null,
      parent_id: null,
      status: "active",
    },
  });

  const featuredImage = watch("image");

  useEffect(() => {
    if (!featuredImage) {
      setFeaturedPreview(null);
      return;
    }

    if (featuredImage instanceof File) {
      const url = URL.createObjectURL(featuredImage);
      setFeaturedPreview(url);
      return () => URL.revokeObjectURL(url);
    } else if (typeof featuredImage === "string") {
      setFeaturedPreview(featuredImage);
    }
  }, [featuredImage]);

  useEffect(() => {
    if (isOpen) {
      if (category) {
        reset({
          name: category.name,
          description: category.description || "",
          parent_id: category.parent_id,
          status: category.status,
          image: category.image || null,
        });
        setFeaturedPreview(category.image || null);
      } else {
        reset({ name: "", description: "", parent_id: null, status: "active", image: null });
        setFeaturedPreview(null);
      }
    }
  }, [category, isOpen, reset]);

  const categoryOptions = useMemo(() => {
    const options = adminCategories
      .filter((cat: any) => cat.id !== category?.id)
      .map((cat: any) => ({
        label: cat?.name,
        value: cat?.id,
      }));

    return [
      {
        label: lang === "ar" ? "قسم رئيسي (بلا أب)" : "Main Category (None)",
        value: "",
      },
      ...options,
    ];
  }, [adminCategories, category, lang]);

  const onSubmit = async (data: CategoryFormData) => {
    try {
      let success;
      if (category) {
        success = await updateCategory(category.id, data);
      } else {
        success = await addCategory(data);
      }

      if (success) {
        show("success", category ? "تم التعديل بنجاح" : "تمت الإضافة بنجاح");
        closeModal();
      }
    } catch (error) {
      handleServerErrors(error, setError, [
        'name',
        'description',
        'parent_id',
        'image',
        'status',
      ]);
    } finally {
      setTimeout(() => hide(), 1200);
    }
  };

  const ActionButtons = () => {
    return (
      <div className="flex items-center justify-end gap-3 w-full">
        <Button
          type="button"
          variant="secondary"
          onClick={closeModal}
          size="sm"
        >
          Cancel
        </Button>

        <Button
          variant={category ? "update" : "primary"}
          onClick={() => formRef?.current?.requestSubmit()}
          type="button"
          isLoading={isLoading}
          size="sm"
        >
          {category ? "Update Category" : "Save Category"}
        </Button>
      </div>
    );
  };

  return (
    <BaseModel
      isOpen={isOpen}
      isLoading={isLoading}
      closeModal={closeModal}
      action={<ActionButtons />}
      title={category ? "تعديل القسم" : "إضافة قسم جديد"}
      description="أدخل تفاصيل القسم لإدارته في المتجر"
      maxWidth="max-w-xl"
    >
      <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <div className="space-y-6 py-4">
          {/* Name Input */}
          <Input
            label="اسم القسم"
            placeholder="مثال: إلكترونيات"
            error={errors.name?.message}
            {...register("name")}
          />

          {/* Image Uploader */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[var(--color-text-secondary)] px-1 block">
              صورة القسم
            </label>
            <div className="relative w-full h-44 border-2 border-dashed border-[var(--color-border)] rounded-[var(--radius-xl)] flex flex-col items-center justify-center bg-[var(--color-surface-secondary)] hover:bg-[var(--color-surface-secondary)]/80 transition-all group overflow-hidden shadow-[var(--shadow-xs)]">
              {featuredPreview ? (
                <>
                  <img src={featuredPreview} alt="Category" className="w-full h-full object-contain p-2" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      type="button"
                      onClick={() => { 
                        setValue("image", null, { shouldValidate: true }); 
                        setFeaturedPreview(null);
                      }}
                      className="p-2 bg-[var(--red-500)] text-white rounded-full hover:scale-110 transition-transform shadow-[var(--shadow-xs)]"
                      title="Remove image"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </>
              ) : (
                <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
                  <UploadCloud size={28} className="text-[var(--color-primary)] mb-2" />
                  <span className="text-xs font-medium text-[var(--color-text-primary)]">اضغط لرفع صورة القسم</span>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setValue("image", file, { shouldValidate: true });
                      }
                    }}
                  />
                </label>
              )}
            </div>
            {errors.image && <p className="text-xs text-[var(--color-error)] font-medium px-1">{errors.image.message?.toString()}</p>}
          </div>

          {/* Selectors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  label="الحالة"
                  disabled={isLoading}
                  placeholder="Select Status..."
                  options={statusOptions}
                  value={field.value?.toString() || ""}
                  onChange={field.onChange}
                  error={errors.status?.message}
                />
              )}
            />

            <Controller
              name="parent_id"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  label="القسم الأب (اختياري)"
                  disabled={isLoading}
                  placeholder="Select parent Category..."
                  options={categoryOptions}
                  value={field.value !== null && field.value !== undefined ? String(field.value) : ""}
                  onChange={(val) => field.onChange(val === "" ? null : Number(val))}
                  error={errors.parent_id?.message}
                />
              )}
            />
          </div>

          {/* Description Textarea */}
          <Textarea
            label="وصف القسم"
            placeholder="اكتب وصفاً مختصراً للقسم..."
            error={errors.description?.message}
            {...register("description")}
          />
        </div>
      </form>
    </BaseModel>
  );
}