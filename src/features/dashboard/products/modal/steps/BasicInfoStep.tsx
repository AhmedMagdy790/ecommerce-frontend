import React, { useMemo } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Package, Tag } from "lucide-react";

import { Input } from "@/shared/components/Input";
import { Textarea } from "@/shared/components/Textarea";
import CustomSelect from "@/shared/components/CustomSelect";
import { useCategoryStore } from "@/features/dashboard/category/store/useCategoryStore";
import type { ProductFormData } from "../../schema/productSchema";

const statusOptions = [
  { label: "🟢 Active", value: "active" },
  { label: "📦 Archived", value: "archived" },
  { label: "📝 Draft", value: "draft" },
];

export default function BasicInfoStep() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<ProductFormData>();

  const { adminCategories } = useCategoryStore();
  const categoryOptions = useMemo(() => {
    return (adminCategories || []).map((cat) => ({
      label: cat.name,
      value: cat.id.toString(),
    }));
  }, [adminCategories]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 py-4">
      {/* Name and Brand Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Input
          label="اسم المنتج"
          placeholder="مثال: تيشيرت قطني أسود"
          error={errors.name?.message}
          icon={<Package size={16} />}
          {...register("name")}
        />

        <Input
          label="الماركة (Brand)"
          placeholder="Apple, Nike..."
          error={errors.brand?.message}
          icon={<Tag size={16} />}
          {...register("brand")}
        />
      </div>

      {/* Category and Status Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Controller
          name="category_id"
          control={control}
          render={({ field }) => (
            <CustomSelect
              label="القسم (Category)"
              options={categoryOptions}
              value={field.value?.toString() || ""}
              onChange={field.onChange}
              error={errors.category_id?.message}
            />
          )}
        />

        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <CustomSelect
              label="حالة النشر"
              options={statusOptions}
              value={field.value}
              onChange={field.onChange}
              error={errors.status?.message}
            />
          )}
        />
      </div>

      {/* Description Textarea */}
      <Textarea
        label="وصف المنتج"
        placeholder="اكتب وصفاً تفصيلياً للمنتج..."
        error={errors.description?.message}
        {...register("description")}
      />
    </div>
  );
}