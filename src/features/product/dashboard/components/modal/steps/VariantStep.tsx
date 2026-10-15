// src/features/product/dashboard/components/modal/steps/VariantStep.tsx
import { useFormContext, useFieldArray } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { PlusIcon } from "lucide-react";
import { Button } from "@/shared/components/Button";
import VariantItem from "./VariantItem";
import type { ProductFormData } from "@/features/product/model/schema/productSchema";

export default function VariantStep() {
  const { t } = useTranslation("product");
  const { control } = useFormContext<ProductFormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
          {t("modal.variants.title", "متغيرات المنتج")}
        </h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            append({
              sku: "",
              price: 0,
              stock: 0,
              status: "active",
              attributes: [],
            })
          }
          className="flex items-center gap-2"
        >
          <PlusIcon className="w-4 h-4" />
          {t("modal.variants.add", "إضافة متغير")}
        </Button>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <VariantItem 
            key={field.id} 
            index={index} 
            remove={remove} 
            canRemove={fields.length > 1} 
          />
        ))}
      </div>
    </div>
  );
}