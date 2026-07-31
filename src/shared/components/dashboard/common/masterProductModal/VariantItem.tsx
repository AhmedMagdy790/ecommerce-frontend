import React, { useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/shared/components/Input";
import { Button } from "@/shared/components/Button";
import CustomSelect from "@/shared/components/CustomSelect";
import { PlusIcon, Settings2Icon, Trash2Icon } from "lucide-react";
import { useLang } from "@/shared/context/LanguageContext";

const statusOptions = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" }
];

export default function VariantItem({ index, remove }: any) {
  const { lang } = useLang();
  const { register, control } = useFormContext();


    // =========================
  // إدارة السمات (Attributes Logic)
  // =========================
  const addAttribute = () => {
    setDynamicAttributes([...dynamicAttributes, { key: "", value: "" }]);
  };

  const updateAttr = (index: number, field: 'key' | 'value', val: string) => {
    const updated = [...dynamicAttributes];
    updated[index][field] = val;

    setDynamicAttributes(updated);
  };

  const removeAttribute = (index: number) => {
    setDynamicAttributes(dynamicAttributes.filter((_, i) => i !== index));
  };

  return (
    <div className="border p-4 mb-4 rounded-lg">

      <Input
        label="SKU"
        {...register(`variants.${index}.sku`)}
      />

      <Input
        label="Price"
        type="number"
        {...register(`variants.${index}.price`, { valueAsNumber: true })}
      />

      <Input
        label="Stock"
        type="number"
        {...register(`variants.${index}.stock`, { valueAsNumber: true })}
      />

      <Controller
        name={`variants.${index}.status`}
        control={control}
        render={({ field }) => (
          <CustomSelect
            label="Status"
            options={statusOptions}
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />

      <div className="border-t border-gray-100 dark:border-gray-800  pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Settings2Icon className="size-4 text-brand-500" />
            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400">
              {lang === "ar" ? "المواصفات الإضافية" : "Additional Attributes"}
            </h3>
          </div>
          <button
            type="button"
            onClick={addAttribute}
            className="flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700 transition-colors"
          >
            <PlusIcon className="size-3" />
            {lang === "ar" ? "إضافة صفة" : "Add Attribute"}
          </button>
        </div>

        <div className="space-y-3 mb-10 text-gray-400 dark:text-gray-300 ">
          {dynamicAttributes.map((attr, index) => (
            <div key={index} className="flex gap-3 items-start animate-in fade-in slide-in-from-top-1">
              <div className="flex-1">
                <input
                  className="w-full h-10 px-3 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-800 rounded-lg outline-none focus:ring-2 ring-brand-500/20"
                  placeholder={lang === "ar" ? "الصفة (مثلاً: اللون)" : "Key (e.g. Color)"}
                  value={attr.key}
                  onChange={(e) => updateAttr(index, 'key', e.target.value)}
                />
              </div>
              <div className="flex-1">
                <input
                  className="w-full h-10 px-3 text-sm bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-gray-800 rounded-lg outline-none focus:ring-2 ring-brand-500/20"
                  placeholder={lang === "ar" ? "القيمة (مثلاً: أحمر)" : "Value (e.g. Red)"}
                  value={attr.value}
                  onChange={(e) => updateAttr(index, 'value', e.target.value)}
                />
              </div>
              <button
                type="button"
                onClick={() => removeAttribute(index)}
                className="mt-2.5 p-1 text-red-400 hover:text-red-600 transition-colors"
              >
                <Trash2Icon className="size-4" />
              </button>
            </div>
          ))}

          {dynamicAttributes.length === 0 && (
            <p className="text-center py-4 text-xs text-gray-400 italic">
              {lang === "ar" ? "لا توجد مواصفات مضافة (مثل اللون أو الحجم)" : "No attributes added (e.g. Color or Size)"}
            </p>
          )}
        </div>
      </div>

      <Button
        type="button"
        variant="danger"
        onClick={() => remove(index)}
      >
        Delete
      </Button>
    </div>
  );
}