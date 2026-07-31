import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/shared/components/Input";
import { Button } from "@/shared/components/Button";
import CustomSelect from "@/shared/components/CustomSelect";

import { handleServerErrors } from "@/shared/utils/handleServerError";
import { useLang } from "@/shared/context/LanguageContext";
import { useProductVariantStore } from "@/features/productsVariant/store/useProductVariantStore";
import { ProductVariantFormData, productVariantSchema } from "@/features/productsVariant/schema/productVariantSchema";

interface Props {
  productId?: number; // optional
  variant?: any;
  onSuccess?: () => void;
}

export default function ProductVariantForm({
  productId,
  variant,
  onSuccess,
}: Props) {
  const { lang } = useLang();
  const { addVariant, updateVariant, isLoading } = useProductVariantStore();

  const [dynamicAttributes, setDynamicAttributes] = useState<
    { key: string; value: string }[]
  >([]);

  const statusOptions = [
    { label: lang === "ar" ? "نشط" : "Active", value: "active" },
    { label: lang === "ar" ? "غير نشط" : "Inactive", value: "inactive" },
  ];

  const {
    register,
    handleSubmit,
    control,
    setError,
    reset,
    formState: { errors },
  } = useForm<ProductVariantFormData>({
    resolver: zodResolver(productVariantSchema),
    defaultValues: {
      product_id: productId,
      sku: "",
      price: 0,
      stock: 0,
      status: "active",
    },
  });

  // fill edit
  useEffect(() => {
    if (variant) {
      reset({
        product_id: variant.product_id,
        sku: variant.sku,
        price: variant.price,
        stock: variant.stock,
        status: variant.status,
      });

      const attrs = variant.attributes
        ? Object.entries(variant.attributes).map(([key, value]) => ({
            key,
            value: String(value),
          }))
        : [];

      setDynamicAttributes(attrs);
    }
  }, [variant, reset]);

  // attributes
  const addAttribute = () => {
    setDynamicAttributes([...dynamicAttributes, { key: "", value: "" }]);
  };

  const updateAttr = (index: number, field: "key" | "value", val: string) => {
    const updated = [...dynamicAttributes];
    updated[index][field] = val;
    setDynamicAttributes(updated);
  };

  const removeAttribute = (index: number) => {
    setDynamicAttributes(dynamicAttributes.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ProductVariantFormData) => {
    const attributesObj = dynamicAttributes.reduce((acc, curr) => {
      if (curr.key.trim()) acc[curr.key.trim()] = curr.value;
      return acc;
    }, {} as Record<string, string>);

    const payload = {
      ...data,
      product_id: productId ?? data.product_id,
      attributes: attributesObj,
    };

    try {
      if (variant) {
        await updateVariant(variant.id, payload);
      } else {
        await addVariant(payload.product_id!, payload);
      }

      onSuccess?.();
    } catch (error) {
      handleServerErrors(error, setError, [
        "product_id",
        "sku",
        "price",
        "stock",
        "status",
      ]);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        <Input
          label="SKU"
          {...register("sku")}
          error={errors.sku?.message}
        />

        <Input
          label="Price"
          type="number"
          {...register("price", { valueAsNumber: true })}
          error={errors.price?.message}
        />

        <Input
          label="Stock"
          type="number"
          {...register("stock", { valueAsNumber: true })}
          error={errors.stock?.message}
        />

        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <CustomSelect
              label="Status"
              options={statusOptions}
              value={field.value}
              onChange={field.onChange}
              error={errors.status?.message}
            />
          )}
        />
      </div>

      {/* attributes */}
      <div className="border-t pt-4">
        <div className="flex justify-between mb-3">
          <h3>Attributes</h3>
          <button type="button" onClick={addAttribute}>
            + Add
          </button>
        </div>

        {dynamicAttributes.map((attr, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              value={attr.key}
              onChange={(e) => updateAttr(index, "key", e.target.value)}
              placeholder="Key"
              className="border px-2 py-1"
            />
            <input
              value={attr.value}
              onChange={(e) => updateAttr(index, "value", e.target.value)}
              placeholder="Value"
              className="border px-2 py-1"
            />
            <button type="button" onClick={() => removeAttribute(index)}>
              x
            </button>
          </div>
        ))}
      </div>

      <Button type="submit" isLoading={isLoading}>
        {variant ? "Update Variant" : "Create Variant"}
      </Button>
    </form>
  );
}
