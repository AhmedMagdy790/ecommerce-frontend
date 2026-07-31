import React from "react";
import {
  useFormContext,
  useFieldArray,
  Controller,
  FieldErrors,
} from "react-hook-form";
// import { ProductFormData } from "../../schema/productSchema";
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
import { Input } from "@/shared/components/Input";
import CustomSelect from "@/shared/components/CustomSelect";
import { v4 as uuidv4 } from "uuid";
import type { ProductFormData } from "@/features/dashboard/products/schema/productSchema";


const variantStatusOptions = [
  { label: "🟢 Active", value: "active" },
  { label: "🔴 Inactive", value: "inactive" },
];

type VariantAttributes = {
  key: string;
  value: string;
};

type VariantCardProps = {
  index: number;
  removeVariant: (index: number) => void;
  errors: FieldErrors<ProductFormData>;
};

function VariantCard({ index, removeVariant, errors }: VariantCardProps) {

  const { control, register, watch } = useFormContext<ProductFormData>();

  // احصل على الـ ID من watch
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
    <div className="group relative p-6 border dark:border-gray-800 rounded-2xl bg-white dark:bg-gray-900/50 hover:border-brand-500/30 transition-all animate-in slide-in-from-right-5 shadow-sm">
      <button
        type="button"
        onClick={() => removeVariant(index)}
        className="absolute -top-2 left-3 p-1.5 bg-white dark:bg-gray-800 text-red-500 rounded-full border border-gray-200 dark:border-gray-700 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white shadow-sm z-10"
      >
        <Trash2 size={14} />
      </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start mb-6">
          <Controller
          name={`variants.${index}.id`}
          control={control}
          defaultValue={undefined}
          render={({ field }) => (
            <input type="hidden" {...field} />
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

      <div className="border-t border-gray-100 dark:border-gray-800 pt-5 mt-2">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Settings2Icon className="size-4 text-brand-500" />
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300">
              المواصفات (مثل اللون، المقاس)
            </h3>
          </div>

          <button
            type="button"
            onClick={() => appendAttribute({ key: "", value: "" })}
            className="text-xs font-bold text-brand-600 hover:bg-brand-50 px-3 py-1.5 rounded-lg transition-all border border-brand-100 dark:border-brand-500/20"
          >
            + إضافة صفة
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {attributeFields.map((attr, attrIndex) => (
            <div
              key={attr.id}
              className="flex gap-2 items-center bg-gray-50 dark:bg-white/5 p-2 rounded-xl border border-gray-100 dark:border-gray-800"
            >
              <input
                className="flex-1 h-9 px-3 text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20"
                placeholder="الصفة (مثلاً: اللون)"
                {...register(
                  `variants.${index}.attributes.${attrIndex}.key` as const
                )}
              />

              <input
                className="flex-1 h-9 px-3 text-xs bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500/20"
                placeholder="القيمة"
                {...register(
                  `variants.${index}.attributes.${attrIndex}.value` as const
                )}
              />

              <button
                type="button"
                onClick={() => removeAttribute(attrIndex)}
                className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition-colors"
              >
                <Trash2Icon className="size-4" />
              </button>
            </div>
          ))}
        </div>

        {attributeFields.length === 0 && (
          <p className="text-[11px] text-gray-400 italic text-center py-2">
            لا توجد مواصفات مضافة لهذا المتغير
          </p>
        )}
      </div>

      {errors.variants?.[index] && (
        <div className="mt-4 flex items-center gap-1.5 text-red-500 text-[11px] font-bold bg-red-50 dark:bg-red-500/5 p-2 rounded-lg border border-red-100 dark:border-red-500/10">
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
    status: "active",
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


  console.log("fields", fields)


  const addNewVariant = () => {
    append(createVariant());
  };

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500 py-4">
      <div className="flex justify-between items-center bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
        <div>
          <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <Layers className="text-brand-500" size={20} /> قائمة المتغيرات
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            إدارة المخزون والأسعار والسمات الخاصة بكل متغير.
          </p>
        </div>

        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={addNewVariant}
          className="flex items-center gap-2 px-4 shadow-theme-md"
        >
          <Plus size={16} /> إضافة متغير
        </Button>
      </div>

      {fields.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed rounded-2xl border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-white/5 text-gray-400">
          <Box size={48} className="mb-3 opacity-20" />
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