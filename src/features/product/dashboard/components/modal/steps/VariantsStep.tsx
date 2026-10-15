import {
  useFormContext,
  useFieldArray,
  Controller,
  type FieldErrors,
} from "react-hook-form";
import {
  Plus,
  Trash2,
  Layers,
  AlertCircle,
  Box,
  Settings2Icon,
  Trash2Icon,
} from "lucide-react";

import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/ui/Input";
import CustomSelect from "@/shared/components/CustomSelect";
import type { ProductFormData } from "../../../../model/schema/productSchema";

const variantStatusOptions = [
  { label: "🟢 Active", value: "active" },
  { label: "🔴 Inactive", value: "inactive" },
];

type VariantCardProps = {
  index: number;
  removeVariant: (index: number) => void;
  errors: FieldErrors<ProductFormData>;
};

function VariantCard({ index, removeVariant, errors }: VariantCardProps) {
  const { control, register, watch } = useFormContext<ProductFormData>();

  // Watch variant ID for hidden field
  const variantId = watch(`variants.${index}.id`);

  const {
    fields: attributeFields,
    append: appendAttribute,
    remove: removeAttribute,
  } = useFieldArray({
    control,
    name: `variants.${index}.attributes` as const,
  });

  return (
    <div 
      className="
        group 
        relative 
        p-6 
        border 
        border-[var(--color-border)] 
        rounded-[var(--radius-xl)] 
        bg-[var(--card-bg)] 
        hover:border-[var(--color-primary)]/30 
        transition-all 
        animate-in 
        slide-in-from-right-5 
        shadow-[var(--shadow-xs)]
        backdrop-blur-xl
      "
    >
      <button
        type="button"
        onClick={() => removeVariant(index)}
        className="
          absolute 
          -top-2 
          start-3 
          p-1.5 
          bg-[var(--color-background)] 
          text-[var(--color-error)] 
          rounded-full 
          border 
          border-[var(--color-border)] 
          opacity-0 
          group-hover:opacity-100 
          transition-opacity 
          hover:bg-[var(--red-500)] 
          hover:text-white 
          shadow-[var(--shadow-xs)] 
          z-10
        "
        title="Remove Variant"
      >
        <Trash2 size={14} />
      </button>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start mb-6">
        <Controller
          name={`variants.${index}.id`}
          control={control}
          defaultValue={variantId}
          render={({ field }) => (
            <input type="hidden" {...field} value={field.value ?? ""} />
          )}
        />

        <div className="md:col-span-4">
          <Input
            label="رمز المخزن (SKU)"
            placeholder="TSH-RED-L"
            error={errors.variants?.[index]?.sku?.message}
            {...register(`variants.${index}.sku`)}
          />
        </div>

        <div className="md:col-span-3">
          <Input
            label="السعر"
            type="number"
            step="0.01"
            error={errors.variants?.[index]?.price?.message}
            {...register(`variants.${index}.price`, { valueAsNumber: true })}
          />
        </div>

        <div className="md:col-span-3">
          <Input
            label="الكمية"
            type="number"
            error={errors.variants?.[index]?.stock?.message}
            {...register(`variants.${index}.stock`, { valueAsNumber: true })}
          />
        </div>

        <div className="md:col-span-2">
          <Controller
            name={`variants.${index}.status`}
            control={control}
            render={({ field }) => (
              <CustomSelect
                label="الحالة"
                options={variantStatusOptions}
                value={field.value}
                onChange={field.onChange}
                error={errors.variants?.[index]?.status?.message}
              />
            )}
          />
        </div>
      </div>

      <div className="border-t border-[var(--color-border)] pt-5 mt-2">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Settings2Icon className="w-4 h-4 text-[var(--color-primary)]" />
            <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
              المواصفات (مثل اللون، المقاس)
            </h3>
          </div>

          <button
            type="button"
            onClick={() => appendAttribute({ key: "", value: "" })}
            className="
              text-xs 
              font-bold 
              text-[var(--color-primary)] 
              bg-[var(--color-primary)]/10 
              hover:bg-[var(--color-primary)]/20 
              px-3 
              py-1.5 
              rounded-[var(--radius-md)] 
              transition-all 
              border 
              border-[var(--color-primary)]/20
            "
          >
            + إضافة صفة
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {attributeFields.map((attr, attrIndex) => (
            <div
              key={attr.id}
              className="flex gap-2 items-center bg-[var(--color-surface-secondary)] p-2 rounded-[var(--radius-md)] border border-[var(--color-border)]"
            >
              <input
                className="
                  flex-1 
                  h-9 
                  px-3 
                  text-xs 
                  bg-[var(--color-background)] 
                  border 
                  border-[var(--color-border)] 
                  rounded-[var(--radius-md)] 
                  text-[var(--color-text-primary)]
                  placeholder-[var(--color-text-muted)]
                  outline-none 
                  focus:border-[var(--color-primary)] 
                  focus:ring-1 
                  focus:ring-[var(--color-primary)]/20
                "
                placeholder="الصفة (مثلاً: اللون)"
                {...register(
                  `variants.${index}.attributes.${attrIndex}.key` as const
                )}
              />

              <input
                className="
                  flex-1 
                  h-9 
                  px-3 
                  text-xs 
                  bg-[var(--color-background)] 
                  border 
                  border-[var(--color-border)] 
                  rounded-[var(--radius-md)] 
                  text-[var(--color-text-primary)]
                  placeholder-[var(--color-text-muted)]
                  outline-none 
                  focus:border-[var(--color-primary)] 
                  focus:ring-1 
                  focus:ring-[var(--color-primary)]/20
                "
                placeholder="القيمة"
                {...register(
                  `variants.${index}.attributes.${attrIndex}.value` as const
                )}
              />

              <button
                type="button"
                onClick={() => removeAttribute(attrIndex)}
                className="
                  p-1.5 
                  text-[var(--color-error)] 
                  hover:bg-[var(--red-500)]/10 
                  rounded-[var(--radius-sm)] 
                  transition-colors
                "
                title="Remove Attribute"
              >
                <Trash2Icon className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {attributeFields.length === 0 && (
          <p className="text-[11px] text-[var(--color-text-muted)] italic text-center py-2">
            لا توجد مواصفات مضافة لهذا المتغير
          </p>
        )}
      </div>

      {errors.variants?.[index] && (
        <div className="mt-4 flex items-center gap-1.5 text-[var(--color-error)] text-[11px] font-bold bg-[var(--red-500)]/10 p-2 rounded-[var(--radius-md)] border border-[var(--red-500)]/20">
          <AlertCircle size={14} />
          <span>يرجى التحقق من بيانات المتغير #{index + 1}</span>
        </div>
      )}
    </div>
  );
}

export default function VariantsStep() {
  const {
    control,
    formState: { errors },
  } = useFormContext<ProductFormData>();

  const createVariant = () => ({
    id: undefined,
    sku: "",
    price: 0,
    stock: 0,
    status: "active" as const,
    attributes: [{ key: "", value: "" }],
  });

  const {
    fields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "variants",
    keyName: "rhf_id"
  });

  const addNewVariant = () => {
    append(createVariant());
  };

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500 py-4">
      <div className="flex justify-between items-center bg-[var(--color-surface-secondary)] p-4 rounded-[var(--radius-xl)] border border-[var(--color-border)]">
        <div>
          <h3 className="text-lg font-bold text-[var(--color-text-primary)] flex items-center gap-2">
            <Layers className="text-[var(--color-primary)]" size={20} /> قائمة المتغيرات
          </h3>
          <p className="text-xs text-[var(--color-text-secondary)] mt-1">
            إدارة المخزون والأسعار والسمات الخاصة بكل متغير.
          </p>
        </div>

        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={addNewVariant}
          className="flex items-center gap-2 px-4 shadow-[var(--shadow-xs)]"
        >
          <Plus size={16} /> إضافة متغير
        </Button>
      </div>

      {fields.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed rounded-[var(--radius-xl)] border-[var(--color-border)] bg-[var(--color-surface-secondary)]/50 text-[var(--color-text-muted)]">
          <Box size={48} className="mb-3 opacity-20 text-[var(--color-text-primary)]" />
          <p className="font-medium text-sm">لم يتم إضافة أي متغيرات بعد.</p>
        </div>
      )}

      <div className="space-y-6">
        {fields.map((field, index) => (
          <VariantCard
            key={field.rhf_id}
            index={index}
            removeVariant={remove}
            errors={errors}
          />
        ))}
      </div>
    </div>
  );
}