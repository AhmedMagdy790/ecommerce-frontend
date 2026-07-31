import React, { useEffect, useRef, useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusIcon, Trash2Icon, Settings2Icon, Truck } from "lucide-react";

import BaseModel from "@/shared/components/BaseModal";
import { Input } from "@/shared/components/Input";
import { Button } from "@/shared/components/Button";
import CustomSelect from "@/shared/components/CustomSelect";
import { useLang } from "@/shared/context/LanguageContext";

import { useProductVariantStore } from "../store/useProductVariantStore";
import {
  productVariantSchema,
  type ProductVariantFormData,
} from "../schema/productVariantSchema";
import { type IModal } from "@/shared/types/types";
import { useProductStore } from "@/features/dashboard/products/store/useProductStore";
import { handleServerErrors } from "@/shared/utils/handleServerError";
import { InputNumber } from "@/shared/components/InputNumber";

interface IProductVariantModal extends IModal {
  productId: number;
  variant?: any | null;
}

export default function ProductVariantModal({
  isOpen,
  closeModal,
  productId,
  variant,
}: IProductVariantModal) {
  const { lang } = useLang();
  const formRef = useRef<HTMLFormElement | null>(null);

  const [dynamicAttributes, setDynamicAttributes] = useState<{ key: string; value: string }[]>([]);

  const { addVariant, updateVariant, isLoading } = useProductVariantStore();

  const {
    fetchAdminProducts,
    adminProducts,
    isLoading: isLoadingProducts,
  } = useProductStore();

  const statusOptions = [
    { label: lang === "ar" ? "نشط" : "Active", value: "active" },
    { label: lang === "ar" ? "غير نشط" : "Inactive", value: "inactive" },
  ];

  const {
    register,
    handleSubmit,
    control,
    setError,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ProductVariantFormData>({
    resolver: zodResolver(productVariantSchema),
    defaultValues: {
      product_id: 0,
      sku: undefined,
      attributes: {},
      price: undefined,
      weight: 0,
      length: 0,
      width: 0,
      height: 0,
      stock: undefined,
      status: "active"
    }
  });

  useEffect(() => {
    fetchAdminProducts();
  }, [fetchAdminProducts]);

  const productsOptions = useMemo(() => {
    const options = adminProducts.map((product: any) => ({
      label: product?.name,
      value: product?.id
    }));
    return options;
  }, [adminProducts]);

  // =========================
  // إعادة ضبط النموذج (Reset)
  // =========================
  useEffect(() => {
    if (isOpen) {
      if (variant) {
        reset({
          product_id: variant?.product?.id ? Number(variant.product.id) : undefined,
          sku: variant.sku,
          price: variant.price,
          weight: variant.weight,
          length: variant.length,
          width: variant.width,
          height: variant.height,
          stock: variant.stock,
          status: variant.status,
        });

        const attrs = variant.attributes
          ? Object.entries(variant.attributes).map(([key, value]) => ({ key, value: String(value) }))
          : [];
        setDynamicAttributes(attrs);
      } else {
        reset({
          product_id: undefined,
          sku: "",
          price: 0,
          stock: 0,
          status: "active",
        });
        setDynamicAttributes([]);
      }
    }
  }, [isOpen, variant, reset]);

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

  // =========================
  // الارسال (Submit)
  // =========================
  const onSubmit = async (data: ProductVariantFormData) => {
    const attributesObj = dynamicAttributes.reduce((acc, curr) => {
      if (curr.key.trim()) acc[curr.key.trim()] = curr.value;
      return acc;
    }, {} as Record<string, string>);

    const payload = { ...data, attributes: attributesObj };

    try {
      if (variant) {
        await updateVariant(variant.id, payload);
      } else {
        await addVariant(productId, payload);
      }
      closeModal();
    } catch (error) {
      handleServerErrors(error, setError, [
        'product_id',
        'sku',
        'price',
        'stock',
        'status',
        'weight',
        'length',
        'width',
        'height',
      ]);
    }
  };

  const ActionButtons = () => (
    <div className="flex items-center justify-end gap-3 w-full">
      <Button type="button" variant="secondary" onClick={closeModal} size="sm">
        {lang === "ar" ? "إلغاء" : "Cancel"}
      </Button>
      <Button
        type="button"
        variant={variant ? "update" : "primary"}
        size="sm"
        isLoading={isLoading}
        onClick={() => formRef.current?.requestSubmit()}
      >
        {variant
          ? (lang === "ar" ? "تحديث المتغير" : "Update Variant")
          : (lang === "ar" ? "إنشاء متغير" : "Create Variant")}
      </Button>
    </div>
  );

  return (
    <BaseModel
      isOpen={isOpen}
      closeModal={closeModal}
      title={variant ? (lang === "ar" ? "تعديل المتغير" : "Edit Variant") : (lang === "ar" ? "إضافة متغير" : "Add Variant")}
      description={lang === "ar" ? "إدارة تفاصيل ومخزون متغير المنتج" : "Manage product variant details and stock"}
      action={<ActionButtons />}
      maxWidth="max-w-2xl"
    >
      <form
        ref={formRef}
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 py-4"
      >
        {/* Basic Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label={lang === "ar" ? "رمز المخزن (SKU)" : "SKU"}
            placeholder="e.g. IPHONE-15-RED"
            {...register("sku")}
            error={errors.sku?.message}
          />

          <Input
            label={lang === "ar" ? "السعر" : "Price"}
            type="number"
            placeholder="0.00"
            {...register("price", { valueAsNumber: true })}
            error={errors.price?.message}
          />

          <Input
            label={lang === "ar" ? "الكمية المتوفرة" : "Stock Quantity"}
            type="number"
            {...register("stock", { valueAsNumber: true })}
            error={errors.stock?.message}
          />

          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <CustomSelect
                label={lang === "ar" ? "الحالة" : "Status"}
                options={statusOptions}
                value={field.value?.toString() || ""}
                onChange={field.onChange}
                error={errors.status?.message}
              />
            )}
          />
        </div>

        {/* Shipping Dimensions Box */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[var(--card-bg)] p-5 rounded-[var(--radius-xl)] border border-[var(--color-border)] shadow-[var(--shadow-xs)]">
          <InputNumber
            label="الوزن (كجم)"
            step={0.01}
            min={0}
            placeholder="0.00"
            icon={<Truck size={16} />}
            {...register("weight", { valueAsNumber: true })}
            error={errors.weight?.message}
          />

          <InputNumber
            label="الطول (سم)"
            step={0.1}
            min={0}
            placeholder="0.0"
            {...register("length", { valueAsNumber: true })}
            error={errors.length?.message}
          />

          <InputNumber
            label="العرض (سم)"
            step={0.1}
            min={0}
            placeholder="0.0"
            {...register("width", { valueAsNumber: true })}
            error={errors.width?.message}
          />

          <InputNumber
            label="الارتفاع (سم)"
            step={0.1}
            min={0}
            placeholder="0.0"
            {...register("height", { valueAsNumber: true })}
            error={errors.height?.message}
          />
        </div>

        {/* Product Select */}
        <Controller
          name="product_id"
          control={control}
          render={({ field }) => (
            <CustomSelect
              label="Products (Optional)"
              disabled={isLoading || isLoadingProducts}
              placeholder="Select Product..."
              options={productsOptions}
              value={field.value || ""}
              onChange={field.onChange}
              error={errors.product_id?.message}
            />
          )}
        />

        {/* Dynamic Attributes Section */}
        <div className="border-t border-[var(--color-border)] pt-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Settings2Icon className="w-4 h-4 text-[var(--color-primary)]" />
              <h3 className="text-xs font-bold text-[var(--color-text-secondary)]">
                {lang === "ar" ? "المواصفات الإضافية" : "Additional Attributes"}
              </h3>
            </div>
            <button
              type="button"
              onClick={addAttribute}
              className="flex items-center gap-1 text-xs font-bold text-[var(--color-primary)] hover:underline cursor-pointer"
            >
              <PlusIcon className="w-3 h-3" />
              {lang === "ar" ? "إضافة صفة" : "Add Attribute"}
            </button>
          </div>

          <div className="space-y-3">
            {dynamicAttributes.map((attr, index) => (
              <div key={index} className="flex gap-3 items-start animate-in fade-in slide-in-from-top-1">
                <div className="flex-1">
                  <input
                    className="
                      w-full 
                      h-10 
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
                    placeholder={lang === "ar" ? "الصفة (مثلاً: اللون)" : "Key (e.g. Color)"}
                    value={attr.key}
                    onChange={(e) => updateAttr(index, 'key', e.target.value)}
                  />
                </div>
                <div className="flex-1">
                  <input
                    className="
                      w-full 
                      h-10 
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
                    placeholder={lang === "ar" ? "القيمة (مثلاً: أحمر)" : "Value (e.g. Red)"}
                    value={attr.value}
                    onChange={(e) => updateAttr(index, 'value', e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeAttribute(index)}
                  className="mt-2 p-1 text-[var(--red-500)] hover:scale-110 transition-transform cursor-pointer"
                  title="Remove attribute"
                >
                  <Trash2Icon className="w-4 h-4" />
                </button>
              </div>
            ))}

            {dynamicAttributes.length === 0 && (
              <p className="text-center py-3 text-xs text-[var(--color-text-muted)] italic">
                {lang === "ar" ? "لا توجد مواصفات مضافة (مثل اللون أو الحجم)" : "No attributes added (e.g. Color or Size)"}
              </p>
            )}
          </div>
        </div>
      </form>
    </BaseModel>
  );
}