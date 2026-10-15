import { useTranslation } from "react-i18next";
import { FormProvider } from "react-hook-form";
import { Tag, DollarSign, Package, Scale, Ruler } from "lucide-react";

import BaseModal from "@/shared/components/BaseModal";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/ui/Input";

import type { ProductVariant } from "../../../model/types/productVariant.types";
import { useProductVariantForm } from "../../hook/useProductVariantForm";

type Props = {
  isOpen: boolean;
  closeModal: () => void;
  variant?: ProductVariant | null;
};

export default function ProductVariantModal({ isOpen, closeModal, variant }: Props) {
  const { t } = useTranslation("product");

  const {
    methods,
    onSubmit,
    isSubmitting,
    resetForm,
    formError,
    isEditMode,
  } = useProductVariantForm(variant, closeModal, isOpen);

  const {
    register,
    formState: { errors },
  } = methods;

  const title = isEditMode
    ? t("modal.edit_variant_title", "تعديل متغير المنتج")
    : t("modal.create_variant_title", "إضافة متغير جديد للمنتج");

  const handleClose = () => {
    resetForm();
    closeModal();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      closeModal={handleClose}
      title={title}
      maxWidth="max-w-xl"
    >
      <FormProvider {...methods}>
        <form onSubmit={onSubmit} className="flex flex-col">
          <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto px-1">
            {/* عرض رسالة الخطأ العامة إن وجدت */}
            {(formError || errors.root?.server) && (
              <div className="rounded-lg border border-[var(--color-error)]/30 bg-[var(--color-error)]/10 px-4 py-3 text-sm text-[var(--color-error)]">
                {formError || errors.root?.server?.message}
              </div>
            )}

            {/* رمز التخزين SKU */}
            <Input
              type="text"
              label={t("modal.variants.sku", "رمز التخزين (SKU)")}
              placeholder="SKU-EXAMPLE-01"
              error={errors.sku?.message}
              icon={<Tag size={16} />}
              {...register("sku")}
            />

            <div className="grid grid-cols-2 gap-4">
              {/* السعر */}
              <Input
                type="number"
                step="0.01"
                label={t("modal.variants.price", "السعر")}
                placeholder="0.00"
                error={errors.price?.message}
                icon={<DollarSign size={16} />}
                {...register("price", { valueAsNumber: true })}
              />

              {/* المخزون */}
              <Input
                type="number"
                label={t("modal.variants.stock", "المخزون")}
                placeholder="0"
                error={errors.stock?.message}
                icon={<Package size={16} />}
                {...register("stock", { valueAsNumber: true })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* الوزن */}
              <Input
                type="number"
                step="0.01"
                label={t("modal.variants.weight", "الوزن (كغ)")}
                placeholder="0.00"
                error={errors.weight?.message}
                icon={<Scale size={16} />}
                {...register("weight", { valueAsNumber: true })}
              />

              {/* الطول */}
              <Input
                type="number"
                step="0.01"
                label={t("modal.variants.length", "الطول (سم)")}
                placeholder="0.00"
                error={errors.length?.message}
                icon={<Ruler size={16} />}
                {...register("length", { valueAsNumber: true })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* العرض */}
              <Input
                type="number"
                step="0.01"
                label={t("modal.variants.width", "العرض (سم)")}
                placeholder="0.00"
                error={errors.width?.message}
                icon={<Ruler size={16} />}
                {...register("width", { valueAsNumber: true })}
              />

              {/* الارتفاع */}
              <Input
                type="number"
                step="0.01"
                label={t("modal.variants.height", "الارتفاع (سم)")}
                placeholder="0.00"
                error={errors.height?.message}
                icon={<Ruler size={16} />}
                {...register("height", { valueAsNumber: true })}
              />
            </div>
          </div>

          {/* الأزرار السفليّة */}
          <div className="flex justify-end items-center gap-3 pt-6 border-t border-[var(--color-border)] mt-2">
            <Button type="button" variant="ghost" onClick={handleClose}>
              {t("modal.actions.cancel", "إلغاء")}
            </Button>
            <Button 
              type="submit" 
              isLoading={isSubmitting}
              variant={isEditMode ? "update" : "primary"}
            >
              {isEditMode 
                ? t("modal.actions.save", "حفظ التعديلات") 
                : t("modal.actions.submit", "إتمام الإضافة")}
            </Button>
          </div>
        </form>
      </FormProvider>
    </BaseModal>
  );
}