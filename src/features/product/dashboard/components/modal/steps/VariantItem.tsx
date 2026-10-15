// src/features/product/dashboard/components/modal/steps/VariantItem.tsx
import { useFormContext, useFieldArray } from "react-hook-form";
import { PlusIcon, TrashIcon, Sparkles } from "lucide-react";
import type { ProductFormData } from "@/features/product/model/schema/productSchema";

interface VariantItemProps {
  index: number;
  remove: (index: number) => void;
  canRemove: boolean;
}

export default function VariantItem({ index, remove, canRemove }: VariantItemProps) {
  const { control, register, setValue, formState: { errors } } = useFormContext<ProductFormData>();

  const { fields: attrFields, append: appendAttr, remove: removeAttr } = useFieldArray({
    control,
    name: `variants.${index}.attributes` as const,
  });

  const generateRandomSku = () => {
    const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
    const skuValue = `SKU-${randomString}`;

    setValue(`variants.${index}.sku`, skuValue, { shouldValidate: true });
  };

  return (
    <div className="p-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface-secondary)]/30 space-y-4 relative">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-[var(--color-text-muted)]">
          متغير #{index + 1}
        </span>
        {canRemove && (
          <button
            type="button"
            onClick={() => remove(index)}
            className="text-red-500 hover:text-red-700 transition-colors"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* SKU */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-medium text-[var(--color-text-secondary)]">
              SKU
            </label>
            <button
              type="button"
              onClick={generateRandomSku}
              className="text-[10px] text-[var(--color-primary)] hover:underline flex items-center gap-1 font-medium"
              title="توليد SKU عشوائي"
            >
              <Sparkles className="w-3 h-3" /> توليد عشوائي
            </button>
          </div>
          <input
            type="text"
            {...register(`variants.${index}.sku`)}
            className="w-full px-3 py-2 text-sm rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--card-bg)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            placeholder="SKU-123"
          />
          {errors.variants?.[index]?.sku && (
            <span className="text-xs text-red-500 mt-1 block">
              {errors.variants[index]?.sku?.message}
            </span>
          )}
        </div>

        {/* Price */}
        <div>
          <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
            السعر
          </label>
          <input
            type="number"
            step="0.01"
            {...register(`variants.${index}.price`, { valueAsNumber: true })}
            className="w-full px-3 py-2 text-sm rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--card-bg)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            placeholder="0.00"
          />
          {errors.variants?.[index]?.price && (
            <span className="text-xs text-red-500 mt-1 block">
              {errors.variants[index]?.price?.message}
            </span>
          )}
        </div>

        {/* Stock */}
        <div>
          <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
            المخزون
          </label>
          <input
            type="number"
            {...register(`variants.${index}.stock`, { valueAsNumber: true })}
            className="w-full px-3 py-2 text-sm rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--card-bg)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            placeholder="0"
          />
          {errors.variants?.[index]?.stock && (
            <span className="text-xs text-red-500 mt-1 block">
              {errors.variants[index]?.stock?.message}
            </span>
          )}
        </div>
      </div>

      {/* Attributes Section (مثل اللون، المقاس) */}
      <div className="pt-3 border-t border-[var(--color-border)]/50 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[var(--color-text-secondary)]">
            خصائص المتغير (Attributes)
          </span>
          <button
            type="button"
            onClick={() => appendAttr({ key: "", value: "" })}
            className="text-xs text-[var(--color-primary)] hover:underline flex items-center gap-1 font-medium"
          >
            <PlusIcon className="w-3 h-3" /> إضافة خاصية
          </button>
        </div>

        <div className="space-y-2">
          {attrFields.map((attrField, attrIndex) => (
            <div key={attrField.id} className="flex items-center gap-3">
              <input
                type="text"
                placeholder="الاسم (مثل: Color)"
                {...register(`variants.${index}.attributes.${attrIndex}.key`)}
                className="flex-1 px-3 py-1.5 text-xs rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--card-bg)] text-[var(--color-text-primary)]"
              />
              <input
                type="text"
                placeholder="القيمة (مثل: Red)"
                {...register(`variants.${index}.attributes.${attrIndex}.value`)}
                className="flex-1 px-3 py-1.5 text-xs rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--card-bg)] text-[var(--color-text-primary)]"
              />
              <button
                type="button"
                onClick={() => removeAttr(attrIndex)}
                className="text-red-500 hover:text-red-700 p-1"
              >
                <TrashIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}